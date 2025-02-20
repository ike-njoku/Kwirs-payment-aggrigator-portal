import React from "react";

const PrimaryInput = ({
  label,
  name,
  type,
  placeholder,
  handleChange,
  value,
  labelStyle = "uppercase",
}) => {
  return (
    <div className="w-full mb-5">
      <label
        className={`text-base font-medium text-white ${labelStyle}`}
        htmlFor={name}
      >
        {label}
      </label>

      <div className="w-full h-[48px] rounded-[30px] overflow-hidden bg-[rgba(255,255,255,0.5)] shadow-sm mt-3">
        <input
          onChange={handleChange}
          className="w-full h-full outline-none border-none bg-transparent p-3 placeholder:text-white text-base font-light"
          type={type}
          placeholder={placeholder}
          name={name}
          value={value}
        />
      </div>
    </div>
  );
};

export default PrimaryInput;
