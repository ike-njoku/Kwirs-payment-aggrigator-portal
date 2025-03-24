"use client";
import React, { useState } from "react";
import AuthButtons from "../shared-components/buttons/AuthButtons";
import HomeRadio from "../shared-components/inputs/HomeRadio";
import PrimaryInput from "../shared-components/inputs/PrimaryInput";
import useFetchInvoiceData from "@/utils/fetchInvoiceData";


const AssessmentNumberComponent = ({
  showNextComponent,
  paymentAssessmentNumberment,
  paymentRequestDetails,
  setPaymentPRN,
  paymentPRN,
  handleShowInvoice,
}) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [assessmentNumber, setAssessmentNumber] = useState("");
  const { fetchInvoiceData, loading } = useFetchInvoiceData();

   const handleSubmit = async (e) => {
     e.preventDefault();
     if (selectedOption === "payWithPRN") {
       await fetchInvoiceData(paymentPRN); // Fetch invoice first
       handleShowInvoice(e); // Then show invoice (handled by parent)
     } else {
       showNextComponent(e);
     }
   };


  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleChangeassessmentNumber = (e) => {
    setAssessmentNumber(e.target.value);
    paymentAssessmentNumberment(e.target.value);
  };

  const handleChangePRN = (e) => {
    setPaymentPRN(e.target.value); // Update PRN in context
  };

  return (
    <div className="w-full sm:max-w-[450px] sm:mx-auto md:mx-0 md:ml-auto py-8 px-10 rounded-[28px] bg-[rgba(255,255,255,0.7)] mt-16 md:mt-26">
      <h3 className="font-bold text-3xl capitalize text-center text-white">
        Select Payment Option
      </h3>
      <form className="w-full my-6" onSubmit={handleSubmit}>
        {" "}
        <HomeRadio
          label="Pay with Assessment Number"
          value="payWithNumber"
          onChange={handleOptionChange}
          checkedValue={selectedOption}
        />
        {selectedOption === "payWithNumber" && (
          <PrimaryInput
            placeholder="Enter assessment number"
            type="text"
            handleChange={handleChangeassessmentNumber}
            value={paymentRequestDetails.paymentAssessmentNumber}
          />
        )}
        <HomeRadio
          label="Pay without Assessment Number"
          value="payWithoutNumber"
          onChange={handleOptionChange}
          checkedValue={selectedOption}
        />
        <HomeRadio
          label="Pay with PRN"
          value="payWithPRN"
          onChange={handleOptionChange}
          checkedValue={selectedOption}
        />
        {selectedOption === "payWithPRN" && (
          <PrimaryInput
            placeholder="Enter PRN"
            type="text"
            handleChange={handleChangePRN}
            value={paymentPRN} // Bind value from context
          />
        )}
        {loading && <p className="text-white">Fetching invoice...</p>}{" "}
        {/* ✅ Show loading state */}
        {paymentPRN}
        6446-2223-9604
        <AuthButtons
          label="Continue"
          isDisabled={false}
          textColor="text-white"
        />
      </form>
    </div>
  );
};

export default AssessmentNumberComponent;
