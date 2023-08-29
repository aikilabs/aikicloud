import React from "react";
import { iERC20Abi } from "../../../../../abi/iERC20Abi";
import { rentalNFTAbi } from "../../../../../abi/rentalNFTAbi";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useContractRead,
} from "wagmi";
import axios from "axios";
const MintButton = ({ hours, amount, id, address }) => {
  const { config } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi: rentalNFTAbi,
    functionName: "rentService",
    args: [
      id,
      "0x0FA8781a83E46826621b3BC094Ea2A0212e71B23",
      hours * (amount * 10 ** 6),
    ],
  });
  const {
    data: rentData,
    isLoading,
    isSuccess,
    write,
  } = useContractWrite(config);
  const { isLoading: rentLoading } = useWaitForTransaction({
    hash: rentData?.hash,
    onError(err) {},
    onSuccess(data) {
      const getSSH = async () => {
        try {
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}vm`,
            {
              serviceId: id,
              userAddr: address,
              duration: hours * 60 * 60,
            },
          );
          console.log(data);
        } catch (error) {
          console.log(error);
        }
      };
      getSSH();
    },
  });

  const mint = async () => {
    try {
      write?.();
      // redirect("/");
      console.log(id);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <button
        disabled={!write}
        onClick={mint}
        className="rounded-md bg-primary px-8 py-2 text-base"
      >
        {rentLoading ? "Minting..." : "Mint"}
      </button>
    </>
  );
};
export default MintButton;
