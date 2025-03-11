import React, { useState } from "react";
import PrimaryInput from "../shared-components/inputs/PrimaryInput";
import PrimarySelect from "../shared-components/inputs/PrimarySelect";
import PaymentButtons from "../shared-components/buttons/PaymentButtons";
import { AxiosGet } from "../../services/http-service";
import { toast } from "react-toastify";

const TaxPayerDetails = ({ showNextComponent, showPreviousComponent }) => {
  const [taxIdentificationNumber, setTaxIdentificationNumber] = useState("");
  const [tinIsValid, setTinIsValid] = useState(false);

  const validateTin = async (tin) => {
    const url = `https://fcttaxportal.fctirs.gov.ng/api/etranzact/validation/${tin}/some-value`;

    const apiResponse = await AxiosGet(url);
    if (!apiResponse) {
      toast.error("Could not validate your Tax Identification Number");
    }
  };

  const updateTin = (e) => {
    setTaxIdentificationNumber(e.target.value);
    if (taxIdentificationNumber && taxIdentificationNumber.length >= 10) {
      validateTin(e.target.value);
    }
  };

  return (
    <div className="w-full sm:max-w-[450px] sm:mx-auto md:mx-0 md:ml-auto py-8 px-10 rounded-[28px] bg-[rgba(255,255,255,0.7)] mt-16 md:mt-24">
      <h3
        className={`font-bold sm:text-3xl capitalize text-center text-2xl text-white `}
      >
        Tax Payer Details
      </h3>
      <div className="w-full my-5  customScroll">
        <PrimaryInput
          label="TIN"
          placeholder="Enter TIIN"
          name="taxIdentificationNumber"
          type="text"
          labelStyle="capitalize"
          handleChange={updateTin}
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
