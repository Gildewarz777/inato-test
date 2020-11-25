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
    }

    return config["defaultValues"];
  }

  setConfig(
    initialIncrement = -1,
    steps = [
      {
        increment: -2,
        expiresIn: 0
      }
    ]
  ) {
    return fs.readFile("./drugs.config.json", function(err, data) {
      const json = JSON.parse(data);
      json[this.name] = {
        initialIncrement,
        steps
      };
      fs.writeFile("./drugs.config.json", JSON.stringify(json));
    });
  }

  async getCurrentIncrement() {
    const config = await this.getConfig();

    let increment = config.initialIncrement;

    if (!config.steps) {
      return increment;
    }

    _.sortBy(config.steps, "expiresIn");
    config.steps.reverse();

    for (let i = 0; i < config.steps.length; i++) {
      if (config.steps[i].expiresIn > this.expiresIn) {
        return config.steps[i].increment;
      }
    }

    return increment;
  }
}

export class Pharmacy {
  constructor(drugs = []) {
    this.drugs = drugs;
  }

  async updateBenefitValue() {
    for (let i = 0; i < this.drugs.length; i++) {
      const newBenefit =
        this.drugs[i].benefit + (await this.drugs[i].getCurrentIncrement());

      if (newBenefit <= 50 || newBenefit >= 0) {
        this.drugs[i].benefit = newBenefit;
      }

      this.drugs[i].expiresIn -= 1;

      // Add conditions:
      // Benefit not negative of

      // if (
      //   this.drugs[i].name != "Herbal Tea" &&
      //   this.drugs[i].name != "Fervex"
      // ) {
      //   if (this.drugs[i].benefit > 0) {
      //     if (this.drugs[i].name != "Magic Pill") {
      //       this.drugs[i].benefit = this.drugs[i].benefit - 1;
      //     }
      //   }
      // } else {
      //   if (this.drugs[i].benefit < 50) {
      //     this.drugs[i].benefit = this.drugs[i].benefit + 1;
      //     if (this.drugs[i].name == "Fervex") {
      //       if (this.drugs[i].expiresIn < 11) {
      //         if (this.drugs[i].benefit < 50) {
      //           this.drugs[i].benefit = this.drugs[i].benefit + 1;
      //         }
      //       }
      //       if (this.drugs[i].expiresIn < 6) {
      //         if (this.drugs[i].benefit < 50) {
      //           this.drugs[i].benefit = this.drugs[i].benefit + 1;
      //         }
      //       }
      //     }
      //   }
      // }
      // if (this.drugs[i].name != "Magic Pill") {
      //   this.drugs[i].expiresIn = this.drugs[i].expiresIn - 1;
      // }
      // if (this.drugs[i].expiresIn < 0) {
      //   if (this.drugs[i].name != "Herbal Tea") {
      //     if (this.drugs[i].name != "Fervex") {
      //       if (this.drugs[i].benefit > 0) {
      //         if (this.drugs[i].name != "Magic Pill") {
      //           this.drugs[i].benefit = this.drugs[i].benefit - 1;
      //         }
      //       }
      //     } else {
      //       this.drugs[i].benefit =
      //         this.drugs[i].benefit - this.drugs[i].benefit;
      //     }
      //   } else {
      //     if (this.drugs[i].benefit < 50) {
      //       this.drugs[i].benefit = this.drugs[i].benefit + 1;
      //     }
      //   }
      // }
    }

    return this.drugs;
  }
}
