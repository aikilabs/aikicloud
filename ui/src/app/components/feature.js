"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const Feature = ({ iconName, title, description }) => {
  return (
    <motion.div
      initial={{ y: "100px", opacity: 0 }}
      whileInView={{ y: "0px", opacity: 1 }}
      // viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="bg-gragra flex max-w-sm flex-col
gap-y-4 rounded-lg border border-[#D23E7E] p-6 text-hometext sm:h-full lg:max-w-md"
    >
      <Image
        className="w-16"
        src={`${iconName}.svg`}
        height={50}
        width={50}
        alt={iconName}
      />
      <h2 className="font-bold">{title}</h2>
      <p className="text-sm text-white/50">{description}</p>
    </motion.div>
  );
};

export default Feature;
