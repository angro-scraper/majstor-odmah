import { FeaturesService } from "./features.service";

describe("FeaturesService", () => {
  it("uses conservative defaults for regulated and unfinished modules", () => {
    const original = { ...process.env };
    delete process.env.WALLET_ENABLED;
    delete process.env.MARKETPLACE_ENABLED;
    delete process.env.PARTNER_API_ENABLED;
    const features = new FeaturesService();
    expect(features.publicFlags()).toMatchObject({ deals: true, wallet: false, marketplace: false, partnerApi: false });
    process.env = original;
  });
});
