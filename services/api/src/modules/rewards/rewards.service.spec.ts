import { RewardEventType } from "@prisma/client";
import { RewardsService } from "./rewards.service";

describe("RewardsService", () => {
  const transaction = {
    rewardTransaction: { findUnique: jest.fn(), create: jest.fn() },
    rewardBalance: { upsert: jest.fn(), update: jest.fn() },
    notification: { create: jest.fn() },
    auditLog: { create: jest.fn() },
  };
  const prisma = { $transaction: jest.fn((callback) => callback(transaction)) };

  beforeEach(() => {
    jest.clearAllMocks();
    transaction.rewardTransaction.findUnique.mockResolvedValue(null);
    transaction.rewardBalance.upsert.mockResolvedValue({ userId: "user-1", totalPoints: 490, level: "EXPLORER", referralCode: "BWUSER1" });
    transaction.rewardTransaction.create.mockResolvedValue({ id: "reward-1" });
    transaction.rewardBalance.update.mockResolvedValue({ userId: "user-1", totalPoints: 500, level: "LOCAL_HERO" });
    transaction.notification.create.mockResolvedValue({});
    transaction.auditLog.create.mockResolvedValue({});
  });

  it("awards points once and promotes a user at the Local Hero threshold", async () => {
    const service = new RewardsService(prisma as never);
    const result = await service.award("user-1", RewardEventType.SAVE_FOOD_RESERVED, "reservation-1");

    expect(result.awarded).toBe(true);
    expect(transaction.rewardBalance.update).toHaveBeenCalledWith(expect.objectContaining({ data: { totalPoints: 500, level: "LOCAL_HERO" } }));
    expect(transaction.notification.create).toHaveBeenCalled();
  });

  it("does not award duplicate event references", async () => {
    transaction.rewardTransaction.findUnique.mockResolvedValue({ id: "reward-1" });
    const service = new RewardsService(prisma as never);
    const result = await service.award("user-1", RewardEventType.SAVE_FOOD_RESERVED, "reservation-1");

    expect(result.awarded).toBe(false);
    expect(transaction.rewardTransaction.create).not.toHaveBeenCalled();
  });
});
