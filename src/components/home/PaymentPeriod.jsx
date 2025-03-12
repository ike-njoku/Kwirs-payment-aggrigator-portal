"use client";
import React, { useState } from "react";
import PrimarySelect from "../shared-components/inputs/PrimarySelect";
import PrimaryInput from "../shared-components/inputs/PrimaryInput";
import PaymentPeriodTable from "../shared-components/table/PaymentPeriodTable";
import PaymentButtons from "../shared-components/buttons/PaymentButtons";
import { selectInputMonths } from "@/utils/functions";
import { toast } from "react-toastify";

const PaymentPeriod = ({ showNextComponent, showPreviousComponent }) => {
  const [tableDetails, setTableDetails] = useState({
    year: "",
    amount: "",
    month: "",
  });
  const [tableData, setTableData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const paymentDetails =
    JSON.parse(localStorage.getItem("paymentDetails")) || [];

  console.log({ paymentDetails });

  const handleAddItemToTable = () => {
    const period = `${
      Number(tableDetails.month) + 1 < 10
        ? `0${Number(tableDetails.month) + 1}`
        : Number(tableDetails.month) + 1
    }/${tableDetails.year.slice(2)}`;

    const newData = {
      period,
      amount: tableDetails.amount,
    };

    const sum = Number(tableDetails.amount) + totalAmount;
    if (paymentDetails && sum > Number(paymentDetails?.amount)) {
      toast.error(
        `Total amount cannot be greater than ${paymentDetails?.amount}`
      );
      return;
    }
    setTableData((prev) => [...prev, newData]);
    setTotalAmount((prevAmount) => prevAmount + Number(tableDetails.amount));

    setTableDetails({
      year: "",
      amount: "",
      month: "",
    });
  };
  const startYear = 1980;
  const currentYear = new Date().getFullYear();

  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, index) => startYear + index
  ).reverse();

  const handleOnchange = (e) => {
    const name = e.target.name;
    setTableDetails((prev) => ({ ...prev, [name]: e.target.value }));
  };

  const createPaymentInvoice = () => {};

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
            optionData={selectInputMonths.map((period, i) => (
              <option value={period.value} className="text-black" key={i}>
                {period.month}
              </option>
            ))}
            handleChange={handleOnchange}
            value={tableDetails.month}
            name="month"
          />
          <PrimarySelect
            labelStyle="capitalize"
            placeholder="Select year"
            label="year"
            optionData={years.map((year, i) => (
              <option value={year} className="text-black" key={i}>
                {year}
              </option>
            ))}
            handleChange={handleOnchange}
            value={tableDetails.year}
            name="year"
          />
          <PrimaryInput
            labelStyle="capitalize"
            label="amount"
            placeholder="Enter amount"
            value={tableDetails.amount}
            handleChange={handleOnchange}
            name="amount"
          />
        </div>

        <div
          className={` w-full rounded-lg h-[48px] max-w-[150px] overflow-hidden ml-auto hover:bg-transparent border-2 border-pumpkin transition-all mt-5 bg-pumpkin`}
        >
          <button
            className={`capitalize w-full h-full bg-transparent border-0 hover:text-pumpkin disabled:bg-[rgba(255,117,24,0.4)] text-white `}
            onClick={handleAddItemToTable}
          >
            Add
          </button>
        </div>

        <PaymentPeriodTable tableData={tableData} />

        <div className="flex justify-end items-center mt-5">
          <h3 className="text-white font-semibold">
            {" "}
            Total Amount: {totalAmount}
          </h3>
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
