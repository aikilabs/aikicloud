import React from "react";
import Service from "./service";
import { useDispatch, useSelector } from "react-redux";

const MintedServices = () => {
  const mintedServices = useSelector((state) => state.aikiCloud.mintedServices);

  const testServices = [
    {
      image: "/nebula.jpg",
      name: "Test Service 2",
      type: "Test Type 2",
      price: "$50.00/hr",
    },
    {
      image: "/nebula.jpg",
      name: "Test Service 2",
      type: "Test Type 2",
      price: "$50.00/hr",
    },
    {
      image: "/nebula.jpg",
      name: "Test Service 3",
      type: "Test Type 3",
      price: "$50.00/hr",
    },
  ];
  return (
    <div className="flex flex-1 flex-col items-center gap-y-8 border-t border-white/20 px-16 py-8">
      <h1 className="w-full text-2xl font-semibold capitalize">
        Minted services
      </h1>
      {mintedServices.length > 0 ? (
        <div className="grid place-items-center gap-24 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mintedServices?.map((service, index) => (
            <Service
              key={index + service.name}
              id={index}
              name={service.description}
              type={service.name}
              price={service.properties.cost?.split(" ")[0]}
              image={service.image}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-y-8">
          <h1 className="text-2xl font-semibold capitalize">
            No minted services
          </h1>
          <p className="text-lg">Mint a service to see it here</p>
        </div>
      )}
    </div>
  );
};

export default MintedServices;
