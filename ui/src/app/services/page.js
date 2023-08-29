"use client";
import React, { useEffect, useState } from "react";
import AvailableServices from "./components/availableServices";
import MintedServices from "./components/mintedServices";
import { rentalNFTAbi } from "../../../abi/rentalNFTAbi";
import { useContractRead, useContractReads } from "wagmi";
import { useDispatch, useSelector } from "react-redux";
import {
  setMintedServiceCount,
  setServiceCount,
  setServices,
  setMintedServices,
} from "../../redux/aikiCloud";
import { useAccount } from "wagmi";

const Page = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const serviceCount = useSelector((state) => state.aikiCloud.serviceCount);
  const services = useSelector((state) => state.aikiCloud.services);
  const mintedServices = useSelector((state) => state.aikiCloud.mintedServices);
  const mintedServiceCount = useSelector(
    (state) => state.aikiCloud.mintedServiceCount,
  );
  const { isConnected, address } = useAccount();

  const mlootContract = {
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi: rentalNFTAbi,
  };

  const getServiceCount = useContractRead({
    ...mlootContract,
    functionName: "serviceCount",
    onSuccess(data) {
      let serviceCount = [];
      for (let i = 0; i < Number(data); i++) {
        serviceCount.push(i);
      }
      dispatch(setServiceCount(serviceCount));
    },
  });

  const getServices = useContractReads({
    contracts: serviceCount.map((service, index) => {
      return {
        ...mlootContract,
        functionName: "uri",
        args: [index],
      };
    }),
    onSuccess(data) {
      setLoading(true);
      const getServices = async () => {
        const services = await Promise.all(
          data.map(async (service) => {
            const response = await fetch(service.result);
            const json = await response.json();
            return json;
          }),
        );
        // console.log(services);
        dispatch(setServices(services));
        setLoading(false);
      };
      getServices();
    },
  });
  const getServiceAmount = useContractReads({
    contracts: serviceCount.map((service, index) => {
      return {
        ...mlootContract,
        functionName: "services",
        args: [index],
      };
    }),
    onSuccess(data) {
      setLoading(true);
      const getServices = async () => {
        if (services.length > 0) {
          const newServices = services.map((service, index) => {
            return {
              ...service,
              amount: data[index].result[0],
            };
          });
          dispatch(setServices(newServices));
        }
        setLoading(false);
      };
      getServices();
      setLoading(false);
    },
  });

  const getMintedServices = useContractReads({
    contracts: serviceCount.map((service, index) => {
      return {
        ...mlootContract,
        functionName: "balanceOf",
        args: [address, index],
      };
    }),
    onSuccess(data) {
      setLoading(true);
      let mintedServiceCount = [];
      for (let i = 0; i < data.length; i++) {
        mintedServiceCount.push(Number(data[i].result));
        console.log(Number(data[i].result));
      }
      console.log({ data });
      dispatch(setMintedServiceCount(mintedServiceCount));
      setLoading(false);
    },
    onError(error) {
      console.log(error);
    },
  });

  useEffect(() => {
    setLoading(true);
    if (services.length > 0) {
      // const mintedService = services.filter((service, index) =>
      //   mintedServiceCount.includes(index),
      // );
      // const unMintedService = services.filter(
      //   (service, index) => !mintedServiceCount.includes(index),
      // );
      const mintedService = services.filter((service, index) =>
        mintedServiceCount[index] > 0
      );
      const unMintedService = services.filter(
        (service, index) => mintedServiceCount[index] <= 0
      );

      console.log(unMintedService);
      dispatch(setServices(unMintedService));
      dispatch(setMintedServices(mintedService));
    }
    setLoading(false);
  }, [mintedServiceCount]);

  return (
    <>
      {loading || (services.length <= 0 && mintedServices.length <= 0) ? (
        <div className="fixed left-0 top-0 z-50 h-screen w-screen bg-black backdrop-blur-lg">
          <div className="flex h-full items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-t-white"></div>
          </div>
        </div>
      ) : (
        <main className="flex min-h-full flex-col gap-y-24 bg-black py-24 text-white">
          <AvailableServices />
          <MintedServices />
        </main>
      )}
    </>
  );
};

export default Page;
