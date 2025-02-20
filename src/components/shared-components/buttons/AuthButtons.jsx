import React from "react";

const AuthButtons = ({ label = "login", textColor, isDisabled }) => {
  return (
    <div
      className={` w-full rounded-[30px] h-[48px] max-w-[250px] overflow-hidden mx-auto hover:bg-transparent border-2 border-pumpkin transition-all mt-5 ${
        isDisabled ? "bg-[rgba(255,117,24,0.4)] " : "bg-pumpkin"
      }`}
    >
      <button
        disabled={isDisabled}
        className={`capitalize w-full h-full bg-transparent border-0 hover:text-pumpkin disabled:bg-[rgba(255,117,24,0.4)] ${textColor} `}
      >
        {label}
      </button>
    </div>
  );
};

export default AuthButtons;
