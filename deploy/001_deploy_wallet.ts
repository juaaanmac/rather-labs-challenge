import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { getChainId } from 'hardhat';
import { localNetwork } from '../utils/network';

const version = "v0.0.1";
const contractName = "Wallet";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const { deployments, getNamedAccounts } = hre;
	const { deploy } = deployments;
	const chainId = await getChainId();

	const { deployer } = await getNamedAccounts();

	console.log(``)
	console.log(`Deploying ${contractName} on '${hre.network.name}' (chain ${chainId})`)

	const deployedWallet = await deploy(contractName, {
		from: deployer,
		args: [
			process.env.SUSHISWAP_ROUTER_ADDRESS,
			process.env.TOKEN_0_ADDRESS,
			process.env.TOKEN_1_ADDRESS
		],
		log: true,
		autoMine: true,
	});

	console.log(` - ${contractName} ${deployedWallet.newlyDeployed ? 'deployed' : 'reused'} at ${deployedWallet.address}`)
};

func.id = contractName + version;
func.tags = [contractName, version];
export default func;