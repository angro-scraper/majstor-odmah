# Balkan.works AI Sprint 09 — implementation

## Delivered API

- `POST /api/v1/ai/search` and `POST /api/v1/search/ai` accept a natural-language request and return approved-business search results with a transparent intent explanation.
- `POST /api/v1/ai/chat` requires a bearer token and returns an answer plus public-business, active-offer and available Save Food recommendations.
- `GET /api/v1/ai/recommendations` requires a bearer token and uses the user's explicit interests and primary city when available.
- `POST /api/v1/business/ai/analyze` requires a bearer token and business ownership. It returns read-only profile, offer, Save Food and engagement suggestions.

## Safety and privacy decisions

- The AI layer is deterministic retrieval and ranking in this release; it does not claim model-generated facts.
- It reads public business, offer and Save Food data. It never exposes another user's profile, messages, wallet, payment or session data.
- Prompts are not saved in the recommendation table. `recommendation_events` stores only ranking metadata needed to measure recommendation quality.
- AI chat and business analysis write a minimal audit event. AI does not create offers, edit records, book services, reserve food, or initiate payments.
- Requests attempting prompt injection or credential/card theft language are blocked before retrieval.

## Extension point

The `IntentService`, `AiRecommendationsService`, `AiAssistantService`, `BusinessAiService`, and `AiModerationService` are independent providers. A future approved LLM gateway can be added behind `AiAssistantService` without giving the model direct database or financial-write access.
