import React from "react";
import AvailableServices from "./components/availableServices";
import MintedServices from "./components/mintedServices";

const Page = () => {
  return (
    <main className="min-h-full py-24 flex gap-y-24 flex-col text-white bg-black">
      <AvailableServices />
      <MintedServices />
    </main>
  );
};

export default Page;
