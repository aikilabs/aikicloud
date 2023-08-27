import Image from "next/image";
import React from "react";

const Details = ({ name, pp, address, ram, storage, lifeSpan, cpu, cloud }) => {
  return (
    <div className="h-full flex-1 flex flex-col gap-3 text-white">
      <h2 className="text-xl">{name}</h2>
      <div className="flex flex-col mb-2">
        <p className="text-[0.6rem] pl-2">Owner</p>
        <div className="flex items-center text-xs gap-x-4">
          <Image
            src={pp}
            alt={name}
            width={6000}
            height={6000}
            className="h-10 w-10 rounded-full"
            priority
          />
          <p>{address?.substring(0, 12).concat(`...${address.slice(-4)}`)}</p>
        </div>
      </div>
      <button className="mb-8 w-full rounded-md bg-primary py-1 text-sm">
        Mint
      </button>
      <h3>RAM: {ram}</h3>
      <h3>Storage: {storage}</h3>
      <h3>Life Span: {lifeSpan}</h3>
      <h3>CPU: {cpu}</h3>
      <h3>Cloud Provider: {cloud}</h3>
    </div>
  );
};

export default Details;
