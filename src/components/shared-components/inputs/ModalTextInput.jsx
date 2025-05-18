import React from "react";

const ModalTextInput = ({
  label,
  placeholder,
  value,
  name,
  type = "text",
  handleChange,
  disabled,
}) => {
  return (
    <div className="w-full mb-4">
      <label className="text-base font-medium text-gray-700">{label}</label>
      <input
        type={type}
        className="w-full border-b-2 border-gray-300 h-[45px] bg-gray-100 px-3 focus:outline-none text-gray-700"
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};

export default ModalTextInput;
