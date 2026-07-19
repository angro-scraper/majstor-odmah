import { Injectable, NotFoundException } from "@nestjs/common";
import { SuperAppModuleKey } from "@prisma/client";
import { PrismaService } from "@balkanworks/database";
import { FeatureKey, FeaturesService } from "../features/features.service";

type ModuleDefinition = {
  key: SuperAppModuleKey;
  feature: FeatureKey;
  name: string;
  description: string;
  surface: "LIFE" | "COMMUNITY" | "IDENTITY";
};

export const SUPER_APP_MODULES: readonly ModuleDefinition[] = [
  { key: SuperAppModuleKey.HEALTH, feature: "health", name: "Zdravlje", description: "Podsetnici i lokalne zdravstvene usluge.", surface: "LIFE" },
  { key: SuperAppModuleKey.AUTO, feature: "auto", name: "Auto", description: "Vozila, podsetnici i provereni servisi.", surface: "LIFE" },
  { key: SuperAppModuleKey.TRAVEL, feature: "travel", name: "Putovanja", description: "Lokalna iskustva i destinacije širom Balkana.", surface: "LIFE" },
  { key: SuperAppModuleKey.REAL_ESTATE, feature: "realEstate", name: "Nekretnine", description: "Prodaja, izdavanje i poslovni prostori.", surface: "LIFE" },
  { key: SuperAppModuleKey.EDUCATION, feature: "education", name: "Edukacija", description: "Kursevi, obuke i razvoj veština.", surface: "LIFE" },
  { key: SuperAppModuleKey.EVENTS, feature: "events", name: "Događaji", description: "Koncerti, sport i lokalni događaji.", surface: "COMMUNITY" },
  { key: SuperAppModuleKey.COMMUNITY, feature: "community", name: "Zajednica", description: "Lokalne grupe, preporuke i pitanja.", surface: "COMMUNITY" },
  { key: SuperAppModuleKey.BALKAN_CARD, feature: "balkanCard", name: "Balkan Card", description: "Članska kartica sa statusom i pogodnostima.", surface: "IDENTITY" },
];

@Injectable()
export class EcosystemService {
  constructor(private readonly prisma: PrismaService, private readonly features: FeaturesService) {}

  modules() {
    return SUPER_APP_MODULES.map((module) => ({ ...module, enabled: this.features.isEnabled(module.feature) }));
  }

  async home(userId: string) {
    const preferences = await this.prisma.userModulePreference.findMany({ where: { userId } });
    const preferenceByModule = new Map(preferences.map((item) => [item.module, item]));
    const modules = this.modules()
      .filter((module) => module.enabled && preferenceByModule.get(module.key)?.enabled !== false)
      .map((module) => ({ ...module, score: preferenceByModule.get(module.key)?.score ?? 0 }))
      .sort((left, right) => right.score - left.score);
    const [card, upcomingEvents] = await Promise.all([
      this.prisma.membershipCard.findUnique({ where: { userId } }),
      this.features.isEnabled("events")
        ? this.prisma.localEvent.findMany({ where: { deletedAt: null, startsAt: { gte: new Date() } }, include: { city: { select: { name: true, country: { select: { code: true } } } } }, orderBy: { startsAt: "asc" }, take: 4 })
        : [],
    ]);
    return { modules, membershipCard: card, sections: [{ type: "EVENTS", title: "Događaji u regionu", items: upcomingEvents }] };
  }

  async updatePreferences(userId: string, preferences: Array<{ module: SuperAppModuleKey; enabled?: boolean; score?: number }>) {
    for (const preference of preferences) {
      await this.prisma.userModulePreference.upsert({
        where: { userId_module: { userId, module: preference.module } },
        create: { userId, module: preference.module, enabled: preference.enabled ?? true, score: preference.score ?? 0 },
        update: { ...(preference.enabled === undefined ? {} : { enabled: preference.enabled }), ...(preference.score === undefined ? {} : { score: preference.score }) },
      });
    }
    return this.prisma.userModulePreference.findMany({ where: { userId } });
  }

  async membershipCard(userId: string) {
    this.requireFeature("balkanCard");
    return this.prisma.membershipCard.upsert({ where: { userId }, create: { userId, benefits: ["Lokalne pogodnosti", "Balkan Rewards status"] }, update: {} });
  }

