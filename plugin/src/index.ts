import { extendConfig, extendEnvironment, task, types } from "hardhat/config";
import { lazyObject } from "hardhat/plugins";
import { HardhatConfig, HardhatUserConfig } from "hardhat/types";
import { World } from "./scenario/World";
import path from "path";
// depend on hardhat-ethers
import "@nomiclabs/hardhat-ethers";

import "./type-extensions";
import { evaluate_repl, setup_repl } from "./scenario/Repl";
import { ReplEvaluator } from "./evaluator";

extendConfig(
  (config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
    // We apply our default config here. Any other kind of config resolution
    // or normalization should be placed here.
    //
    // `config` is the resolved config, which will be used during runtime and
    // you should modify.
    // `userConfig` is the config as provided by the user. You should not modify
    // it.
    //
    // If you extended the `HardhatConfig` type, you need to make sure that
    // executing this function ensures that the `config` object is in a valid
    // state for its type, including its extentions. For example, you may
    // need to apply a default value, like in this example.
    const userPath = userConfig.paths?.networks;

    let networks: string;
    if (userPath === undefined) {
      networks = path.join(config.paths.root, "networks");
    } else {
      if (path.isAbsolute(userPath)) {
        networks = userPath;
      } else {
        networks = path.normalize(path.join(config.paths.root, userPath));
      }
    }
    config.paths.networks = networks;
  }
);

extendEnvironment(async (hre) => {
  // create the world
  hre.world = await setup_repl(hre);
  hre.repl = new ReplEvaluator(hre);
});

const cmd = task("exec", "send message to world");
cmd.addParam("cmd", "cmd", "", types.string);
cmd.setAction(async (args, hre) => {
  console.log(args.command);
});
