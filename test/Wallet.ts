import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { deployUniswapFactory, deployUniswapV2Router02, deployWETH9, deployWallet } from "./helpers/fixtures";
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

        it("Wallet deployment should set the correct values", async function () {

            const { wallet, uniswapV2Router02 } = await loadFixture(deployWallet)
            const [deployer] = await ethers.getSigners()

            expect(await wallet.router()).to.equal(uniswapV2Router02.address);
            expect(await wallet.masterChef()).to.equal(uniswapV2Router02.address);
        })

    })
})
