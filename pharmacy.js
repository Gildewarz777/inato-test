import fs from "fs";
import _ from "lodash";

const checkBenefitRange = benefit => {
  if (benefit > 50) {
    benefit = 50;
  }

  if (benefit < 0) {
    benefit = 0;
  }

  return benefit;
};

export class Drug {
  constructor(name, expiresIn, benefit) {
    this.name = name;
    this.expiresIn = expiresIn;
    this.benefit = benefit;
  }

  async getConfig() {
    const config = await JSON.parse(fs.readFileSync("./drugs.config.json"));

    if (!config[this.name]) {
      this.setConfig();
      return config["defaultValues"];
    }

    return config[this.name];
  }

  setConfig(
    benefit = {
      initialIncrement: -1,
      steps: [
        {
          increment: -2,
          expiresIn: 0
        }
      ]
    },
    expiresIn = {
      increment: -1
    }
  ) {
    return fs.readFile("./drugs.config.json", function(err, data) {
      const json = JSON.parse(data);
      json[this.name] = {
        benefit,
        expiresIn
      };
      fs.writeFile("./drugs.config.json", JSON.stringify(json));
    });
  }

  async getNewBenefit() {
    const benefitConfig = (await this.getConfig()).benefit;

    let benefitIncrement = benefitConfig.initialIncrement;
    let newBenefit = this.benefit + benefitIncrement;

    if (!benefitConfig.steps) {
      return checkBenefitRange(newBenefit);
    }

    _.sortBy(benefitConfig.steps, "expiresIn");
    benefitConfig.steps.reverse();

    for (let i = 0; i < benefitConfig.steps.length; i++) {
      if (benefitConfig.steps[i].expiresIn >= this.expiresIn) {
        return benefitConfig.steps[i].forceValue != undefined
          ? checkBenefitRange(benefitConfig.steps[i].forceValue)
          : checkBenefitRange(this.benefit + benefitConfig.steps[i].increment);
      }
    }

    return checkBenefitRange(newBenefit);
  }

  async getNewExpiresIn() {
    return this.expiresIn + (await this.getConfig()).expiresIn.increment;
  }
}

export class Pharmacy {
  constructor(drugs = []) {
    this.drugs = drugs;
  }

  async updateBenefitValue() {
    for (let i = 0; i < this.drugs.length; i++) {
      this.drugs[i].benefit = await this.drugs[i].getNewBenefit();
      this.drugs[i].expiresIn = await this.drugs[i].getNewExpiresIn();
    }

    return this.drugs;
  }
}
