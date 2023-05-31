// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Wallet {
    address private _router;
    address private _token0;
    address private _token1;

    constructor(address router, address token0, address token1) {
        _router = router;
        _token0 = token0;
        _token1 = token1;
    }
}
