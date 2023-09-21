"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useNetwork, useBalance, useSwitchNetwork } from "wagmi";
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

  const { chain } = useNetwork();
  const {
    chains,
    error,
    isLoading: networkSwitchLoading,
    pendingChainId,
    switchNetwork,
  } = useSwitchNetwork();

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
    if (isConnected && chain?.id == 42161) {
      router.push("/services");
    } else {
      router.push("/");
    }
  }, [isConnected, network, chain, address, balanceData]);

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
      <section className="flex items-center gap-4 text-white">
        {chain?.id != 42161 && (
          <>
            {chains.map((x) => (
              <button
                disabled={!switchNetwork || x.id === chain?.id}
                key={x.id}
                onClick={() => switchNetwork?.(x.id)}
                className="rounded-md bg-white p-2 text-xs font-semibold tracking-wider text-black transition-all duration-100 md:px-4"
              >
                Switch to {x.name}
                {isLoading && pendingChainId === x.id && " (switching)"}
              </button>
            ))}
          </>
        )}

        <button
          onClick={() => open()}
          className={` flex items-center gap-x-2 rounded px-2 py-2 text-xs font-semibold tracking-wider text-white transition-all duration-100 md:px-4   ${
            walletConnected
              ? " bg-primary font-sans"
              : "border-primary bg-primary "
          }`}
        >
          {walletConnected
            ? address?.substring(0, 8).concat(`...${address.slice(-4)}`)
            : "Launch Dapp"}
        </button>

        {/* <div>{error && error.message}</div> */}
      </section>
    </nav>
  );
};

export default NavBar;
