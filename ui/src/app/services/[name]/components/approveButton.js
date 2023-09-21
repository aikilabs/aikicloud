import React from "react";
import { arbitrumAbi } from "../../../../../abi/arbitrumAbi";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useContractRead,
} from "wagmi";

const ApproveButton = ({ hours, amount, id, address }) => {
  const { config } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_SPENDING_ADDRESS,
    abi: arbitrumAbi,
    functionName: "approve",
    args: [
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
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
        {rentLoading ? "Approving..." : "Approve"}
      </button>
    </>
  );
};
export default ApproveButton;
