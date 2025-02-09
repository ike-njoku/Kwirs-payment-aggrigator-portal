import React from "react";

const VerifyInput = ({ label, value }) => {
  return (
    <div className="w-full mb-5">
      <label className="uppercase text-base font-medium">{label}</label>

      <div className="w-full h-[48px] rounded-lg border-b-2 border-pumpkin  mt-3">
        <input
          className="w-full h-full outline-none border-none bg-transparent p-3 placeholder:text-white text-base font-light"
          type="text"
          disabled
          value={value}
        />
      </div>
    </div>
  );
};

export default VerifyInput;
