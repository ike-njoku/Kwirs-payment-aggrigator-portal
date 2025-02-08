import React from "react";

const SwitchIcon = ({ isActive, onToggle, index }) => {
  return (
    <div
      className={`flex w-[40px] ${
        isActive ? "bg-pumpkin" : "bg-gray-300 "
      } relative h-[20px] rounded-[100px]`}
    >
      <div
        className={`absolute top-0 left-0 w-1/2 h-full bg-white shadow-sm rounded-[40px] transition-all  ${
          isActive ? "translate-x-full" : "translate-x-0"
        }`}
        onClick={() => onToggle(index)}
      ></div>
    </div>
  );
};

export default SwitchIcon;
