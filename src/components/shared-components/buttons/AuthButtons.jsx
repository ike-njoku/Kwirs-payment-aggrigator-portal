import React from "react";

const AuthButtons = ({ label = "login", textColor }) => {
  return (
    <div className="bg-pumpkin w-full rounded-[30px] h-[48px] max-w-[250px] overflow-hidden mx-auto hover:bg-transparent border-2 border-pumpkin transition-all mt-5">
      <button
        className={`capitalize w-full h-full bg-transparent border-0 hover:text-pumpkin ${textColor}`}
      >
        {label}
      </button>
    </div>
  );
};

export default AuthButtons;
