import React from "react";

const ModalSelect = ({
  label,
  placeholder,
  value,
  name,
  optionData,
  handleChange,
}) => {
  return (
    <div className="w-full mb-4">
      <label className="text-base font-medium text-gray-700">{label}</label>

      <select
        className="w-full border-b-2 border-gray-300 h-[45px] bg-gray-100 px-3 focus:outline-none text-gray-700"
        name={name}
        value={value}
        onChange={handleChange}
      >
        <option>{placeholder}</option>
        {optionData}
      </select>
    </div>
  );
};

export default ModalSelect;
