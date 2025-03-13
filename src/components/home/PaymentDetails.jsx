"use client";
import React, { useState, useEffect, useContext } from "react";
import PrimaryInput from "../shared-components/inputs/PrimaryInput";
import PrimarySelect from "../shared-components/inputs/PrimarySelect";
import PaymentButtons from "../shared-components/buttons/PaymentButtons";
import { PaymentRequest } from "@/context/PaymentRequestDetails";
import { AxiosGet } from "../../services/http-service";
import { toast } from "react-toastify";

const PaymentDetails = ({
  showNextComponent,
  showPreviousComponent,
  paymentRequestDetails,
}) => {
  const { setPaymentRequestDetails } = useContext(PaymentRequest);

  const [paymentDetailsObject, setPaymentDetailsObject] = useState({});
  const [taxTypes, setTaxTypes] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [selectedTaxType, setSelectedTaxType] = useState(null);

  const getTaxTypes = async () => {
    const apiResponse = await AxiosGet(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/TaxTypes/GetAllTaxTypes`
    );

    const taxTypeObjects = apiResponse.data;
    const { Data } = taxTypeObjects;
    Data.map(
      (taxType) => (taxType.name = taxType.Agency + taxType.description)
    );
    Data.map((taxType) => (taxType.id = taxType.taxtypeId));

    setTaxTypes(Data);
  };

  //select an agency and then use agency Id to select tax
  const handleSelectAgency = (e) => {
    setSelectedTaxType(e.target.value);
    setPaymentRequestDetails((previousValue) => ({
      ...previousValue,
      taxAgency: e.target.value,
    }));
  };

  const handleSelectTaxType = (e) => {
    setSelectedTaxType(e.target.value);
    setPaymentRequestDetails((previousValue) => ({
      ...previousValue,
      taxType: e.target.value,
    }));
  };

  const getAgencies = async () => {
    const apiResponse = await AxiosGet(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/Agencies/GetAllAgencies`
    );
    if (!apiResponse) {
      toast.error("Could not fetch Agencies");
    }
    const agencies = apiResponse.data.Data;
    agencies.map((agency) => (agency.name = agency.description));
    agencies.map((agency) => (agency.id = agency.agencyCode));
    setAgencies(agencies);
  };

  const updatePaymentDetailsObject = (e) => {
    const name = e.target.name;
    setPaymentDetailsObject((previousValue) => ({
      ...previousValue,
      [name]: e.target.value,
    }));

    setPaymentRequestDetails((previousValue) => ({
      ...previousValue,
      [name]: e.target.value,
    }));
  };

  useEffect(() => {
    getAgencies();
    getTaxTypes();
  }, []);

  return (
    <div className="w-full sm:max-w-[450px] sm:mx-auto md:mx-0 md:ml-auto py-8 px-10 rounded-[28px] bg-[rgba(255,255,255,0.7)] mt-16 md:mt-24">
      <h3
        className={`font-bold sm:text-3xl capitalize text-center text-2xl text-white `}
      >
        Payment Details
      </h3>
      <div className="w-full my-5 ">
        {/* remove for now */}
        {/* <PrimaryInput
          label="Payment Ref Number (PRN)"
          placeholder="Enter PRN"
          name="prn"
          type="text"
          labelStyle="capitalize"
          //   handleChange={updateRegistrationDetails}
        /> */}
        <PrimarySelect
          label="Agency"
          placeholder="Select agency"
          name="agency"
          labelStyle="capitalize"
          optionData={
            agencies &&
            agencies?.map((option) => (
              <option key={option.id} value={option.id} className="text-black">
                {option.name}
              </option>
            ))
          }
          handleChange={handleSelectAgency}
        />
        <PrimarySelect
          label="Tax Type"
          placeholder="Select tax type"
          name="taxType"
          labelStyle="capitalize"
          handleChange={handleSelectTaxType}
          optionData={
            taxTypes &&
            taxTypes?.map((option) => (
              <option key={option.id} value={option.id} className="text-black">
                {option.name}
              </option>
            ))
          }
        />
        <PrimaryInput
          label="amount"
          placeholder="Enter amount"
          name="amount"
          type="text"
          labelStyle="capitalize"
          handleChange={updatePaymentDetailsObject}
          value={paymentRequestDetails?.amount ?? ""}
        />
        <PrimaryInput
          label="payer name"
          placeholder="Enter payer name"
          name="payerName"
          type="text"
          labelStyle="capitalize"
          handleChange={updatePaymentDetailsObject}
          value={paymentRequestDetails?.payerName ?? ""}
        />
        <PrimaryInput
          label="payer phone"
          placeholder="Enter payer phone"
          name="payerPhone"
          type="text"
          labelStyle="capitalize"
          handleChange={updatePaymentDetailsObject}
          value={paymentRequestDetails.payerPhone ?? ""}
        />
        <PrimaryInput
          label="payer email"
          placeholder="Enter payer email"
          name="payerEmail"
          type="email"
          labelStyle="capitalize"
          handleChange={updatePaymentDetailsObject}
          value={paymentRequestDetails.payerEmail ?? ""}
        />
        <PrimaryInput
          label="address"
          placeholder="Enter address"
          name="address"
          type="text"
          labelStyle="capitalize"
          handleChange={updatePaymentDetailsObject}
          value={paymentRequestDetails.address ?? ""}
        />
        <div className="w-full flex justify-between gap-4 items-center">
          <PaymentButtons label="Back" onClick={showPreviousComponent} />
          <PaymentButtons onClick={showNextComponent} />
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
