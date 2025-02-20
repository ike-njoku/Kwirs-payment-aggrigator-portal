"use client";
import React, { useState } from "react";
import AuthButtons from "../shared-components/buttons/AuthButtons";
import HomeRadio from "../shared-components/inputs/HomeRadio";
import PrimaryInput from "../shared-components/inputs/PrimaryInput";

const AssessmentNumberComponent = ({ showNextComponent }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [assessmentNumber, setAssessmentNumber] = useState("");
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleChangeassessmentNumber = (e) => {
    setAssessmentNumber(e.target.value);
  };
  return (
    <div className="w-full sm:max-w-[450px] sm:mx-auto md:mx-0 md:ml-auto py-8 px-10 rounded-[28px] bg-[rgba(255,255,255,0.7)] mt-16 md:mt-24 xl:mt-40">
      <h3 className="font-bold text-3xl capitalize text-center text-white">
        Select Payment Option
      </h3>
      <form className="w-full my-6" onSubmit={showNextComponent}>
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
            value={assessmentNumber}
          />
        )}

        <HomeRadio
          label="Pay without Assessment Number"
          value="payWithoutNumber"
          onChange={handleOptionChange}
          checkedValue={selectedOption}
        />
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