  async healthProfile(userId: string) {
    this.requireFeature("health");
    return this.prisma.healthProfile.findUnique({ where: { userId }, include: { reminders: { orderBy: { reminderAt: "asc" }, take: 20 } } });
  }

  async saveHealthProfile(userId: string, input: { bloodType?: string; allergies?: string[]; notes?: string }) {
    this.requireFeature("health");
    return this.prisma.healthProfile.upsert({ where: { userId }, create: { userId, bloodType: input.bloodType, allergies: input.allergies ?? [], notes: input.notes }, update: { bloodType: input.bloodType, allergies: input.allergies ?? [], notes: input.notes } });
  }

  async addHealthReminder(userId: string, input: { title: string; reminderAt: Date }) {
    this.requireFeature("health");
    const profile = await this.prisma.healthProfile.upsert({ where: { userId }, create: { userId }, update: {} });
    return this.prisma.healthReminder.create({ data: { userId, profileId: profile.id, title: input.title, reminderAt: input.reminderAt } });
  }

  async vehicles(userId: string) {
    this.requireFeature("auto");
    return this.prisma.vehicle.findMany({ where: { userId }, include: { reminders: { orderBy: { dueAt: "asc" } } }, orderBy: { createdAt: "desc" } });
  }

  async addVehicle(userId: string, input: { make: string; model: string; year?: number; registration?: string }) {
    this.requireFeature("auto");
    return this.prisma.vehicle.create({ data: { userId, ...input } });
  }

  async events(cityId?: string) {
    this.requireFeature("events");
    return this.prisma.localEvent.findMany({ where: { deletedAt: null, startsAt: { gte: new Date() }, ...(cityId ? { cityId } : {}) }, include: { city: { select: { name: true, country: { select: { code: true } } } }, business: { select: { id: true, name: true } } }, orderBy: { startsAt: "asc" }, take: 50 });
  }

  async experiences(cityId?: string) {
    this.requireFeature("travel");
    return this.prisma.travelExperience.findMany({ where: { deletedAt: null, ...(cityId ? { cityId } : {}) }, include: { city: true, business: { select: { id: true, name: true } } }, orderBy: { createdAt: "desc" }, take: 50 });
  }

  async listings(cityId?: string) {
    this.requireFeature("realEstate");
    return this.prisma.propertyListing.findMany({ where: { deletedAt: null, ...(cityId ? { cityId } : {}) }, include: { city: true }, orderBy: { createdAt: "desc" }, take: 50 });
  }

  async courses(category?: string) {
    this.requireFeature("education");
    return this.prisma.educationCourse.findMany({ where: { deletedAt: null, ...(category ? { category } : {}) }, include: { business: { select: { id: true, name: true } } }, orderBy: { createdAt: "desc" }, take: 50 });
  }

  async groups(cityId?: string) {
    this.requireFeature("community");
    return this.prisma.communityGroup.findMany({ where: { deletedAt: null, isPublic: true, ...(cityId ? { cityId } : {}) }, include: { city: true, _count: { select: { memberships: true, posts: true } } }, orderBy: { createdAt: "desc" }, take: 50 });
  }

  async createGroup(userId: string, input: { name: string; description?: string; cityId?: string }) {
    this.requireFeature("community");
    const group = await this.prisma.communityGroup.create({ data: { creatorId: userId, name: input.name, description: input.description, cityId: input.cityId } });
    await this.prisma.communityMembership.create({ data: { userId, groupId: group.id } });
    return group;
  }

  async joinGroup(userId: string, groupId: string) {
    this.requireFeature("community");
    const group = await this.prisma.communityGroup.findFirst({ where: { id: groupId, deletedAt: null, isPublic: true } });
    if (!group) throw new NotFoundException("COMMUNITY_GROUP_NOT_FOUND");
    return this.prisma.communityMembership.upsert({ where: { userId_groupId: { userId, groupId } }, create: { userId, groupId }, update: {} });
  }

  private requireFeature(feature: FeatureKey) {
    if (!this.features.isEnabled(feature)) throw new NotFoundException("FEATURE_DISABLED");
  }
}
