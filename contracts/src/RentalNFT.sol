// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "openzeppelin-contracts/token/ERC1155/ERC1155.sol";
import "./IERC20.sol";
import {IERC4907X} from "./IERC4907.sol";

contract RentalNFT is ERC1155, IERC4907X {

    struct UserServiceInfo {
        address feeToken;   // token for service charge
        uint64 expires;     // unix timestamp, user service expires
    }

    struct ServiceInfo {
        uint64 fee;     // fee in USD per hr.
        string name;
    }

    uint256 constant _DECIMALS = 1e18;

    /// @dev track supported services count
    uint256 public serviceCount;

    /// @dev admin account
    address public admin;

    /// @dev supported cloud services id
    mapping(uint256 => ServiceInfo) public services;

    /// @dev supported fee tokens
    mapping(address => bool) public feeTokens;

    /// @dev user info of service NFT
    mapping(uint256 => mapping(address => UserServiceInfo)) internal _users;


    /// RentalNFT: EVENTS

    /// @dev events naming supported services
    event ServiveAdded (uint256 indexed serviceId, string name);

    /// @dev service rented
    event ServiceApproved(uint256 indexed serviceId, address indexed user, uint256 expires);


    /// RentalNFT: ERROR MESSAGES
    error NotAdmin();
    error UnsupportedService(uint256 serviceId);
    error UnsupportedToken(address token);
    error InsufficientBalance(uint256 balance, uint256 serviceCost);
    error InvalidRentalTime();
    error AlreadyMinted(uint256 serviceId);
    error NoUserForService(uint256 serviceId);


    constructor(
        address _admin,
        string memory uri_,
        ServiceInfo[] memory _services
    ) ERC1155(uri_) {

        admin = _admin;

        // add supported service and emit events
        for(uint256 i=0; i < _services.length; i++) {
            services[i] = _services[i];
            emit ServiveAdded(i, _services[i].name);
        }

        serviceCount = _services.length;
    }

    /// @dev rents a service, minting an NFT and transferring the fee to the admin
    /// @param _serviceId  The id of the service to rent
    /// @param _feeToken  The token to pay the fee in
    function rentService(
        uint256 _serviceId,
        address _feeToken,
        uint256 _rentAmount
    ) isValidService(_serviceId) isSupportedToken(_feeToken) external {

        // transfer fee to admin
        uint256 serviceCost = services[_serviceId].fee * (10 ** IERC20(_feeToken).decimals()) / _DECIMALS;
        uint256 minterBalance = IERC20(_feeToken).balanceOf(msg.sender);
        uint64 hrsToRent = uint64(_rentAmount / serviceCost);

        if(hrsToRent == 0) {
            revert InvalidRentalTime();
        }
        // check if minter has enough balance
        if(minterBalance < _rentAmount) {
            revert InsufficientBalance(minterBalance, _rentAmount);
        }
        IERC20(_feeToken).transferFrom(msg.sender, admin, _rentAmount);

        // shouldnt allow minting same id more than once
        uint256 idBalance = super.balanceOf(msg.sender, _serviceId);

        if(idBalance > 1) {
            revert AlreadyMinted(_serviceId);
        }
        
        // mint NFT
        _mint(msg.sender, _serviceId, 1, "");

        // add user for service and emit service rented event
        uint64 expires = uint64(block.timestamp + hrsToRent * 3600);
        _users[_serviceId][msg.sender] = UserServiceInfo(_feeToken, expires);

        emit ServiceApproved(_serviceId, msg.sender, expires);
    }

    ///@dev prolong the lifetime of a service.
    ///@notice if the service is expired, the new expirytime will start from now, otherwise old expirytime is extended.
    function extendService(
        uint256 _serviceId,
        address _feeToken,
        uint64 _hrs
    ) isValidService(_serviceId) isSupportedToken(_feeToken) external {
        UserServiceInfo storage _userInfo = _users[_serviceId][msg.sender];
        uint64 expiryTime = _userInfo.expires;

        // ensure to extend for same token used to rent service.
        if(_userInfo.feeToken != _feeToken) {
            revert NoUserForService(_serviceId);
        }

        uint256 serviceCost = services[_serviceId].fee * (10 ** IERC20(_feeToken).decimals()) / _DECIMALS;
        uint256 extensionFee = serviceCost * _hrs;
        uint256 userBalance = IERC20(_feeToken).balanceOf(msg.sender);

        if(userBalance < extensionFee) {
            revert InsufficientBalance(userBalance, extensionFee);
        }

        // charge user for service, increase expiry time and emit service event
        IERC20(_feeToken).transferFrom(msg.sender, admin, extensionFee);

        if(expiryTime < block.timestamp) {
            expiryTime = uint64(block.timestamp);
        }

        _userInfo.expires = uint64(expiryTime + _hrs * 3600);

        emit ServiceApproved(_serviceId, msg.sender, expiryTime);
    }


    ///@dev end the lifetime of a service with possible refund
    function endService(
        uint256 _serviceId,
        address _feeToken
    ) external isValidService(_serviceId) isSupportedToken(_feeToken) {
        UserServiceInfo storage serviceInfo = _users[_serviceId][msg.sender];
        uint64 expiryTime = serviceInfo.expires;

        if(expiryTime <= block.timestamp) {
            revert NoUserForService(_serviceId);
        }

        uint64 unusedHrs = uint64((expiryTime - block.timestamp) / 3600);

        uint256 serviceCost = services[_serviceId].fee * (10 ** IERC20(_feeToken).decimals()) / _DECIMALS;

        uint256 refund = unusedHrs * serviceCost;

        IERC20(_feeToken).transferFrom(admin, msg.sender, refund);

        serviceInfo.expires = 0;

        emit ServiceApproved(_serviceId, msg.sender, 0);
    }

    /// @dev add support for a new fee token
    function addFeeToken(address[] calldata tokens) onlyAdmin external {
        for(uint256 i=0; i < tokens.length; i++) {
            feeTokens[tokens[i]] = true;
        }
    }

    /// @dev add support for a new service
    function addService(ServiceInfo calldata info) external onlyAdmin {
        services[serviceCount] = info;
        emit ServiveAdded(serviceCount++, info.name);
    }

    function userInfo(uint256 tokenId, address _user) public view virtual returns(UserServiceInfo memory info) {
        info = _users[tokenId][_user];
    }

    /// @notice Get the user expires of an NFT
    /// @dev The zero value indicates that there is no user
    /// @param tokenId The NFT to get the user expires for
    /// @return The user expires for this NFT
    function userExpires(uint256 tokenId, address _user) public view virtual returns(uint256) {
        return _users[tokenId][_user].expires;
    }

    /// @dev See {IERC165-supportsInterface}.
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IERC4907X).interfaceId || super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory tokenIds,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override {
        // super._beforeTokenTransfer(from, to, tokenId);


        super._beforeTokenTransfer(
            operator,
            from, 
            to, 
            tokenIds,
            amounts,
            data);

        // clear user info if NFT is transferred
        if (from != to && _users[tokenIds[0]][from].feeToken != address(0)) {
            delete _users[tokenIds[0]][from];
            emit UpdateUser(tokenIds[0], address(0), 0);
        }
    }


    // create an array with only one element
    function _singletonArray(uint256 element) private pure returns (uint256[] memory) {
        uint256[] memory array = new uint256[](1);
        array[0] = element;

        return array;
    }


    // RentalNFT: MODIFIERS

    modifier onlyAdmin() {
        if(msg.sender != admin) {
            revert NotAdmin();
        }
        _;
    }

    modifier isValidService(uint256 _serviceId) {
        if(_serviceId >= serviceCount) {
            revert UnsupportedService(_serviceId);
        }
        _;
    }

    modifier isSupportedToken(address _feeToken) {
        if(!feeTokens[_feeToken] || _feeToken == address(0)) {
            revert UnsupportedToken(_feeToken);
        }
        _;
    }
} 