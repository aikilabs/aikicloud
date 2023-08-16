import React from "react";
import Feature from "./feature";

const Features = () => {
  const features = [
    {
      title: "Streamlined Cloud Service Rental",
      description:
        "Easily rent secure and reliable cloud services in just 2 to 3 clicks.",
      icon: "cloudIcon",
    },
    {
      title: "Seamless Experience",
      description:
        "Our app ensures a seamless experience, providing you with the utmost security and safety for all your cloud computing needs from any web3 wallet.",
      icon: "shieldIcon",
    },
    // {
    //   title: "Streamlined Cloud Service Rental",
    //   description:
    //     "Easily rent secure and reliable cloud services in just 2 to 3 clicks.",
    //   icon: "cloud",
    // },
  ];
  return (
    <section className="py-12 z-10 relative bg-black flex flex-col gap-12">
      <h1 className="text-4xl capitalize font-extrabold text-hometext text-center">Our features</h1>
      <div className="grid sm:grid-cols-2 gap-12 place-items-center items-center justify-center px-8">
        {features.map((feature) => (
          <Feature
            key={feature.title}
            iconName={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
};

export default Features;
