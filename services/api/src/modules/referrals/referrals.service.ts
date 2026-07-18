import { Injectable } from "@nestjs/common";
import { ReferralStatus, RewardEventType } from "@prisma/client";
import { PrismaService } from "@balkanworks/database";
import { IsEmail, IsOptional } from "class-validator";
import { RewardsService } from "../rewards/rewards.service";

export class CreateReferralDto {
  @IsOptional() @IsEmail() invitedEmail?: string;
}

@Injectable()
export class ReferralsService {
  constructor(private readonly prisma: PrismaService, private readonly rewards: RewardsService) {}

  async create(userId: string, input: CreateReferralDto) {
    const balance = await this.rewards.balance(userId);
    const invitedEmail = input.invitedEmail?.trim().toLowerCase();
    const referral = invitedEmail
      ? await this.prisma.referral.upsert({ where: { inviterId_invitedEmail: { inviterId: userId, invitedEmail } }, create: { inviterId: userId, invitedEmail }, update: { status: ReferralStatus.PENDING } })
      : null;
    return { referralCode: balance.referralCode, referral, shareUrl: `/onboarding?ref=${encodeURIComponent(balance.referralCode)}` };
  }

  async status(userId: string) {
    const [balance, referrals] = await Promise.all([
      this.rewards.balance(userId),
      this.prisma.referral.findMany({ where: { inviterId: userId }, include: { invitedUser: { include: { profile: true } } }, orderBy: { createdAt: "desc" } }),
    ]);
    return { referralCode: balance.referralCode, total: referrals.length, completed: referrals.filter((item) => item.status === ReferralStatus.COMPLETED).length, referrals };
  }

  async completeRegistration(referralCode: string | undefined, userId: string, email: string) {
    if (!referralCode) return null;
    const inviterBalance = await this.prisma.rewardBalance.findUnique({ where: { referralCode: referralCode.trim().toUpperCase() } });
    if (!inviterBalance || inviterBalance.userId === userId) return null;
    const existing = await this.prisma.referral.findUnique({ where: { invitedUserId: userId } });
    if (existing) return existing;
    const referral = await this.prisma.referral.upsert({
      where: { inviterId_invitedEmail: { inviterId: inviterBalance.userId, invitedEmail: email } },
      create: { inviterId: inviterBalance.userId, invitedUserId: userId, invitedEmail: email, status: ReferralStatus.COMPLETED, completedAt: new Date() },
      update: { invitedUserId: userId, status: ReferralStatus.COMPLETED, completedAt: new Date() },
    });
    await Promise.all([
      this.rewards.award(inviterBalance.userId, RewardEventType.FRIEND_INVITED, referral.id),
      this.rewards.award(userId, RewardEventType.REFERRAL_COMPLETED, referral.id),
    ]);
    return referral;
  }
}
