import { UsersService } from "./users.service";

describe("UsersService", () => {
  const transaction = {
    userLocation: { updateMany: jest.fn(), upsert: jest.fn() },
    profile: { upsert: jest.fn() },
  };
  const prisma = {
    user: { findUnique: jest.fn() },
    city: { findFirst: jest.fn() },
    userLocation: { findFirst: jest.fn() },
    $transaction: jest.fn(async (callback: (client: typeof transaction) => unknown) => callback(transaction)),
  };
  const service = new UsersService(prisma as never);

  beforeEach(() => jest.clearAllMocks());

  it("stores one primary city and synchronizes the profile location", async () => {
    prisma.user.findUnique.mockResolvedValue({ id: "user-1" });
    prisma.city.findFirst.mockResolvedValue({ id: "city-1", countryId: "country-1" });
    transaction.userLocation.upsert.mockResolvedValue({ id: "location-1", isPrimary: true });

    await service.updatePrimaryLocation("user-1", { cityId: "city-1", latitude: 44.81, longitude: 20.46 });

    expect(transaction.userLocation.updateMany).toHaveBeenCalledWith({ where: { userId: "user-1" }, data: { isPrimary: false } });
    expect(transaction.userLocation.upsert).toHaveBeenCalledWith(expect.objectContaining({
      where: { userId_cityId: { userId: "user-1", cityId: "city-1" } },
      create: expect.objectContaining({ isPrimary: true, latitude: 44.81, longitude: 20.46 }),
    }));
    expect(transaction.profile.upsert).toHaveBeenCalledWith(expect.objectContaining({
      update: { cityId: "city-1", countryId: "country-1" },
    }));
  });
});
