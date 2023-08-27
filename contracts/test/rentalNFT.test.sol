pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/StdUtils.sol";
import "../src/RentalNFT.sol";
import "../src/IERC20.sol";
import {MockToken} from "./MockERC20.sol";
import {IERC4907X} from "../src/IERC4907.sol";


contract RentalNFTTest is Test {
    uint256 public constant ONE_HOUR = 60 * 60;
    // event ServiceApproved(uint256 indexed serviceId, address indexed user, uint256 expires);
    event ServiceApproved(uint256 indexed serviceId, address indexed user, uint256 expires);

    // contract under test
    RentalNFT _rentalNFT;

    // mock token
    MockToken _token1;
    MockToken _token2;

    // tokens
    IERC20 _dai = IERC20(0x6B175474E89094C44Da98b954EedeAC495271d0F);
    IERC20 _usdc = IERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);

    // test address
    address _alice = makeAddr("alice");  // Admin for contract
    address _bob = makeAddr("bob");
    address _carol = makeAddr("carol");
    
    

    function setUp() public {
        vm.startPrank(_alice);

        // add some services
        IERC4907X.ServiceInfo[] memory serviceInfo = new IERC4907X.ServiceInfo[](2);
        serviceInfo[0] = IERC4907X.ServiceInfo(uint64(100), "EC2 service");
        serviceInfo[1] = IERC4907X.ServiceInfo(uint64(50), "Stable diffusion service");

        // add some tokens
        // IERC20[] memory tokens = new IERC20[](2);
        // tokens[0] = _dai;
        // tokens[1] = _usdc;

        // instantiate mock tokens
        _token1 = new MockToken("Token 1", "TK1");
        _token2 = new MockToken("Token 2", "TK2");

        // mint tokens to bob
        _token1.mint(_bob, 1_000_000);
        _token2.mint(_bob, 500);

        // add support for tokens in contract
        IERC20[] memory tokens = new IERC20[](2);
        tokens[0] = IERC20(address(_token1));
        tokens[1] = IERC20(address(_token2));

        _rentalNFT = new RentalNFT(_alice, tokens, serviceInfo);



        // only _bob has tokens
        // deal(address(_dai), _bob, 1000);
        // deal(address(_usdc), _bob, 1000);
        // emit bob's balance
        emit log_uint(IERC20(address(_token1)).balanceOf(_bob));
        emit log_uint(IERC20(address(_token2)).balanceOf(_bob));

        // emit alice's balance
        emit log_uint(IERC20(address(_token1)).balanceOf(_alice));
        emit log_uint(IERC20(address(_token2)).balanceOf(_alice));
        vm.stopPrank();
    }

    function test_ContractStateIsSetCorrectly() public {
        assertEq(_rentalNFT.admin(), _alice);
        assertEq(_rentalNFT.serviceCount(), 2);
        assertEq(_rentalNFT.feeTokens(IERC20(address(_token1))), true);
        assertEq(_rentalNFT.feeTokens(IERC20(address(_token2))), true);
    }

    function test_WalletCanRentService() public {
        vm.startPrank(_bob);
        // transfer some token balance to contract's address
        _token1.approve(address(_rentalNFT), 1_000);

        // rent a service
        _rentalNFT.rentService(0, IERC20(address(_token1)), 200);

        // vm.expectEmit();
        // emit ServiceApproved(0, _bob, uint64(block.timestamp + uint256(2 * 3600)));     // 2 hours expiry

        IERC4907X.UserServiceInfo memory userInfo = _rentalNFT.userServiceInfo(0, _bob);

        assertEq(userInfo.feeToken, address(_token1));
        assertEq(userInfo.expires, block.timestamp + (2 * 3600));

        vm.stopPrank();
    }

    function test_WalletCanExtendService() public {
        rentService(_bob, 100, 1, IERC20(address(_token1)));

        // forward block time three hours
        skip(ONE_HOUR * 3);

        _token1.approve(address(_rentalNFT), 50);
        // // expect emitted event
        // vm.expectEmit(address(_rentalNFT));

        // emit ServiceApproved(1, _bob, block.timestamp + (ONE_HOUR * 2) + (ONE_HOUR * 3));

        _rentalNFT.extendService(1, IERC20(address(_token1)), 1);

        IERC4907X.UserServiceInfo memory userInfo = _rentalNFT.userServiceInfo(1, _bob);

        assertEq(userInfo.expires, block.timestamp + ONE_HOUR);
    }

    function test_WalletCanStopService() public {
        rentService(_bob, 250, 1, IERC20(address(_token1)));

        _rentalNFT.stopService(1);

        // stopping returns service timestamp to zero
        IERC4907X.UserServiceInfo memory userInfo = _rentalNFT.userServiceInfo(1, _bob);
        assertEq(userInfo.expires, 0);

    }

    function test_AdminCanWithdrawTokens() public {
        rentService(_bob, 250, 1, IERC20(address(_token1)));
        vm.stopPrank();
        
        // Alice is admin
        vm.startPrank(_alice);

        IERC20[] memory tokens = new IERC20[](1);
        tokens[0] = IERC20(address(_token1));

        address[] memory recipients = new address[](1);
        recipients[0] = _carol;

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 250;

        _rentalNFT.withdraw(tokens, recipients, amounts);

        assertEq(_token1.balanceOf(_carol), 250);
    }

    function rentService(address who, uint256 amt, uint256 serviceId, IERC20 token) internal {
        vm.startPrank(who);
        token.approve(address(_rentalNFT), amt);
        _rentalNFT.rentService(serviceId, token, amt);
    }

    function test_canAddFeeTokens() public {
        vm.startPrank(_alice);

        IERC20[] memory tokens = new IERC20[](2);

        tokens[0] = _dai; // DAI
        tokens[1] = _usdc; // USDC

        _rentalNFT.addFeeToken(tokens);

        assertEq(_rentalNFT.feeTokens(IERC20(_dai)), true);
        assertEq(_rentalNFT.feeTokens(IERC20(_usdc)), true);
        vm.stopPrank();
    }

}
