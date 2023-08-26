import React from "react";
import Service from "../components/service";
import Details from "./components/details";

const Page = () => {
  const service = {
    image: "/nebula.jpg",
     pp: "/nebula.jpg",
    name: "Test Service 3",
    type: "Test Type 3",
    price: "$50.00/hr",
    ram: "1gb",
    storage : "8gb",
    lifeSpan: "2 weeks",
    cpu: "1",
    cloud: "aws",
    address: "0x123456789555555666660",

  };
  return (
    <main className="flex min-h-full flex-col items-center md:items-start px-8 md:px-28 gap-y-8 bg-black py-24 text-white">
      <h1 className="max-w-xl font-semibold w-full  text-2xl capitalize">
        Service Details:
      </h1>
      <div className="flex flex-col md:flex-row w-full max-w-sm md:max-w-xl items-stretch gap-8">
        <Service {...service} />
        <Details {...service} />
      </div>
    </main>
  );
};

export default Page;
