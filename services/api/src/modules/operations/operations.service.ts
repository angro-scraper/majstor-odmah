import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "@balkanworks/database";

const DEFAULT_LAUNCH_TARGETS = {
  activeBusinesses: 500,
  registeredUsers: 50_000,
  activeOffers: 1_000,
  verifiedBusinessRate: 60,
} as const;

@Injectable()
export class OperationsService {
  constructor(private readonly prisma: PrismaService) {}

  async businessOnboarding(ownerId: string, businessId: string) {
    const business = await this.prisma.business.findFirst({
      where: { id: businessId, ownerId, deletedAt: null },
      include: { locations: { where: { deletedAt: null } }, services: { where: { deletedAt: null } }, images: { where: { deletedAt: null } }, offers: { where: { deletedAt: null } } },
    });
    if (!business) throw new ForbiddenException("BUSINESS_OWNERSHIP_REQUIRED");

    const steps = [
      { key: "profile", label: "Osnovni podaci", complete: Boolean(business.name && business.description && (business.phone || business.email)) },
      { key: "location", label: "Lokacija", complete: business.locations.length > 0 },
      { key: "services", label: "Usluge", complete: business.services.length > 0 },
      { key: "images", label: "Fotografije", complete: business.images.length >= 3 },
      { key: "verification", label: "Verifikacija", complete: business.verificationStatus === "VERIFIED" },
      { key: "offer", label: "Prva ponuda", complete: business.offers.some((offer) => offer.status === "ACTIVE") },
    ];
    const completed = steps.filter((step) => step.complete).length;
    const nextStep = steps.find((step) => !step.complete);
    return {
      businessId,
      completionPercent: Math.round((completed / steps.length) * 100),
      status: business.status,
      steps,
      nextAction: nextStep ? `Završi korak „${nextStep.label}“ da bi profil imao veću vidljivost.` : "Onboarding je završen. Nastavi da pratiš rezultate i ažuriraš ponude.",
    };
  }

