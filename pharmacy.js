import fs from "fs";
import _ from "lodash";

export class Drug {
  constructor(name, expiresIn, benefit) {
    this.name = name;
    this.expiresIn = expiresIn;
    this.benefit = benefit;
  }

  async getConfig() {
    const config = await JSON.parse(fs.readFileSync("./drugs.config.json"));

    if (!config[this.name]) {
      await this.setConfig();
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

  async getCurrentIncrement() {
    const benefitConfig = (await this.getConfig()).benefit;

    let benefitIncrement = benefitConfig.initialIncrement;

    if (!benefitConfig.steps) {
      return benefitIncrement;
    }

    _.sortBy(benefitConfig.steps, "expiresIn");
    benefitConfig.steps.reverse();

    for (let i = 0; i < benefitConfig.steps.length; i++) {
      if (benefitConfig.steps[i].expiresIn >= this.expiresIn) {
        return benefitConfig.steps[i].increment;
      }
    }

    return benefitIncrement;
  }

  async getExpiresInIncrement() {
    return (await this.getConfig()).expiresIn.increment;
  }
}

export class Pharmacy {
  constructor(drugs = []) {
    this.drugs = drugs;
  }

  async updateBenefitValue() {
    for (let i = 0; i < this.drugs.length; i++) {
      let newBenefit =
        this.drugs[i].benefit + (await this.drugs[i].getCurrentIncrement());

      if (newBenefit > 50) {
        newBenefit = 50;
      }

      if (newBenefit < 0) {
        newBenefit = 0;
      }

      this.drugs[i].benefit = newBenefit;

      this.drugs[i].expiresIn += await this.drugs[i].getExpiresInIncrement();
    }

    return this.drugs;
  }
}
