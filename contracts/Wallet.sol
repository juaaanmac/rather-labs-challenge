// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@sushiswap/core/contracts/uniswapv2/interfaces/IUniswapV2Router02.sol";

contract Wallet {
    address public router;
    address public masterChef;

    /// @author Juan Macri
    /// @param router_ SushiSwap router address
    /// @param masterChef_ SushiSwap MasterChef address
    constructor(address router_, address masterChef_) {
        router = router_;
        masterChef = masterChef_;
    }

    /// @notice encapsulates all the actions required to join SushiSwap’s liquidity mining program into a single, handy transaction
    /// @dev
    /// @param tokenA A pool token
    /// @param tokenB A pool token
    /// @param amountADesired The amount of tokenA to add as liquidity if the B/A price is <= amountBDesired/amountADesired (A depreciates)
    /// @param amountBDesired The amount of tokenB to add as liquidity if the A/B price is <= amountADesired/amountBDesired (B depreciates)
    /// @param amountAMin Bounds the extent to which the B/A price can go up before the transaction reverts. Must be <= amountADesired
    /// @param amountBMin Bounds the extent to which the A/B price can go up before the transaction reverts. Must be <= amountBDesired
    /// @param to Recipient of the liquidity tokens
    /// @param deadline Unix timestamp after which the transaction will revert
    function join(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external {
        // Provide liquidity on SushiSwap
        (uint amountA, uint amountB, uint liquidity) = IUniswapV2Router02(
            router
        ).addLiquidity(
                tokenA,
                tokenB,
                amountADesired,
                amountBDesired,
                amountAMin,
                amountBMin,
                to,
                deadline
            );

        // Approve the SushiSwap router to use your tokens
        IERC20(tokenA).approve(router, amountA);
        IERC20(tokenB).approve(router, amountB);

        // Approve the MasterChef smart contract to use your tokens
        IERC20(tokenA).approve(masterChef, amountA);
        IERC20(tokenB).approve(masterChef, amountB);
    }
}
