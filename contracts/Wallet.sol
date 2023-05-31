// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Wallet {
    address private _router;
    IERC20 private _token1;
    IERC20 private _token2;

    constructor(address router, address token1, address token2) {
        _router = router;
        _token1 = IERC20(token1);
        _token2 = IERC20(token2);
    }
}
