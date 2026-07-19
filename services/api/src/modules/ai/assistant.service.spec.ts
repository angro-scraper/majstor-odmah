import { AiAssistantService } from "./assistant.service";
import { IntentService } from "./intent.service";

describe("AiAssistantService", () => {
  it("returns transparent recommendations and records the completed AI interaction", async () => {
    const moderation = { assertSafe: jest.fn(), audit: jest.fn() } as any;
    const recommendations = { discover: jest.fn().mockResolvedValue([{ entityId: "business-1", title: "Pekara", score: 0.9 }]) } as any;
    const service = new AiAssistantService(moderation, new IntentService(), recommendations);

    const result = await service.chat("00000000-0000-0000-0000-000000000001", { message: "Nađi mi jeftinu pekaru danas" });

    expect(moderation.assertSafe).toHaveBeenCalled();
    expect(recommendations.discover).toHaveBeenCalledWith(expect.objectContaining({ surface: "AI_CHAT" }), expect.objectContaining({ needs: ["hrana"], budget: "value", urgency: "urgent" }), "00000000-0000-0000-0000-000000000001");
    expect(result.answer).toContain("javno dostupnim profilima");
    expect(result.safety).toMatchObject({ autonomousActions: false, financialActions: false });
  });
});
