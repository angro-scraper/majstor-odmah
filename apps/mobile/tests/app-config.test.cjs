const app = require("../app.json");

describe("Balkan.works mobile foundation", () => {
  it("declares a stable Expo application identity", () => {
    expect(app.expo.name).toBe("Balkan.works");
    expect(app.expo.slug).toBe("balkanworks");
    expect(app.expo.orientation).toBe("portrait");
  });
});
