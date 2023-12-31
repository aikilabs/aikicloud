pragma solidity ^0.8.13;

import "openzeppelin-contracts/token/ERC20/ERC20.sol";

contract MockToken is ERC20 {
    constructor(string memory name, string memory symbol)
        ERC20(name, symbol) {}

    function mint(address to_, uint256 amount_) external {
        super._mint(to_, amount_);
    }
}