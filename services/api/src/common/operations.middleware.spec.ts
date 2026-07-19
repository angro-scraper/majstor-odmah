import { createOperationalMiddleware } from "./operations.middleware";

describe("operational middleware", () => {
  it("rate limits authentication requests and returns a safe error body", () => {
    const middleware = createOperationalMiddleware({ authLimit: 1, generalLimit: 5, windowMs: 60_000, now: () => 100 });
    const makeResponse = () => ({ statusCode: 200, setHeader: jest.fn(), end: jest.fn(), on: jest.fn() });
    const request = { method: "POST", originalUrl: "/api/v1/auth/login", headers: { "x-forwarded-for": "203.0.113.10" } };
    const firstResponse = makeResponse();
    middleware(request, firstResponse, jest.fn());
    const secondResponse = makeResponse();
    middleware(request, secondResponse, jest.fn());

    expect(firstResponse.end).not.toHaveBeenCalled();
    expect(secondResponse.statusCode).toBe(429);
    expect(secondResponse.end).toHaveBeenCalledWith(expect.stringContaining("RATE_LIMITED"));
  });
});
