import { ConflictException, NotFoundException } from "@nestjs/common";
import { SaveFoodService } from "./save-food.service";

describe("SaveFoodService", () => {
  const transaction = { saveFoodPackage: { updateMany: jest.fn() }, saveFoodReservation: { create: jest.fn() }, notification: { create: jest.fn() }, auditLog: { create: jest.fn() } };
  const prisma = { $transaction: jest.fn(), business: { findFirst: jest.fn() }, saveFoodPackage: { create: jest.fn() }, auditLog: { create: jest.fn() } };
  const features = { isEnabled: jest.fn() };
  const service = new SaveFoodService(prisma as never, features as never);
  beforeEach(() => { jest.clearAllMocks(); prisma.$transaction.mockImplementation(async (handler: (tx: typeof transaction) => unknown) => handler(transaction)); });

  it("hides Save Food while the feature is disabled", async () => {
    features.isEnabled.mockReturnValue(false);
    await expect(service.list({})).rejects.toBeInstanceOf(NotFoundException);
  });

  it("reserves only inventory atomically confirmed by the database", async () => {
    features.isEnabled.mockReturnValue(true);
    transaction.saveFoodPackage.updateMany.mockResolvedValue({ count: 1 });
    transaction.saveFoodReservation.create.mockResolvedValue({ id: "reservation-1", quantity: 1 });
    transaction.notification.create.mockResolvedValue({ id: "notification-1" });
    transaction.auditLog.create.mockResolvedValue({ id: "audit-1" });
    await expect(service.reserve("user-1", "package-1")).resolves.toMatchObject({ id: "reservation-1" });
    expect(transaction.saveFoodPackage.updateMany).toHaveBeenCalledWith(expect.objectContaining({ data: { quantityAvailable: { decrement: 1 } } }));
  });

  it("rejects an unavailable package without creating a reservation", async () => {
    features.isEnabled.mockReturnValue(true); transaction.saveFoodPackage.updateMany.mockResolvedValue({ count: 0 });
    await expect(service.reserve("user-1", "package-1")).rejects.toBeInstanceOf(ConflictException);
    expect(transaction.saveFoodReservation.create).not.toHaveBeenCalled();
  });
});
