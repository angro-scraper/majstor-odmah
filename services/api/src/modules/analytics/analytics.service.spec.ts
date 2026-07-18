import { AnalyticsService } from "./analytics.service";

describe("AnalyticsService", () => {
  it("stores only documented metadata fields for a canonical event", async () => {
    const prisma = { event: { create: jest.fn().mockResolvedValue({ id: "event-1" }) } };
    const service = new AnalyticsService(prisma as never);

    await service.track("user-1", { eventType: "SEARCH_COMPLETED", metadata: { resultsCount: 8, cityId: "city-1" } });

    expect(prisma.event.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ eventType: "SEARCH_COMPLETED", metadata: { resultsCount: 8, cityId: "city-1" } }) }));
  });

  it("rejects undeclared analytics metadata to avoid collecting accidental personal data", async () => {
    const prisma = { event: { create: jest.fn() } };
    const service = new AnalyticsService(prisma as never);

    await expect(service.track("user-1", { eventType: "SEARCH_COMPLETED", metadata: { query: "private request" } })).rejects.toThrow("ANALYTICS_METADATA_FIELD_NOT_ALLOWED");
  });
});
