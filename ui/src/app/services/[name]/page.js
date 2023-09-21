"use client";
import React, { useState } from "react";
import Service from "./components/service";
import Details from "./components/details";
import { rentalNFTAbi } from "../../../../abi/rentalNFTAbi";
import { useContractRead } from "wagmi";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";
import { usePathname } from "next/navigation";

const Page = () => {
  const { isConnected, address } = useAccount();
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState({});
  const pathName = usePathname();

  const mlootContract = {
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi: rentalNFTAbi,
  };
  const getService = useContractRead({
    ...mlootContract,
    functionName: "uri",
    args: [
      //  get id from current url /service/[id]
      pathName.split("/")[2],
    ],
    onSuccess(data) {
      setLoading(true);
      const getServices = async () => {
        const response = await fetch(data);
        const json = await response.json();
        setService((prevState) => ({
          ...prevState,
          ...json,
        }));
        setLoading(false);
      };
      getServices();
    },
  });
  const getServiceAmount = useContractRead({
    ...mlootContract,
    functionName: "services",
    args: [
      //  get id from current url /service/[id]
      pathName.split("/")[2],
    ],
    onSuccess(data) {
      setLoading(true);
      setService((prevState) => ({
        ...prevState,
        amount: data[0],
      }));
      console.log(data);
      setLoading(false);
    },
  });
  return (
    <>
      {loading ? (
        <div className="fixed left-0 top-0 z-50 h-screen w-screen bg-black backdrop-blur-lg">
          <div className="flex h-full items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-t-primary"></div>
          </div>
        </div>
      ) : (
        <main className="flex min-h-full flex-col items-center  gap-y-8 bg-black px-8 py-24 text-white md:px-28">
          <h1 className="w-full  text-2xl  font-semibold capitalize">
            Service Details:
          </h1>
          <div className="flex w-full max-w-2xl flex-col gap-8 md:flex-row">
            <Details
              {...service}
              cost={service.properties?.cost}
              address={address}
              id={pathName.split("/")[2]}
            />
            {service && (
              <Service
                id={pathName.split("/")[2]}
                name={service.description}
                type={service.name}
                price={Number(service.amount) / 10 ** 18}
                image={service.image}
              />
            )}
          </div>
        </main>
      )}
    </>
  );
};

export default Page;
