import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { deployMasterChef, deploySushiToken, deployUniswapFactory, deployUniswapV2Router02, deployWETH9, deployWallet } from "./helpers/fixtures";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Wallet", function () {

    describe("Deployment", function () {

        it("UniswapFactory deployment should set the correct values", async function () {

            const { uniswapFactory } = await loadFixture(deployUniswapFactory)
            const [deployer] = await ethers.getSigners()

            expect(await uniswapFactory.feeToSetter()).to.equal(deployer.address);

        })

        it("WETH9 deployment should set the correct values", async function () {

            const { WETH9 } = await loadFixture(deployWETH9)
            const [deployer] = await ethers.getSigners()

            expect(await WETH9.name()).to.equal("Wrapped Ether");
            expect(await WETH9.symbol()).to.equal("WETH");
        })

        it("UniswapV2Router02 deployment should set the correct values", async function () {

            const { uniswapFactory, uniswapV2Router02, WETH9 } = await loadFixture(deployUniswapV2Router02)
            const [deployer] = await ethers.getSigners()

            expect(await uniswapV2Router02.factory()).to.equal(uniswapFactory.address);
            expect(await uniswapV2Router02.WETH()).to.equal(WETH9.address);
        })

        it("SushiToken deployment should set the correct values", async function () {

            const { sushiToken } = await loadFixture(deploySushiToken)
            const [deployer] = await ethers.getSigners()

            expect(await sushiToken.symbol()).to.equal("SUSHI");
            expect(await sushiToken.name()).to.equal("SushiToken");
        })

        it("MasterChef deployment should set the correct values", async function () {

            const { sushiToken } = await loadFixture(deploySushiToken)
            const { masterChef } = await loadFixture(deployMasterChef)
            const [deployer] = await ethers.getSigners()

            expect(await masterChef.sushi()).to.equal(sushiToken.address);
        })

        it("Wallet deployment should set the correct values", async function () {

            const { uniswapV2Router02 } = await loadFixture(deployUniswapV2Router02)
            const { masterChef } = await loadFixture(deployMasterChef)
            const { wallet } = await loadFixture(deployWallet)
            const [deployer] = await ethers.getSigners()

            expect(await wallet.router()).to.equal(uniswapV2Router02.address);
            expect(await wallet.masterChef()).to.equal(masterChef.address);
        })

    })

    describe("Join", function () {

        it("", async function () {
            const { sushiToken } = await loadFixture(deploySushiToken)
            const { masterChef } = await loadFixture(deployMasterChef)
            const { wallet } = await loadFixture(deployWallet)
            const [deployer] = await ethers.getSigners()

            const ERC20Mock = await ethers.getContractFactory("ERC20Mock")
            const ERC20MockA = await ERC20Mock.deploy("ERC20MockA", "MOCA", ethers.BigNumber.from("5000000000000000000"));
            const ERC20MockB = await ERC20Mock.deploy("ERC20MockB", "MOCB", ethers.BigNumber.from("5000000000000000000"));
            
            const deadline = await time.latest() + 10000000

            await ERC20MockA.approve(wallet.address, 2000)
            await ERC20MockB.approve(wallet.address, 2000)

            await sushiToken.transferOwnership(masterChef.address)
            await wallet.join(ERC20MockA.address, ERC20MockB.address, 2000, 2000, 1000, 1000, wallet.address, deadline)

        })
    })

})
