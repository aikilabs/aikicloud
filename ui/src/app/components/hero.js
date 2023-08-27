"use client";
import Image from "next/image";
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const Hero = () => {
  const [screenHeight, setScreenHeight] = React.useState(0);
  React.useEffect(() => {
    const screenHeight = window?.innerHeight;
    setScreenHeight(screenHeight);
  }, []);
  // Calculate the animation range based on screen height
  const minY = 0;
  const maxY = screenHeight;

  const { scrollY, scrollYProgress } = useScroll();
  const y = useTransform(scrollY, [minY, maxY], ["0%", "-50%"], {
    clamp: false,
  });
  const opacity = useTransform(scrollY, [minY, maxY / 2, maxY], [1, 0, 0], {
    clamp: false,
  });
  return (
    <motion.section
      style={{ opacity }}
      className="sticky top-0 flex h-screen flex-col bg-[url(/nebula.jpg)] bg-cover bg-left "
    >
     
      <motion.article
        initial={{ y: "100px", opacity: 0 }}
        animate={{ y: "0px", opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        style={{ opacity, translateY: y }}
        className="flex h-full flex-col items-center justify-center gap-y-12 px-2 text-center sm:px-20 "
      >
        <h1 className="flex max-w-2xl text-center flex-col text-3xl font-bold text-hometext md:text-5xl">
          <span>Unleash Your Potential:</span> Rent Cloud Services, Fuel Your
          Success
        </h1>
        <button className="px-6 text-sm rounded bg-primary py-2 text-hometext">
          View Litepaper
        </button>
      </motion.article>
    </motion.section>
  );
};

export default Hero;

// https://www.figma.com/file/KIIVjkeSjvykDLySlgYz7O/Untitled?node-id=70%3A99&mode=dev
// https://www.figma.com/file/KIIVjkeSjvykDLySlgYz7O/Untitled?type=design&node-id=70%3A99&mode=design&t=8JxQW36MADS3HLs7-1
