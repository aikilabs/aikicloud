"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  const logo = [
    "awsLogo.svg",
    "celoLogo.svg",
    "gcpLogo.svg",
    "walletConnetLogo.svg",
  ];

  return (
    <section className="space-y-16 bg-[#790058] px-4 pt-12 text-hometext">
      <div className="space-y-4">
        <h1 className="text-center text-3xl font-extrabold capitalize text-hometext">
          Powered By
        </h1>
        <div className="flex justify-center">
          <div className="flex max-w-2xl flex-wrap items-center justify-center gap-x-8 ">
            {logo.map((logo, index) => (
              <Image
                className={`${index == 1 ? "w-28 md:w-40" : "w-16 md:w-28"} `}
                src={logo}
                height={`${index == 1 ? "188" : "100"}`}
                width={`${index == 1 ? "283" : "100"}`}
                alt={logo}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-y-8 text-center">
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold capitalize text-hometext md:text-2xl md:text-3xl">
            Be the first to know when we launch
          </h2>
          <p className="text-xs text-hometext/50 md:text-base">
            Subscribe for updates. No spam, just exciting content from us
          </p>
        </div>
        <div className="flex w-full max-w-xl justify-center px-4">
          <input className="flex-1 text-lg rounded-l py-1 md:py-2" />
          <button className="rounded-r bg-primary px-2 text-sm">
            Stay Updated
          </button>
        </div>
      </div>
      <nav className="border-t px-4 py-2 text-[0.5rem] md:text-xs">
        <h3>2023. AIKICLOUD. ALL RIGHTS RESERVED</h3>
        {/* <div>
          <h4>Terms of use</h4>
          <h4>Privacy Policy</h4>
          <h4>Cookie Policy</h4>
        </div> */}
      </nav>
    </section>
  );
};

export default Footer;
