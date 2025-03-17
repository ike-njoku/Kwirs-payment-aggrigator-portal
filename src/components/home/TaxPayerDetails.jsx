import React, { useState, useContext } from "react";
import PrimaryInput from "../shared-components/inputs/PrimaryInput";
import PaymentButtons from "../shared-components/buttons/PaymentButtons";
import { AxiosPost } from "../../services/http-service";
import Spinner from "../shared-components/Spinner";
import { toast } from "react-toastify";

const TaxPayerDetails = ({
  showNextComponent,
  showPreviousComponent,
  handleSetTaxPayerDetails,
}) => {
  const [tinDetails, setTinDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateTin = async (tin) => {
    setIsLoading(true);
    const requestBody = { TIN: tin, dob: "", bvn: "" };
    const validationURL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/utility/Tin2`;
    const _taxIDValidationResponse = await AxiosPost(
      validationURL,
      requestBody
    );

    const taxDetails = JSON.parse(_taxIDValidationResponse);
    handleSetTaxPayerDetails(taxDetails);
    setTinDetails(taxDetails);

    if (taxDetails && taxDetails?.status == "Not Found") {
      toast.error("Could not validate your Tin");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  };

  const updateTin = (e) => {
    const tin = e.target.value;
    if (tin.length < 10) return;
    validateTin(tin);
    return;
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
          placeholder="Enter TIN"
          name="taxIdentificationNumber"
          type="text"
          labelStyle="capitalize"
          handleChange={updateTin}
        />

        {isLoading && <Spinner></Spinner>}
        {tinDetails &&
          Object.keys(tinDetails).length > 0 &&
          tinDetails?.status !== "Not Found" && (
            <PrimaryInput
              label="Fullname"
              placeholder="Enter fullname"
              name="fullName"
              type="text"
              disabled={true}
              labelStyle="capitalize"
              value={tinDetails?.firstname ?? "" + tinDetails?.lastname ?? ""}
            />
          )}

        {tinDetails &&
          Object.keys(tinDetails).length > 0 &&
          tinDetails?.status !== "Not Found" && (
            <PrimaryInput
              label="email"
              placeholder="Enter email"
              name="taxPayerEmail"
              type="email"
              labelStyle="capitalize"
              disabled={true}
              readOnly={true}
              value={tinDetails?.email}
            />
          )}
        <div className="w-full flex justify-between gap-4 items-center">
          <PaymentButtons label="Back" onClick={showPreviousComponent} />
          {tinDetails &&
            Object.keys(tinDetails).length > 0 &&
            tinDetails?.status !== "Not Found" && (
              <PaymentButtons onClick={showNextComponent} />
            )}
        </div>
      </div>
    </div>
  );
};

export default TaxPayerDetails;
