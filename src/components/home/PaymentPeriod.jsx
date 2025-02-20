import React from "react";
import PrimarySelect from "../shared-components/inputs/PrimarySelect";
import PrimaryInput from "../shared-components/inputs/PrimaryInput";
import PaymentPeriodTable from "../shared-components/table/PaymentPeriodTable";
import PaymentButtons from "../shared-components/buttons/PaymentButtons";

const PaymentPeriod = ({ showNextComponent, showPreviousComponent }) => {
  return (
    <section className="w-full md:max-w-[700px] sm:mx-auto md:mx-0 md:ml-auto pt-8 pb-5 px-8 md:px-10 rounded-[28px] border border-pumpkin mt-10">
      <h3
        className={`font-bold sm:text-3xl capitalize text-center text-2xl text-white `}
      >
        Payment Period
      </h3>

      <div className="w-full mt-6 mb-5">
        <div className="flex flex-col sm:flex-row items-center justify-between  sm:gap-4">
          <PrimarySelect
            labelStyle="capitalize"
            placeholder="Select month"
            label="month"
          />
          <PrimarySelect
            labelStyle="capitalize"
            placeholder="Select year"
            label="year"
          />
          <PrimaryInput
            labelStyle="capitalize"
            label="amount"
            placeholder="Enter amount"
          />
        </div>

        <div
          className={` w-full rounded-lg h-[48px] max-w-[150px] overflow-hidden ml-auto hover:bg-transparent border-2 border-pumpkin transition-all mt-5 bg-pumpkin`}
        >
          <button
            className={`capitalize w-full h-full bg-transparent border-0 hover:text-pumpkin disabled:bg-[rgba(255,117,24,0.4)] text-white `}
          >
            Add
          </button>
        </div>

        <PaymentPeriodTable />

        <div className="flex justify-end items-center mt-5">
          <h3 className="text-white font-semibold"> Total Amount: 0</h3>
        </div>

        <div className="w-full flex justify-between gap-4 items-center mt-6">
          <PaymentButtons label="Back" onClick={showPreviousComponent} />
          <PaymentButtons onClick={showNextComponent} />
        </div>
      </div>
    </section>
  );
};

export default PaymentPeriod;
