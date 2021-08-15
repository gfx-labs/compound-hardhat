import { HardhatRuntimeEnvironment } from "hardhat/types";
import { evaluate_repl } from "./scenario/Repl";

export class ReplEvaluator {
  hre: HardhatRuntimeEnvironment;
  constructor(hre: HardhatRuntimeEnvironment) {
    this.hre = hre;
  }

  line = async (x: string) => {
    try {
      evaluate_repl(this.hre.world, x, this.hre.macros);
    } catch (e) {
      console.log(e);
      return;
    }
  };

  lines = async (x: string) => {
    for (const command of x.split("\n")) {
      try {
        evaluate_repl(this.hre.world, command, this.hre);
      } catch (e) {
        console.log(e);
        return;
      }
    }
  };
}
