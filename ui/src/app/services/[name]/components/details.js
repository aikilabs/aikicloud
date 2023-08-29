import Image from "next/image";
import React from "react";
import { BsPersonCircle } from "react-icons/bs";
import MintButton from "./mintButton";
import Service from "../../components/service";

const Details = ({
  name,
  pp,
  address,
  ram,
  storage,
  lifeSpan,
  cpu,
  cloud,
  amount,
  cost,
  id
}) => {
  const [hours, setHours] = React.useState(1);
  React.useEffect(() => {
    if (hours < 1) {
      setHours(1);
    }
  }, [hours]);
  return (
    <div className="flex h-full flex-1 flex-col gap-3 text-white">
      <h2 className="text-xl">{name}</h2>
      <div className="mb-2 flex flex-col gap-2">
        {/* <p className="pl-2 text-[0.6rem]">Owner</p> */}
        <div className="flex items-center gap-x-4 text-sm">
          <BsPersonCircle className="h-10 w-10" />
          <p>{address?.substring(0, 16).concat(`...${address.slice(-4)}`)}</p>
        </div>
      </div>
      <h3 className="font-semibold">
        Cost: {Number(amount) / 10 ** 18} USD/hr{" "}
      </h3>
      <div className="flex flex-col text-xs capitalize">
        <label htmlFor="hours">Hours to rent</label>
        <input
          type="number"
          placeholder="hours to rent default=1"
          min="1"
          value={hours}
          required
          onChange={(e) => setHours(e.target.value)}
          className="w-min rounded-md bg-white px-2 py-2 text-base text-black"
        />
      </div>
      <MintButton hours={hours} id={id} address={address} amount={Number(amount) / 10 ** 18} />
      {/* <h3>Storage: {storage}</h3>
      <h3>Life Span: {lifeSpan}</h3>
      <h3>CPU: {cpu}</h3>
      <h3>Cloud Provider: {cloud}</h3> */}
    </div>
  );
};

export default Details;
