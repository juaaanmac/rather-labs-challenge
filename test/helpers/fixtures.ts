import { ethers } from "hardhat";
import { UniswapV2FactoryByteCode } from "../../utils/bytecodes/UniswapV2FactoryByteCode";
import { UniswapV2Router02ByteCode } from "../../utils/bytecodes/UniswapV2Router02ByteCode";
import { WETH9ByteCode } from "../../utils/bytecodes/WETH9ByteCode";
import UniswapV2FactoryAbi from "@sushiswap/core/build/abi/UniswapV2Factory.json"
import WETH9Abi from "@sushiswap/core/build/abi/WETH9Mock.json"
import UniswapV2Router02Abi from "@sushiswap/core/build/abi/UniswapV2Router02.json"
import MasterChefAbi from "@sushiswap/core/build/abi/MasterChef.json"
import SushiTokenAbi from "@sushiswap/core/build/abi/SushiToken.json"
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SushiTokenByteCode } from "../../utils/bytecodes/SushiTokenByteCode";
import { MasterChefByteCode } from "../../utils/bytecodes/MasterChefByteCode";

const deployUniswapFactory = async () => {

    const [deployer] = await ethers.getSigners()

    const UniswapFactory = await ethers.getContractFactory(UniswapV2FactoryAbi, UniswapV2FactoryByteCode, deployer)
    const uniswapFactory = await UniswapFactory.deploy(deployer.address)

    return { uniswapFactory }
}

const deployWETH9 = async () => {

    const [deployer] = await ethers.getSigners()

    const WETH9 = await new ethers.ContractFactory(WETH9Abi, WETH9ByteCode, deployer).deploy();

    return { WETH9 }
}

const deployUniswapV2Router02 = async () => {

    const [deployer] = await ethers.getSigners()

    const { WETH9 } = await loadFixture(deployWETH9)
    const { uniswapFactory } = await loadFixture(deployUniswapFactory)

    const UniswapV2Router02 = await ethers.getContractFactory(UniswapV2Router02Abi, UniswapV2Router02ByteCode, deployer)
    const uniswapV2Router02 = await UniswapV2Router02.deploy(uniswapFactory.address, WETH9.address);

    return { uniswapFactory, uniswapV2Router02, WETH9 }
}

const deploySushiToken = async () => {

    const [deployer] = await ethers.getSigners()

    const SushiToken = await ethers.getContractFactory(SushiTokenAbi, SushiTokenByteCode, deployer)
    const sushiToken = await SushiToken.deploy();

    return { sushiToken }
}

const deployMasterChef = async () => {

    const [deployer] = await ethers.getSigners()

    const { sushiToken } = await loadFixture(deploySushiToken)

    const MasterChef = await ethers.getContractFactory(MasterChefAbi, MasterChefByteCode, deployer)
    const masterChef = await MasterChef.deploy(sushiToken.address,deployer.address,ethers.utils.parseUnits("100","wei"),1,10);

    return { masterChef }
}

const deployWallet = async () => {

    const [deployer] = await ethers.getSigners()

    const { uniswapV2Router02 } = await loadFixture(deployUniswapV2Router02)
    const { masterChef } = await loadFixture(deployMasterChef)

    const Wallet = await ethers.getContractFactory("Wallet")
    const wallet = await Wallet.deploy(uniswapV2Router02.address, masterChef.address);

    return { wallet }
}

export { deployUniswapFactory, deployUniswapV2Router02, deployWETH9, deployWallet, deploySushiToken, deployMasterChef }