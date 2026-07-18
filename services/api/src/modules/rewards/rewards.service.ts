import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, RewardEventType, RewardLevel } from "@prisma/client";
import { PrismaService } from "@balkanworks/database";

export const rewardPoints: Record<RewardEventType, number> = {
  SAVE_FOOD_RESERVED: 10,
  SAVE_FOOD_PICKED_UP: 20,
  SAVE_FOOD_REVIEWED: 5,
  DEAL_SAVED: 2,
  DEAL_SHARED: 5,
  BUSINESS_FOLLOWED: 2,
  REVIEW_CREATED: 5,
  FRIEND_INVITED: 100,
  REFERRAL_COMPLETED: 100,
  DAILY_CHECK_IN: 5,
  CHALLENGE_COMPLETED: 200,
};

function levelFor(points: number): RewardLevel {
  if (points >= 10_000) return RewardLevel.BALKAN_AMBASSADOR;
  if (points >= 2_000) return RewardLevel.BALKAN_INSIDER;
  if (points >= 500) return RewardLevel.LOCAL_HERO;
  return RewardLevel.EXPLORER;
}

@Injectable()
export class RewardsService {
  constructor(private readonly prisma: PrismaService) {}

  async balance(userId: string) {
    return this.ensureBalance(userId);
  }

  async history(userId: string) {
    await this.ensureBalance(userId);
    return this.prisma.rewardTransaction.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 100 });
  }

  async catalog() {
    return this.prisma.rewardsCatalog.findMany({
      where: { isActive: true, deletedAt: null, OR: [{ availableQuantity: null }, { availableQuantity: { gt: 0 } }] },
      include: { business: { select: { id: true, name: true, slug: true } } },
      orderBy: [{ pointsRequired: "asc" }, { createdAt: "desc" }],
      take: 50,
    });
  }

  async challenges(userId: string) {
    return this.prisma.challenge.findMany({
      where: { isActive: true, endDate: { gt: new Date() } },
      include: { participations: { where: { userId }, select: { progress: true, completedAt: true } } },
      orderBy: { endDate: "asc" },
      take: 20,
    });
  }

  async checkIn(userId: string) {
    const today = new Date().toISOString().slice(0, 10);
    const checkIns = await this.prisma.rewardTransaction.count({ where: { userId, eventType: RewardEventType.DAILY_CHECK_IN } });
    const points = (checkIns + 1) % 7 === 0 ? 30 : rewardPoints.DAILY_CHECK_IN;
    return this.award(userId, RewardEventType.DAILY_CHECK_IN, `check-in:${today}`, points, { streakDay: (checkIns % 7) + 1 });
  }

  async award(userId: string, eventType: RewardEventType, referenceId: string, points = rewardPoints[eventType], metadata: Record<string, unknown> = {}) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.rewardTransaction.findUnique({ where: { userId_eventType_referenceId: { userId, eventType, referenceId } } });
      const balance = await this.ensureBalance(userId, tx);
      if (existing) return { transaction: existing, balance, awarded: false };

      const transaction = await tx.rewardTransaction.create({ data: { userId, eventType, points, referenceId, metadata: metadata as Prisma.InputJsonValue } });
      const totalPoints = balance.totalPoints + points;
      const updatedBalance = await tx.rewardBalance.update({ where: { userId }, data: { totalPoints, level: levelFor(totalPoints) } });
      await tx.notification.create({ data: { userId, type: "RECOMMENDATION", priority: "NORMAL", module: "rewards", actionUrl: "/rewards", title: `Dobio/la si ${points} Balkan poena`, message: `Aktivnost je zabeležena. Tvoj trenutni saldo je ${totalPoints} poena.` } });
      await tx.auditLog.create({ data: { actorUserId: userId, action: "REWARD_GRANTED", resourceType: "reward_transaction", resourceId: transaction.id, payload: { eventType, points, referenceId } } });
      return { transaction, balance: updatedBalance, awarded: true };
    });
  }

  async completeChallenge(userId: string, challengeId: string) {
    const challenge = await this.prisma.challenge.findFirst({ where: { id: challengeId, isActive: true, endDate: { gt: new Date() } } });
    if (!challenge) throw new NotFoundException("CHALLENGE_NOT_FOUND");
    return this.award(userId, RewardEventType.CHALLENGE_COMPLETED, challenge.id, challenge.rewardPoints, { challenge: challenge.title });
  }

  private async ensureBalance(userId: string, client: Prisma.TransactionClient | PrismaService = this.prisma) {
    return client.rewardBalance.upsert({
      where: { userId },
      create: { userId, referralCode: `BW${userId.replace(/-/g, "").slice(0, 10).toUpperCase()}` },
      update: {},
    });
  }
}
