const { CategoryType, PrismaClient, UserStatus, UserType, VerificationStatus } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();
const developmentPassword = "BalkanworksDev123!";

async function assignRole(userId, roleName) {
  const role = await prisma.role.findUniqueOrThrow({ where: { name: roleName } });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId, roleId: role.id } },
    create: { userId, roleId: role.id },
    update: {},
  });
}

async function ensureLocation(businessId, cityId, address) {
  const existing = await prisma.businessLocation.findFirst({ where: { businessId, cityId, address, deletedAt: null } });
  if (!existing) await prisma.businessLocation.create({ data: { businessId, cityId, address } });
}

async function ensureService(businessId, name, description) {
  const existing = await prisma.service.findFirst({ where: { businessId, name, deletedAt: null } });
  if (!existing) await prisma.service.create({ data: { businessId, name, description } });
}

async function main() {
  const roles = ["CUSTOMER", "BUSINESS_OWNER", "EMPLOYEE", "MODERATOR", "ADMIN", "SUPER_ADMIN"];
  const permissions = ["business:manage", "business:moderate", "user:manage", "review:moderate"];
  await Promise.all(roles.map((name) => prisma.role.upsert({ where: { name }, create: { name }, update: {} })));
  await Promise.all(permissions.map((name) => prisma.permission.upsert({ where: { name }, create: { name }, update: {} })));

  const serbia = await prisma.country.upsert({ where: { code: "RS" }, create: { code: "RS", name: "Serbia", currency: "RSD" }, update: { name: "Serbia", currency: "RSD" } });
  const belgrade = await prisma.city.upsert({ where: { countryId_name: { countryId: serbia.id, name: "Belgrade" } }, create: { countryId: serbia.id, name: "Belgrade", latitude: 44.7866, longitude: 20.4489 }, update: {} });
  const noviSad = await prisma.city.upsert({ where: { countryId_name: { countryId: serbia.id, name: "Novi Sad" } }, create: { countryId: serbia.id, name: "Novi Sad", latitude: 45.2671, longitude: 19.8335 }, update: {} });

  const categories = await Promise.all([
    ["Auto Services", "auto-services", CategoryType.SERVICES],
    ["Restaurants", "restaurants", CategoryType.FOOD],
    ["Beauty", "beauty", CategoryType.SERVICES],
    ["Healthcare", "healthcare", CategoryType.HEALTH],
  ].map(([name, slug, type]) => prisma.category.upsert({ where: { slug }, create: { name, slug, type }, update: { name, type } })));

  await Promise.all([
    ["Dom i majstori", "dom-i-majstori"],
    ["Elektro instalacije", "elektro-instalacije"],
    ["Čišćenje doma", "ciscenje-doma"],
    ["Auto usluge", "auto-usluge"],
    ["Digitalne usluge", "digitalne-usluge"],
  ].map(([name, slug]) => prisma.serviceCategory.upsert({ where: { slug }, create: { name, slug }, update: { name } })));

  const passwordHash = await bcrypt.hash(developmentPassword, 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@balkanworks.local" },
    create: {
      email: "admin@balkanworks.local",
      passwordHash,
      status: UserStatus.ACTIVE,
      userType: UserType.ADMIN,
      profile: { create: { firstName: "Balkan", lastName: "Admin", cityId: belgrade.id, countryId: serbia.id } },
    },
    update: { passwordHash, status: UserStatus.ACTIVE, userType: UserType.ADMIN },
  });
  const owner = await prisma.user.upsert({
    where: { email: "owner@balkanworks.local" },
    create: {
      email: "owner@balkanworks.local",
      passwordHash,
      status: UserStatus.ACTIVE,
      userType: UserType.BUSINESS_OWNER,
      profile: { create: { firstName: "Demo", lastName: "Owner", cityId: belgrade.id, countryId: serbia.id } },
    },
    update: { passwordHash, status: UserStatus.ACTIVE, userType: UserType.BUSINESS_OWNER },
  });
  const customer = await prisma.user.upsert({
    where: { email: "customer@balkanworks.local" },
    create: {
      email: "customer@balkanworks.local",
      passwordHash,
      status: UserStatus.ACTIVE,
      userType: UserType.CONSUMER,
      profile: { create: { firstName: "Demo", lastName: "Customer", cityId: noviSad.id, countryId: serbia.id } },
    },
    update: { passwordHash, status: UserStatus.ACTIVE, userType: UserType.CONSUMER },
  });
  await assignRole(admin.id, "ADMIN");
  await assignRole(owner.id, "BUSINESS_OWNER");
  await assignRole(customer.id, "CUSTOMER");

  const autoServices = categories.find((category) => category.slug === "auto-services");
  const restaurants = categories.find((category) => category.slug === "restaurants");
  const autoService = await prisma.business.upsert({
    where: { slug: "auto-servis-markovic" },
    create: { ownerId: owner.id, name: "Auto Servis Marković", slug: "auto-servis-markovic", description: "Dijagnostika, redovni servis i brze popravke.", categoryId: autoServices.id, phone: "+381115550101", status: "VERIFIED", verificationStatus: VerificationStatus.VERIFIED },
    update: { description: "Dijagnostika, redovni servis i brze popravke.", status: "VERIFIED", verificationStatus: VerificationStatus.VERIFIED },
  });
  const restaurant = await prisma.business.upsert({
    where: { slug: "restoran-dunav" },
    create: { ownerId: owner.id, name: "Restoran Dunav", slug: "restoran-dunav", description: "Porodični restoran sa lokalnim jelima.", categoryId: restaurants.id, phone: "+381115550102", status: "VERIFIED", verificationStatus: VerificationStatus.VERIFIED },
    update: { description: "Porodični restoran sa lokalnim jelima.", status: "VERIFIED", verificationStatus: VerificationStatus.VERIFIED },
  });
  await ensureLocation(autoService.id, belgrade.id, "Bulevar kralja Aleksandra 100, Belgrade");
  await ensureLocation(restaurant.id, noviSad.id, "Bulevar oslobođenja 20, Novi Sad");
  await ensureService(autoService.id, "Redovni servis", "Osnovni pregled i održavanje vozila.");
  await ensureService(restaurant.id, "Porodični ručak", "Dnevni meni za porodice.");

  console.info("Seed complete. Development accounts use password BalkanworksDev123! and must never be used outside local development.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
