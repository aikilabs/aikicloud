import React from "react";
import Service from "./service";
import { useDispatch, useSelector } from "react-redux";

const AvailableServices = () => {
  const services = useSelector((state) => state.aikiCloud.services);

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
      {services.length > 0 ? (
        <div className="grid place-items-center gap-24 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service, index) => (
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
            No Available services
          </h1>
          <p className="text-lg">Coming soon . . .</p>
        </div>
      )}
    </div>
  );
};

export default AvailableServices;
