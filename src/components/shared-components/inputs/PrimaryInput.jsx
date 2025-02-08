import React from "react";

const PrimaryInput = ({ label, name, type, placeholder }) => {
  return (
    <div className="w-full mb-5">
      <label className="uppercase text-base font-medium" htmlFor={name}>
        {label}
      </label>

      <div className="w-full h-[48px] rounded-[30px] overflow-hidden bg-[rgba(255,255,255,0.5)] shadow-sm mt-3">
        <input
          className="w-full h-full outline-none border-none bg-transparent p-3 placeholder:text-white text-base font-light"
          type={type}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default PrimaryInput;
