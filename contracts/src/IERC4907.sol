// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IERC4907X {

    struct UserServiceInfo {
        address feeToken;   // token for service charge
        uint64 expires;     // unix timestamp, user service expires
    }

    struct ServiceInfo {
        uint64 fee;         // fee in USD per hr.
        string name;
    }

    // Logged when the user of an NFT is changed or expires is changed
    /// @notice Emitted when the `user` of an NFT or the `expires` of the `user` is changed
    /// The zero address for user indicates that there is no user address
    event UpdateUser(uint256 indexed tokenId, address indexed prevUser, address indexed newUser);

    /// @notice Get the user expires of an NFT
    /// @dev The zero value indicates that there is no user
    /// @param tokenId The NFT to get the user expires for
    /// @return The user expires for this NFT
    function userExpires(uint256 tokenId, address _user) external view returns(uint256);
}
