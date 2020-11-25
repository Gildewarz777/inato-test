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

  it("Herbal tea increases in benefit", async () => {
    expect(
      await new Pharmacy([new Drug("Herbal Tea", 1, 0)]).updateBenefitValue()
    ).toEqual([new Drug("Herbal Tea", 0, 1)]);
  });

  it("Herbal tea benefits increases twice as fast after the expiration", async () => {
    expect(
      await new Pharmacy([new Drug("Herbal Tea", 0, 0)]).updateBenefitValue()
    ).toEqual([new Drug("Herbal Tea", -1, 2)]);
  });

  it("Benefit is never more than 50", async () => {
    expect(
      await new Pharmacy([new Drug("Herbal Tea", 0, 49)]).updateBenefitValue()
    ).toEqual([new Drug("Herbal Tea", -1, 50)]);
  });

  it("Magic Pill never expires nor decreases in Benefit", async () => {
    expect(
      await new Pharmacy([new Drug("Magic Pill", 1, 1)]).updateBenefitValue()
    ).toEqual([new Drug("Magic Pill", 1, 1)]);
  });

  it("Fervex increases in benefit", async () => {
    expect(
      await new Pharmacy([new Drug("Fervex", 20, 20)]).updateBenefitValue()
    ).toEqual([new Drug("Fervex", 19, 21)]);
  });

  it("Fervex increases in benefit", async () => {
    expect(
      await new Pharmacy([new Drug("Fervex", 20, 20)]).updateBenefitValue()
    ).toEqual([new Drug("Fervex", 19, 21)]);
  });

  it("Fervex benefit increases by 2 when there are 10 days or less", async () => {
    expect(
      await new Pharmacy([new Drug("Fervex", 10, 20)]).updateBenefitValue()
    ).toEqual([new Drug("Fervex", 9, 22)]);
  });

  it("Fervex benefit increases by 3 when there are 5 days or less", async () => {
    expect(
      await new Pharmacy([new Drug("Fervex", 5, 20)]).updateBenefitValue()
    ).toEqual([new Drug("Fervex", 4, 23)]);
  });

  it("Fervex benefit drops to 0 after the expiration date", async () => {
    expect(
      await new Pharmacy([new Drug("Fervex", 0, 20)]).updateBenefitValue()
    ).toEqual([new Drug("Fervex", -1, 0)]);
  });

  it("Fervex benefit stays at 0 after the expiration date", async () => {
    expect(
      await new Pharmacy([new Drug("Fervex", -5, 0)]).updateBenefitValue()
    ).toEqual([new Drug("Fervex", -6, 0)]);
  });

  it("Dafalgan degrades in benefit twice as fast before expiration", async () => {
    expect(
      await new Pharmacy([new Drug("Dafalgan", 10, 10)]).updateBenefitValue()
    ).toEqual([new Drug("Dafalgan", 9, 8)]);
  });

  it("Dafalgan degrades in benefit twice as fast after expiration", async () => {
    expect(
      await new Pharmacy([new Drug("Dafalgan", 0, 10)]).updateBenefitValue()
    ).toEqual([new Drug("Dafalgan", -1, 6)]);
  });
});
