"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const Step = ({ step, title, description }) => {
  return (
    <motion.div
      initial={{ y: "100px", opacity: 0 }}
      whileInView={{ y: "0px", opacity: 1 }}
      // viewport={{ once: true }}
      transition={{ duration: 1 }}
      className={`flex h-full w-full max-w-sm flex-col gap-y-4 rounded-lg bg-gradient-to-t from-black via-black to-[#774264]/50 p-6 text-hometext lg:max-w-md ${
        step == 3 && "md:col-span-2 xl:col-span-1"
      }`}
    >
      <h1 className="text-6xl font-extrabold">{step}</h1>
      <h2>{title}</h2>
      <p className="text-sm text-white/50">{description}</p>
    </motion.div>
  );
};

export default Step;
