import React from "react";

const HomeRadio = ({ label, value, checkedValue, onChange }) => {
  return (
    <div className="w-full mb-5 flex items-center gap-3">
      <input
        type="radio"
        className="w-5 h-5"
        value={value}
        checked={checkedValue === value}
        onChange={onChange}
      />

      <label className=" text-base font-medium text-white">{label}</label>
    </div>
  );
};

export default HomeRadio;
