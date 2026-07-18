import { ComplianceService } from "./compliance.service";

describe("ComplianceService", () => {
  it("exports the user data bundle without password hashes or session tokens", async () => {
    const prisma = {
      user: { findUnique: jest.fn().mockResolvedValue({ id: "user-1", email: "user@example.com", phone: null, status: "ACTIVE", profile: null, roles: [], businesses: [], createdAt: new Date(), updatedAt: new Date() }) },
      favorite: { findMany: jest.fn().mockResolvedValue([]) },
      review: { findMany: jest.fn().mockResolvedValue([]) },
      event: { findMany: jest.fn().mockResolvedValue([]) },
      searchQuery: { findMany: jest.fn().mockResolvedValue([]) },
      userConsent: { findMany: jest.fn().mockResolvedValue([]) },
      dataSubjectRequest: { findMany: jest.fn().mockResolvedValue([]) },
      auditLog: { create: jest.fn().mockResolvedValue({}) },
    };
    const service = new ComplianceService(prisma as never);

    const result = await service.dataExport("user-1");

    expect(result.data.account).toMatchObject({ id: "user-1", email: "user@example.com" });
    expect(result.data.account).not.toHaveProperty("passwordHash");
    expect(result.data.account).not.toHaveProperty("sessions");
    expect(prisma.user.findUnique.mock.calls[0][0].select).not.toHaveProperty("passwordHash");
    expect(prisma.auditLog.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ action: "DATA_EXPORT_GENERATED" }) }));
  });
});
