import { HardhatUserConfig } from "hardhat/config";
import { resolve } from "path";
import { config as dotenvConfig } from "dotenv";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import "hardhat-deploy";

const dotenvConfigPath: string = process.env.DOTENV_CONFIG_PATH || "./.env";
dotenvConfig({ path: resolve(__dirname, dotenvConfigPath) });

const config: HardhatUserConfig = {
	solidity: "0.8.18",
	namedAccounts: {
		deployer: 0,
		user: 1,
	},
	networks: {
		hardhat: {
			live: false,
			saveDeployments: true,
			chainId: 31337,
		},
	}
};

export default config;
