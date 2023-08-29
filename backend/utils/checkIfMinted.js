require("dotenv").config({
    path: "../.env",
});
const { ethers } = require("ethers");
// const { rentalNFTAbi } = require("../abi/rentalNFTAbi");

const checkIfMinted = async (tokenId, address) => {
    const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_RPC_URL);

    const abi = [
        "function balanceOf(address account, uint256 id) view returns (uint256)",
    ];
    const contract = new ethers.Contract(
        process.env.CONTRACT_ADDRESS,
        abi,
        provider
    );

    const balanceOf = await contract.balanceOf(address, tokenId);

    console.log(Number(balanceOf));

    if (Number(balanceOf) > 0) {
        return true;
    } else {
        return false;
    }
};

// checkIfMinted(0, "0x0395001fAB2F2373D8741d341Ca614c472502C9d");

module.exports = checkIfMinted;