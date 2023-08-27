// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/RentalNFT.sol";

contract RentalNFTScript is Script {
    function run() external {
        address admin = 0x2e2316088c015F4BF27D86A1458A707af536A324;

        IERC20[] memory tokens = new IERC20[](1);
        tokens[0] = IERC20(0x0FA8781a83E46826621b3BC094Ea2A0212e71B23);

        IERC4907X.ServiceInfo[] memory services = new IERC4907X.ServiceInfo[](3);
        services[0] = IERC4907X.ServiceInfo(10000000000000000, "Azure cloud VM instance");
        services[1] = IERC4907X.ServiceInfo(10000000000000000, "AWS cloud EC2 instance");
        services[2] = IERC4907X.ServiceInfo(10000000000000000, "GCP cloud VM instance");

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        RentalNFT nft = new RentalNFT(admin, tokens, services);

        vm.stopBroadcast();
    }
}