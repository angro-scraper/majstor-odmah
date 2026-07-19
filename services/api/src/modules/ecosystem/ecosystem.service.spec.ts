import { EcosystemService } from "./ecosystem.service";

describe("EcosystemService", () => {
  const prisma = {};
  const features = { isEnabled: jest.fn() };
  const service = new EcosystemService(prisma as never, features as never);

  it("returns each super-app module with its independent feature flag", () => {
    features.isEnabled.mockImplementation((feature: string) => feature === "events");

    const modules = service.modules();

    expect(modules).toHaveLength(8);
    expect(modules.find((module) => module.feature === "events")?.enabled).toBe(true);
    expect(modules.find((module) => module.feature === "health")?.enabled).toBe(false);
  });
});
