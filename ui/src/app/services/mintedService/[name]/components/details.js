import Image from "next/image";
import React from "react";
import { BsPersonCircle } from "react-icons/bs";
import { BsInfo } from "react-icons/bs";

// import MintButton from "./mintButton";
// import Service from "../../components/service";

const Details = ({ connectionString }) => {
  const [hours, setHours] = React.useState(1);
  React.useEffect(() => {
    if (hours < 1) {
      setHours(1);
    }
  }, [hours]);
  return (
    <div className="flex h-full flex-1 flex-col gap-1 text-white">
      <h2 className="text-xl font-semibold underline">Connection String</h2>
      <h3 className="text-sm font-semibold">
        <BsInfo /> Paste in terminal, at the directory where pem file is saved
      </h3>
      <p className="text-xs">"{connectionString}"</p>
    </div>
  );
};

export default Details;
