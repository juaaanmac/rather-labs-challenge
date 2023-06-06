
import UniswapV2FactoryAbi from "@sushiswap/core/build/abi/UniswapV2Factory.json"
import { UniswapV2FactoryByteCode } from '../utils/bytecodes/UniswapV2FactoryByteCode';
import { UniswapV2Router02ByteCode } from '../utils/bytecodes/UniswapV2Router02ByteCode';
import WETH9Abi from "@sushiswap/core/build/abi//WETH9Mock.json"
import { WETH9ByteCode } from '../utils/bytecodes/WETH9ByteCode';
import UniswapV2Router02Abi from "@sushiswap/core/build/abi/UniswapV2Router02.json"
import { ethers } from "hardhat";

async function main() {

    const [deployer] = await ethers.getSigners();

    console.log(``)
    console.log(`Deploying UniswapV2Factory`)

    const UniswapFactory = await ethers.getContractFactory(UniswapV2FactoryAbi, UniswapV2FactoryByteCode, deployer)
    const uniswapFactory = await UniswapFactory.deploy(deployer.address);

    console.log(` - UniswapV2Factory deployed at ${uniswapFactory.address}`)

    console.log(``)
    console.log(`Deploying WETH9`)

    const WETH9 = await new ethers.ContractFactory(WETH9Abi, WETH9ByteCode, deployer).deploy();

    console.log(` - WETH9 deployed at ${WETH9.address}`)

    console.log(``)
    console.log(`Deploying UniswapV2Router02`)

    const UniswapV2Router = await ethers.getContractFactory(UniswapV2Router02Abi, UniswapV2Router02ByteCode, deployer)
    const uniswapV2Router = await UniswapV2Router.deploy(uniswapFactory.address, WETH9.address);

    console.log(` - UniswapV2Router02 deployed at ${uniswapV2Router.address}`)

    console.log(``)
    console.log(`Deploying Wallet`)

    const ERC20Mock = await ethers.getContractFactory("ERC20Mock")
    const ERC20MockA = await ERC20Mock.deploy("ERC20MockA","MOCA", ethers.BigNumber.from("5000000000000000000"));
    const ERC20MockB = await ERC20Mock.deploy("ERC20MockB","MOCB", ethers.BigNumber.from("5000000000000000000"));

    const Wallet = await ethers.getContractFactory("Wallet")
    const wallet = await Wallet.deploy(uniswapV2Router.address, uniswapV2Router.address);

    console.log(` - Wallet deployed at ${wallet.address}`)

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
