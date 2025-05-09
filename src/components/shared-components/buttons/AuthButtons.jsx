import React from "react";
import Spinner from "../Spinner";

const AuthButtons = ({ label = "login", textColor, isDisabled, isLoading }) => {
  return (
    <div
      className={` w-full rounded-[30px] h-[48px] max-w-[250px] overflow-hidden mx-auto hover:bg-transparent border-2 border-pumpkin dark:border-darkPumpkin2 transition-all mt-5 ${
        isDisabled
          ? "bg-[rgba(255,117,24,0.4)] "
          : "bg-pumpkin dark:bg-darkPumpkin2"
      }`}
    >
      <button
        disabled={isDisabled}
        className={`capitalize w-full h-full bg-transparent border-0 hover:text-pumpkin dark:hover:text-darkPumpkin2 disabled:bg-[rgba(255,117,24,0.4)] ${textColor} `}
      >
        {isLoading ? <Spinner /> : label}
      </button>
    </div>
  );
};

export default AuthButtons;