  async dailyBrief() {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const [newUsers, newBusinesses, searches, contacts, activeOffers, pendingBusinesses, pendingReviews, unreadNotifications] = await Promise.all([
      this.prisma.user.count({ where: { createdAt: { gte: start }, deletedAt: null } }),
      this.prisma.business.count({ where: { createdAt: { gte: start }, deletedAt: null } }),
      this.prisma.searchQuery.count({ where: { createdAt: { gte: start }, deletedAt: null } }),
      this.prisma.contactEvent.count({ where: { createdAt: { gte: start } } }),
      this.prisma.offer.count({ where: { status: "ACTIVE", deletedAt: null, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] } }),
      this.prisma.business.count({ where: { status: "PENDING", deletedAt: null } }),
      this.prisma.review.count({ where: { status: "PENDING", deletedAt: null } }),
      this.prisma.notification.count({ where: { readAt: null, deletedAt: null } }),
    ]);
    return {
      generatedAt: new Date(),
      today: { newUsers, newBusinesses, searches, contacts },
      queues: { pendingBusinesses, pendingReviews, unreadNotifications },
      supply: { activeOffers },
      priorities: [
        ...(pendingBusinesses ? [{ type: "BUSINESS_VERIFICATION", count: pendingBusinesses, label: "Proveri nove poslovne profile" }] : []),
        ...(pendingReviews ? [{ type: "REVIEW_MODERATION", count: pendingReviews, label: "Moderiraj recenzije na čekanju" }] : []),
        ...(!pendingBusinesses && !pendingReviews ? [{ type: "GROWTH", count: 0, label: "Nema otvorenih moderacionih redova — fokus na aktivaciju firmi i korisnika." }] : []),
      ],
    };
  }

  async cityReadiness() {
    const locations = await this.prisma.businessLocation.findMany({
      where: { deletedAt: null, business: { deletedAt: null } },
      select: { city: { select: { id: true, name: true, country: { select: { code: true, name: true } } } }, business: { select: { status: true, verificationStatus: true } } },
    });
    const cities = new Map<string, { cityId: string; city: string; country: string; businesses: number; verified: number }>();
    for (const location of locations) {
      const current = cities.get(location.city.id) ?? { cityId: location.city.id, city: location.city.name, country: location.city.country.name, businesses: 0, verified: 0 };
      current.businesses += 1;
      if (location.business.status === "VERIFIED" && location.business.verificationStatus === "VERIFIED") current.verified += 1;
      cities.set(location.city.id, current);
    }
    return [...cities.values()].map((city) => ({
      ...city,
      verifiedRate: city.businesses ? Math.round((city.verified / city.businesses) * 100) : 0,
      launchReady: city.businesses >= 100 && city.verified >= 60,
      nextAction: city.businesses < 100 ? "Dovesti još kvalitetnih firmi." : city.verified < 60 ? "Povećati verifikaciju i kvalitet profila." : "Spreman za kontrolisanu lokalnu kampanju.",
    })).sort((a, b) => b.businesses - a.businesses);
  }

  /**
   * A launch scorecard for the selected pilot city. This deliberately uses
   * observed database values and fixed, reviewable gates rather than turning a
   * marketing target into a claim that the city is live.
   */
  async launchReadiness() {
    const pilotCity = process.env.LAUNCH_PILOT_CITY?.trim() || "Beograd";
    const targets = this.launchTargets();
    const city = await this.prisma.city.findFirst({
      where: { name: { equals: pilotCity, mode: "insensitive" }, deletedAt: null },
      select: { id: true, name: true, country: { select: { code: true, name: true } } },
    });

    if (!city) {
      return {
        pilotCity: { name: pilotCity, configured: false },
        targets,
        status: "BLOCKED",
        gates: [],
        nextActions: ["Dodaj pilot grad u lokacijski katalog pre pokretanja lokalne kampanje."],
        generatedAt: new Date(),
      };
    }

    const now = new Date();
    const [activeBusinesses, verifiedBusinesses, registeredUsers, activeOffers] = await Promise.all([
      this.prisma.business.count({
        where: { deletedAt: null, status: "VERIFIED", locations: { some: { cityId: city.id, deletedAt: null } } },
      }),
      this.prisma.business.count({
        where: { deletedAt: null, status: "VERIFIED", verificationStatus: "VERIFIED", locations: { some: { cityId: city.id, deletedAt: null } } },
      }),
      this.prisma.user.count({ where: { deletedAt: null, locations: { some: { cityId: city.id } } } }),
      this.prisma.offer.count({
        where: {
          deletedAt: null,
          status: "ACTIVE",
          OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
          business: { deletedAt: null, locations: { some: { cityId: city.id, deletedAt: null } } },
        },
      }),
    ]);
    const verifiedBusinessRate = activeBusinesses === 0 ? 0 : Math.round((verifiedBusinesses / activeBusinesses) * 100);
    const gates = [
      this.launchGate("active_businesses", "Aktivne firme", activeBusinesses, targets.activeBusinesses, "Prioritetno aktivirati hranu, lokalne usluge i retail profile."),
      this.launchGate("registered_users", "Registrovani korisnici", registeredUsers, targets.registeredUsers, "Povećati lokalne referral, partner i community kanale tek uz aktuelnu ponudu."),
      this.launchGate("active_offers", "Aktuelne ponude", activeOffers, targets.activeOffers, "Sa poslovnim timom popuniti ponude koje imaju jasan rok i lokalnu dostupnost."),
      this.launchGate("verified_business_rate", "Stopa verifikovanih firmi", verifiedBusinessRate, targets.verifiedBusinessRate, "Završiti proveru i kvalitet profila pre većeg plaćenog ili javnog dosega."),
    ];
    const blocked = gates.filter((gate) => !gate.met);

    return {
      pilotCity: { id: city.id, name: city.name, country: city.country },
      targets,
      status: blocked.length ? "NOT_READY" : "READY_FOR_PUBLIC_LAUNCH",
      gates,
      nextActions: blocked.length ? blocked.map((gate) => gate.nextAction) : ["Pokreni vremenski ograničen javni launch uz dnevno praćenje kvaliteta, podrške i incidenta."],
      generatedAt: new Date(),
    };
  }

  launchPlan() {
    const pilotCity = process.env.LAUNCH_PILOT_CITY?.trim() || "Beograd";
    return {
      pilotCity,
      targets: this.launchTargets(),
      businessPackages: [
        { key: "FREE_STARTER", name: "Free Starter", includes: ["javni profil", "osnovne ponude", "digitalni flajer"], conversionGoal: "brza aktivacija kvalitetne lokalne ponude" },
        { key: "BUSINESS", name: "Business", includes: ["analitika", "promocije", "kampanje"], conversionGoal: "merljiv rast i redovna aktivnost" },
        { key: "PREMIUM_PARTNER", name: "Premium Partner", includes: ["istaknuta vidljivost", "AI alati kada su aktivirani", "Opsnestone integracija kada je ugovorena"], conversionGoal: "partnerski rezultat uz odobrene integracije" },
      ],
      acquisitionPriorities: ["pekare, restorani i marketi", "servisi, saloni i majstori", "lokalne maloprodajne firme"],
      growthLoops: ["aktuelne ponude → korisnička akcija → rezultat za firmu", "Save Food → ušteda → preporuka → nova lokalna ponuda", "aktivnost → Balkan Rewards → ponovni povratak"],
      safeguards: ["Ne objavljivati marketinške tvrdnje pre potvrđene lokalne dostupnosti.", "Status launch-a određuje scorecard, ne broj instaliranih funkcija.", "Ne prikazivati pipeline ili potencijalne ugovore kao prihod ili aktivna partnerstva."],
    };
  }

  /**
   * Directional company roadmap exposed to authorized operators. Each phase is
   * intentionally labelled as a target, not product availability or traction.
   * Feature flags and launch/security gates remain the authority for release.
   */
  globalRoadmap() {
    return {
      vision: "Digitalni operativni sistem Balkana za ljude, firme i lokalne zajednice.",
      sharedPlatformRules: [
        "Svaki modul koristi Balkan ID, Business sistem, dozvole, analitiku i feature flag lifecycle.",
        "AI koristi samo dozvoljene podatke i ne izvršava finansijske ili trajne akcije bez potvrde.",
        "Novi moduli ulaze kroz verzionisani API, bez direktnog pristupa privatnim podacima drugih modula.",
      ],
      phases: [
        {
          key: "FOUNDATION", horizon: "0–12 meseci", objective: "Dokazati jedan pouzdan lokalni ekosistem.",
          modules: ["Balkan ID", "Business Profiles", "Deals", "Digital Flyers", "Save Food", "Rewards", "Notifications"],
          directionalTargets: { users: 50_000, businesses: 1_000, offers: 100_000 },
          releaseGate: "Pilot scorecard, bezbednost, podrška, kvalitet lokalne ponude i zadržavanje korisnika.",
        },
        {
          key: "MARKET_EXPANSION", horizon: "12–24 meseca", objective: "Ponoviti dokazani city playbook kroz više gradova.",
          modules: ["Marketplace", "Services", "Jobs", "Events", "Business subscriptions", "Business analytics"],
          directionalTargets: { users: 500_000, businesses: 10_000 },
          releaseGate: "Ponavljiv lokalni onboarding, merljiva business vrednost, moderation i podrška po gradu.",
        },
        {
          key: "REGIONAL_PLATFORM", horizon: "2–3 godine", objective: "Uspostaviti lokalizovanu regionalnu mrežu.",
          modules: ["više jezika", "country/city administracija", "regionalni partneri"],
          directionalTargets: { users: 5_000_000, businesses: 100_000 },
          releaseGate: "Lokalizacija, compliance, regionalne operacije i kvalitet mreže za svaku državu.",
        },
        {
          key: "SUPER_APP", horizon: "3–5 godina", objective: "Povezati proverene daily-life, business i finance slojeve.",
          modules: ["Opsnestone", "CRM", "Analytics", "Travel", "Events", "Health", "provider-backed payments"],
          directionalTargets: { users: 10_000_000, businesses: 500_000 },
          releaseGate: "Izmerena vrednost, regulativa, provider partneri, tenant izolacija i operativna spremnost.",
        },
        {
          key: "DIGITAL_INFRASTRUCTURE", horizon: "5+ godina", objective: "Omogućiti partnerima da grade proverene usluge na platformi.",
          modules: ["Partner API", "integracije", "anonimizovana tržišna inteligencija", "enterprise ugovori"],
          directionalTargets: {},
          releaseGate: "API sigurnost, ugovori, data governance, SLA i dokazani partner outcomes.",
        },
      ],
      businessModel: ["pretplate firmi", "naknade za transakcije gde je dozvoljeno", "označene promocije", "premium AI alati", "enterprise ugovori"],
      disclaimer: "Rokovi i brojčani ciljevi su planiranje, ne javna prognoza niti dokaz postojećeg korišćenja.",
    };
  }

  private launchTargets() {
    return {
      activeBusinesses: this.positiveInteger(process.env.LAUNCH_TARGET_ACTIVE_BUSINESSES, DEFAULT_LAUNCH_TARGETS.activeBusinesses),
      registeredUsers: this.positiveInteger(process.env.LAUNCH_TARGET_REGISTERED_USERS, DEFAULT_LAUNCH_TARGETS.registeredUsers),
      activeOffers: this.positiveInteger(process.env.LAUNCH_TARGET_ACTIVE_OFFERS, DEFAULT_LAUNCH_TARGETS.activeOffers),
      verifiedBusinessRate: this.positiveInteger(process.env.LAUNCH_TARGET_VERIFIED_BUSINESS_RATE, DEFAULT_LAUNCH_TARGETS.verifiedBusinessRate),
    };
  }

  private launchGate(key: string, label: string, current: number, target: number, nextAction: string) {
    return { key, label, current, target, unit: key === "verified_business_rate" ? "percent" : "count", met: current >= target, nextAction };
  }

  private positiveInteger(value: string | undefined, fallback: number) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
  }
}
