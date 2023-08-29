"use client";
import Image from "next/image";
import React from "react";
// import { motion } from "framer-motion";

const Footer = () => {
  const logo = [
    "awsLogo.svg",
    "celoLogo.svg",
    "gcpLogo.svg",
    "walletConnetLogo.svg",
  ];

  return (
    <section className="bg-primarydark px-4 space-y-4 pt-12 text-hometext">
      <div className="flex flex-col items-center">
        <h1 className="text-center text-sm font-semibold capitalize text-hometext">
          Powered By:
        </h1>
        <div className="flex max-w-2xl w-full">
          <div className="flex w-full flex-wrap items-center justify-between gap-x-8 ">
            {logo.map((logo, index) => (
              <Image
              key={index + logo}
                className={`${index == 1 ? "w-20 md:w-32" : "w-8 md:w-20"} `}
                src={logo}
                height={`${index == 1 ? "188" : "100"}`}
                width={`${index == 1 ? "283" : "100"}`}
                alt={logo}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex pb-4 flex-col items-center gap-y-8 text-center">
        <div className="space-y-2">
          <h2 className="capitalize font-semibold text-hometext">
            Be the first to know when we launch
          </h2>
          <p className="text-sm text-hometext/50">
            Subscribe for updates. No spam, just exciting content from us
          </p>
        </div>
        <div className="flex w-full max-w-4xl justify-center px-4">
          <input className="flex-1 text-lg rounded-l py-0.5" />
          <button className="rounded-r bg-primary px-2 text-sm">
            Stay Updated
          </button>
        </div>
      </div>
      <nav className="border-t-2 border-white/40 px-4 py-4 text-[0.5rem] md:text-xs">
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
