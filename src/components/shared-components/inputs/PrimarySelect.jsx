import React, { useState } from "react";

const PrimarySelect = ({
  label,
  name,
  placeholder,
  handleChange,
  value,
  labelStyle = "uppercase",
  optionData,
  isCompulsory,
}) => {
  return (
    <div className="w-full mb-5">
      <label
        className={`${labelStyle} text-base font-medium text-white`}
        htmlFor={name}
      >
        {isCompulsory && <>*</>}
        {label}
      </label>

      <div className="w-full h-[48px] rounded-[30px] overflow-hidden bg-[rgba(255,255,255,0.5)] shadow-sm mt-3 px-4">
        <select
          onChange={handleChange}
          className="w-full h-full outline-none border-none bg-transparent py-3 placeholder:text-white text-base font-light text-black"
          placeholder={placeholder}
          name={name}
          value={value}
        >
          <option className="text-black">{placeholder}</option>
          {optionData}
        </select>
      </div>
    </div>
  );
};

export default PrimarySelect;
