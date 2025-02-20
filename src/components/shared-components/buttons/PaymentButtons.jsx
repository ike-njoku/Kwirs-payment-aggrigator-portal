import React from "react";

const PaymentButtons = ({ label = "Next", onClick }) => {
  return (
    <div className={` overflow-hidden bg-transparent transition-all mt-5`}>
      <button
        className={`capitalize bg-transparent border-0 text-pumpkin text-lg font-semibold`}
        onClick={onClick}
        type="button"
      >
        {label}
      </button>
    </div>
  );
};

export default PaymentButtons;
