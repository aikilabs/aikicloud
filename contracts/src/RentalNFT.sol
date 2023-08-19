// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "openzeppelin-contracts/token/ERC1155/ERC1155.sol";
import "./IERC20.sol";
import {IERC4907X} from "./IERC4907.sol";


/// @title An ERC1155 RentalNFT contract implementation for cloud services
/// @author nuel-ikwuoma <emmanuelikwuoma7@gmail.com>
/// @notice This contract is a ERC1155 implementation for renting cloud services, test purpose only
contract RentalNFT is ERC1155, IERC4907X {

    uint256 public constant DECIMALS = 1e18;

    /// @dev track supported services count
    uint256 public serviceCount;

    /// @dev admin account
    address public admin;

    /// @dev supported cloud services id
    mapping(uint256 => IERC4907X.ServiceInfo) public services;

    /// @dev supported fee tokens
    mapping(IERC20 => bool) public feeTokens;

    /// @dev user info of service NFT
    /// serviceId => user address => UserServiceInfo
    mapping(uint256 => mapping(address => IERC4907X.UserServiceInfo)) internal _users;


    /// RentalNFT: EVENTS

    /// @dev events naming supported services
    event ServiveAdded (uint256 indexed serviceId, string name);

    /// @dev token added to supported fee tokens
    event FeeTokenAdded(IERC20 indexed token, uint256 addedAt);

    /// @dev service rented
    event ServiceApproved(uint256 indexed serviceId, address indexed user, uint256 expires);


    /// RentalNFT: ERROR MESSAGES
    error NotAdmin();
    error UnsupportedService(uint256 serviceId);
    error UnsupportedToken(IERC20 token);
    error InsufficientBalance(uint256 balance, uint256 serviceCost);
    error InvalidRentalTime();
    error AlreadyMinted(uint256 serviceId);
    error NoUserForService(uint256 serviceId);
    error LengthMismatch();


    /// RentalNFT: CONSTRUCTOR
    /// @param _admin  The admin account
    /// @param _uri  The base URI for the token
    /// @param _services  The supported services
    /// @param _tokens  The supported fee tokens
    constructor(
        address _admin,
        string memory _uri,
        IERC20[] memory _tokens,
        IERC4907X.ServiceInfo[] memory _services
    ) ERC1155(_uri) {

        admin = _admin;

        // add supported tokens
        for(uint256 i=0; i < _tokens.length; i++) {
            feeTokens[_tokens[i]] = true;
            emit FeeTokenAdded(_tokens[i], block.timestamp);
        }

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
    /// @param _rentAmount  The amount of the fee token to pay
    /// @return rented_  true if service was rented
    function rentService(
        uint256 _serviceId,
        IERC20 _feeToken,
        uint256 _rentAmount
    ) isValidService(_serviceId) isSupportedToken(_feeToken) external returns(bool rented_) {

        // transfer fee to admin
        uint256 serviceCost = services[_serviceId].fee * (10 ** IERC20(_feeToken).decimals()) / DECIMALS;
        uint256 minterBalance = IERC20(_feeToken).balanceOf(msg.sender);
        uint64 hrsToRent = uint64(_rentAmount / serviceCost);

        if(hrsToRent == 0) {
            revert InvalidRentalTime();
        }
        // check if minter has enough balance
        if(minterBalance < _rentAmount) {
            revert InsufficientBalance(minterBalance, _rentAmount);
        }
        _feeToken.transferFrom(msg.sender, address(this), _rentAmount);

        // shouldnt allow minting same id more than once
        uint256 idBalance = super.balanceOf(msg.sender, _serviceId);

        if(idBalance > 1) {
            revert AlreadyMinted(_serviceId);
        }
        
        // mint NFT
        _mint(msg.sender, _serviceId, 1, "");

        // add user for service and emit service rented event
        uint64 expires = uint64(block.timestamp + (hrsToRent * 3600));
        _users[_serviceId][msg.sender] = IERC4907X.UserServiceInfo(address(_feeToken), expires);

        emit ServiceApproved(_serviceId, msg.sender, expires);

        rented_ = true;
    }

    /// @dev prolong the lifetime of a service.
    /// @notice if the service is expired, the new expirytime will start from now, otherwise old expirytime is extended.
    /// @param _serviceId  The id of the service to extend
    /// @param _feeToken  The token to pay the fee in
    /// @param _hrs  The number of hours to extend the service for
    /// @return extended_  true if service was extended
    function extendService(
        uint256 _serviceId,
        IERC20 _feeToken,
        uint64 _hrs
    ) isValidService(_serviceId) isSupportedToken(_feeToken) external returns(bool extended_) {
        IERC4907X.UserServiceInfo storage _userInfo = _users[_serviceId][msg.sender];
        uint64 expiryTime = _userInfo.expires;

        // ensure to extend for same token used to rent service.
        if(_userInfo.feeToken != address(_feeToken)) {
            revert NoUserForService(_serviceId);
        }

        uint256 serviceCost = services[_serviceId].fee * (10 ** _feeToken.decimals()) / DECIMALS;
        uint256 extensionFee = serviceCost * _hrs;
        uint256 userBalance = _feeToken.balanceOf(msg.sender);

        if(userBalance < extensionFee) {
            revert InsufficientBalance(userBalance, extensionFee);
        }

        // charge user for service, increase expiry time and emit service event
        IERC20(_feeToken).transferFrom(msg.sender, admin, extensionFee);

        if(expiryTime < block.timestamp) {
            _userInfo.expires = uint64(block.timestamp);
        }

        _userInfo.expires = uint64(_userInfo.expires)  + uint64(_hrs * 3600);

        emit ServiceApproved(_serviceId, msg.sender, expiryTime);

        extended_ = true;
    }


    /// @dev end the lifetime of a service with possible refund
    /// @param serviceId_  The id of the service to end
    /// @return ended_  true if service was ended
    function stopService(uint256 serviceId_) external isValidService(serviceId_) returns(bool ended_) {
        IERC4907X.UserServiceInfo storage serviceInfo = _users[serviceId_][msg.sender];
        uint64 expiryTime = serviceInfo.expires;

        if(expiryTime <= block.timestamp) {
            revert NoUserForService(serviceId_);
        }

        address _feeToken = serviceInfo.feeToken;
        uint64 unusedHrs = uint64((expiryTime - block.timestamp) / 3600);

        uint256 serviceCost = services[serviceId_].fee * (10 ** IERC20(_feeToken).decimals()) / DECIMALS;

        uint256 refund = unusedHrs * serviceCost;

        IERC20(_feeToken).transfer(msg.sender, refund);

        serviceInfo.expires = 0;

        emit ServiceApproved(serviceId_, msg.sender, 0);

        ended_ = true;
    }

    /// @dev add support for a new fee token
    function addFeeToken(IERC20[] calldata tokens) onlyAdmin external {
        for(uint256 i=0; i < tokens.length; i++) {
            feeTokens[tokens[i]] = true;
            emit FeeTokenAdded(tokens[i], block.timestamp);
        }
    }

    /// @dev add support for a new service
    function addService(IERC4907X.ServiceInfo calldata info) external onlyAdmin {
        services[serviceCount] = info;
        emit ServiveAdded(serviceCount++, info.name);
    }


    function userServiceInfo(uint256 tokenId_, address user_) public view virtual returns(IERC4907X.UserServiceInfo memory info) {
        info = _users[tokenId_][user_];
    }

    /// @notice Get the user `expires` of an NFT
    /// @dev The zero value indicates that there is no user
    /// @param tokenId_ The NFT to get the user expires for
    /// @param user_ The address of the user
    /// @return expires_ The user expiry time for this NFT
    function userExpires(uint256 tokenId_, address user_) public view virtual returns(uint256 expires_) {
        expires_ = _users[tokenId_][user_].expires;
    }

    /// @dev See {IERC165-supportsInterface}.
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IERC4907X).interfaceId || super.supportsInterface(interfaceId);
    }

    /// @notice prevent token lock in contract
    function withdraw(
        IERC20[] memory tokens_,
        address[] memory recipients_,
        uint256[] memory amounts_) external onlyAdmin {
            // get all lengths of param
            uint256 tokenLen = tokens_.length;
            uint256 recipientLen = recipients_.length;
            uint256 amountLen = amounts_.length;

            if(!(tokenLen == recipientLen && tokenLen == amountLen)) {
                revert LengthMismatch();
            }
            for(uint256 i=0; i<tokenLen; ++i) {
                tokens_[i].transfer(recipients_[i], amounts_[i]);
            }
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory tokenIds,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override {
        
        super._beforeTokenTransfer(
            operator,
            from, 
            to, 
            tokenIds,
            amounts,
            data);

        // update service user on token transfer, say from user to marketplace contract
        // or to another user on secondary market or some other reason.
        // if mint or burn skip
        if(from != address(0) && to != address(0)) {
            _updateUser(tokenIds[0], from, to);
        }
    }

    function _updateUser(uint256 tokenId_, address from, address to) internal virtual {
            _users[tokenId_][to] = _users[tokenId_][from];
            delete _users[tokenId_][from];
            emit UpdateUser(tokenId_, from, to);
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

    modifier isSupportedToken(IERC20 _feeToken) {
        if(!feeTokens[_feeToken] || address(_feeToken) == address(0)) {
            revert UnsupportedToken(_feeToken);
        }
        _;
    }
} 