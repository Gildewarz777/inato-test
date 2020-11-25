import { Drug, Pharmacy } from "./pharmacy";

describe("Pharmacy", () => {
  it("should decrease the benefit and expiresIn", async () => {
    expect(
      await new Pharmacy([new Drug("test", 2, 3)]).updateBenefitValue()
    ).toEqual([new Drug("test", 1, 2)]);
  });

  it("Should degrade twice as fast", async () => {
    expect(
      await new Pharmacy([new Drug("test2", -1, 4)]).updateBenefitValue()
    ).toEqual([new Drug("test2", -2, 2)]);
  });

  it("Benefit is never negative", async () => {
    expect(
      await new Pharmacy([new Drug("test3", 0, 0)]).updateBenefitValue()
    ).toEqual([new Drug("test3", -1, 0)]);
  });
});
