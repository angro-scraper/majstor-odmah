import { LocationsService } from "./locations.service";

describe("LocationsService", () => {
  const prisma = {
    country: { findMany: jest.fn() },
    currency: { findMany: jest.fn() },
    translation: { findMany: jest.fn() },
    city: { findMany: jest.fn() },
  };
  const service = new LocationsService(prisma as never);

  beforeEach(() => jest.clearAllMocks());

  it("only exposes active regional countries and currencies", async () => {
    prisma.country.findMany.mockResolvedValue([]);
    prisma.currency.findMany.mockResolvedValue([]);

    await service.countries();
    await service.currencies();

    expect(prisma.country.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { deletedAt: null, isActive: true } }));
    expect(prisma.currency.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { isActive: true } }));
  });

  it("publishes the initial Balkan language catalog", () => {
    expect(service.languages().map((language) => language.code)).toEqual(expect.arrayContaining(["sr", "hr", "bs", "mk", "sl", "sq", "en"]));
  });
});
