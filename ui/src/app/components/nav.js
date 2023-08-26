"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useNetwork, useBalance } from "wagmi";
import { useSelector, useDispatch } from "react-redux";
import {
  addUserAddress,
  changeWalletConnectionState,
  setAllAvailableTokens,
  setChainId,
} from "../../redux/aikiCloud";

const NavBar = () => {
  const { open, close } = useWeb3Modal();
  const { isConnected, address } = useAccount();
  const [balance, setBalance] = useState(0);
  const [balanceSymbol, setBalanceSymbol] = useState("");
  const [network, setNetwork] = useState("");

  const dispatch = useDispatch();
  const walletConnected = useSelector(
    (state) => state.aikiCloud.walletConnected,
  );

  const router = useRouter();
  const {
    data: balanceData,
    isError,
    isLoading,
  } = useBalance({
    address,
  });

  useEffect(() => {
    dispatch(changeWalletConnectionState(isConnected));
    dispatch(addUserAddress(address || ""));
    if (balanceData) {
      setBalance(balanceData.formatted);
      setBalanceSymbol(balanceData.symbol);
    }
    if (isConnected) {
      router.push("/services");
    } else {
      router.push("/");
    }
  }, [isConnected, network, address, balanceData]);

  return (
    <nav className="fixed inset-x-0 top-0 z-20 flex items-center justify-between border-b border-gray-200/20 px-2 py-4 backdrop-blur-md md:px-8">
      {" "}
      <Image
        className="h-6 cursor-pointer md:h-8"
        src="/logo.svg"
        width="152"
        height="34"
        onClick={() => router.push("/")}
        alt="logo of aikicloud"
      />
      <button
        onClick={() => open()}
        className={` flex items-center gap-x-2 rounded px-2 py-2 tracking-wider text-xs font-semibold text-white transition-all duration-100 md:px-4   ${
          walletConnected
            ? " bg-primary font-sans"
            : "border-primary bg-primary "
        }`}
      >
        {walletConnected
          ? address?.substring(0, 8).concat(`...${address.slice(-4)}`)
          : "Launch Dapp"}
      </button>
    </nav>
  );
};

export default NavBar;
