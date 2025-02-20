import React from "react";
import PrimaryInput from "../shared-components/inputs/PrimaryInput";
import PrimarySelect from "../shared-components/inputs/PrimarySelect";
import PaymentButtons from "../shared-components/buttons/PaymentButtons";

const TaxPayerDetails = ({ showNextComponent, showPreviousComponent }) => {
  return (
    <div className="w-full sm:max-w-[450px] sm:mx-auto md:mx-0 md:ml-auto py-8 px-10 rounded-[28px] bg-[rgba(255,255,255,0.7)] mt-16 md:mt-24">
      <h3
        className={`font-bold sm:text-3xl capitalize text-center text-2xl text-white `}
      >
        Tax Payer Details
      </h3>
      <div className="w-full my-5 max-h-[350px] overflow-y-auto customScroll">
        <PrimaryInput
          label="TIN"
          placeholder="Enter TIIN"
          name="taxIdentificationNumber"
          type="text"
          labelStyle="capitalize"
          //   handleChange={updateRegistrationDetails}
        />

        <PrimaryInput
          label="Fullname"
          placeholder="Enter fullname"
          name="fullName"
          type="text"
          labelStyle="capitalize"
          //   handleChange={updateRegistrationDetails}
        />
        <PrimaryInput
          label="phone number"
          placeholder="Enter phone number"
          name="phoneNumber"
          type="text"
          labelStyle="capitalize"
          //   handleChange={updateRegistrationDetails}
        />

        <PrimaryInput
          label="email"
          placeholder="Enter email"
          name="taxPayerEmail"
          type="email"
          labelStyle="capitalize"
          //   handleChange={updateRegistrationDetails}
        />

        <div className="w-full flex justify-between gap-4 items-center">
          <PaymentButtons label="Back" onClick={showPreviousComponent} />
          <PaymentButtons onClick={showNextComponent} />
        </div>
      </div>
    </div>
  );
};

export default TaxPayerDetails;
