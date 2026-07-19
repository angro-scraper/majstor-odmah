import { SearchService } from "./search.service";

describe("SearchService", () => {
  const prisma = {
    business: { findMany: jest.fn() },
    searchQuery: { create: jest.fn() },
  };
  const service = new SearchService(prisma as never);

  beforeEach(() => jest.clearAllMocks());

  it("filters regional search results by active country code", async () => {
    prisma.business.findMany.mockResolvedValue([]);
    prisma.searchQuery.create.mockResolvedValue({});

    await service.businesses({ query: "pekara", countryCode: "ba" });

    expect(prisma.business.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        locations: {
          some: expect.objectContaining({
            city: { country: { code: "BA", isActive: true, deletedAt: null } },
          }),
        },
      }),
    }));
  });
});
