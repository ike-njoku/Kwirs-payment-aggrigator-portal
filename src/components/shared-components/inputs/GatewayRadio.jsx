import React from "react";
import Image from "next/image";

const GatewayRadio = ({ value, checkedValue, onChange, img, name }) => {
  console.log(checkedValue, value);
  return (
    <div className="w-full my-6 flex items-center gap-3">
      <input
        type="radio"
        className="w-5 h-5"
        value={value}
        checked={checkedValue === value}
        onChange={onChange}
        name={name}
      />

      <label
        className={`text-base font-medium text-white rounded-lg w-full py-6 relative cursor-pointer h-[60px] overflow-hidden bg-white ${
          checkedValue === value
            ? "border-pumpkin border-2"
            : " border border-gray-400 "
        }`}
      >
        <Image src={img} alt="alt-img" className="object-contain" fill />
      </label>
    </div>
  );
};

export default GatewayRadio;
