import { AiService } from "./ai.service";
import { SearchService } from "../search/search.service";
import { IntentService } from "./intent.service";

describe("AiService", () => {
  it("recognizes urgency and delegates search to the approved business index", async () => {
    const search = { businesses: jest.fn().mockResolvedValue([{ id: "business-1", name: "Auto Servis Marković" }]) } as unknown as SearchService;
    const service = new AiService(search, new IntentService());

    const result = await service.search({ query: "Treba mi auto servis hitno danas" });

    expect(search.businesses).toHaveBeenCalledWith({ query: "Treba mi auto servis hitno danas", cityId: undefined, categoryId: undefined });
    expect(result.intent).toMatchObject({ type: "business_discovery", needs: ["auto"], urgency: "urgent" });
    expect(result.results).toHaveLength(1);
  });
});
