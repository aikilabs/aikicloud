import React from "react";
import Step from "./step";

const Steps = () => {
  const step = [
    {
      title: "Step 1",
      description: "Connect Wallet",
      number: 1,
    },
    {
      title: "Step 2",
      description: "Mint a cloud service nft",
      number: 2,
    },
    {
      title: "Step 3",
      description: "Lift off ",
      number: 3,
    },
  ];
  return (
    <section className="relative z-10 flex flex-col gap-12 overflow-hidden bg-black py-12">
      <div className="flex w-full flex-col px-4">
        <h1 className="text-center text-4xl font-extrabold capitalize text-hometext">
          How to use
        </h1>
        <p className="text-center text-sm text-hometext/80 sm:text-lg">
          Streamlined Process: Turning Cloud Service Rental into Simplicity
        </p>
      </div>
      <div className="grid place-items-center items-center gap-12 px-8 md:grid-cols-2 xl:grid-cols-3 xl:px-32">
        {step.map((feature) => (
          <Step
            key={feature.title}
            step={feature.number}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
};

export default Steps;
