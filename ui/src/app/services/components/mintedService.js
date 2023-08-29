"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const MintedService = ({ image, name, type, price, id }) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/services/mintedService/${id}`)}
      className="clip-box flex h-[292px] w-[262px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary md:h-[358px] md:w-[294px]"
    >
      <div className=" clip-box flex h-72 w-64 flex-col overflow-hidden rounded-lg  md:h-[22rem] md:w-[18rem]">
        <Image
          src={image || "/starsHome.svg"}
          className="basis-[75%] object-cover"
          alt={name || "placeholder"}
          width={6000}
          height={6000}
          priority
        />
        <div className="flex h-full w-full basis-[25%] flex-col justify-between bg-primary px-4 py-2">
          <h2 className="flex items-center gap-4 text-sm">
            <Image
              src="/checkMark.svg"
              className="w-5"
              alt="checkMark"
              width={16}
              height={16}
              priority
            />
            {type}
          </h2>
          <p className="text-lg">{name}</p>
          <div className="flex justify-between">
            <h4 className="text-xs text-white/70">Price</h4>
            <h5 className="text-xs font-semibold">${price} USD/hour</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MintedService;
