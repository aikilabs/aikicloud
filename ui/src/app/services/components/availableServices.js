import React from "react";
import Service from "./service";

const AvailableServices = () => {
  const testServices = [
    
    {
      image: "/nebula.jpg",
      name: "Test Service 1",
      type: "Test Type 1",
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
    <div className="flex flex-1 flex-col items-center gap-y-8 border-white/20 px-16 ">
      <h1 className="w-full text-2xl font-semibold capitalize">
        Available services
      </h1>
      <div className="grid place-items-center gap-24 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {testServices.map((service) => (
          <Service
            name={service.name}
            type={service.type}
            price={service.price}
            image={service.image}
          />
        ))}
      </div>
    </div>
  );
};

export default AvailableServices;
