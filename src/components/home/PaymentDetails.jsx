import React, { useState } from "react";
import PrimaryInput from "../shared-components/inputs/PrimaryInput";
import PrimarySelect from "../shared-components/inputs/PrimarySelect";
import PaymentButtons from "../shared-components/buttons/PaymentButtons";

const PaymentDetails = ({
  showNextComponent,
  showPreviousComponent,
  paymentDetails,
}) => {
  const [paymentDetailsObject, setPaymentDetailsObject] = useState({});

  const updatePaymentDetailsObject = (e) => {
    const name = e.target.name;
    setPaymentDetailsObject((previousValue) => ({
      ...previousValue,
      [name]: e.target.value,
    }));

    paymentDetails(paymentDetailsObject);
  };

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
        />
        <PrimarySelect
          label="Tax Type"
          placeholder="Select tax type"
          name="taxType"
          labelStyle="capitalize"
        />
        <PrimaryInput
          label="amount"
          placeholder="Enter amount"
          name="amount"
          type="text"
          labelStyle="capitalize"
          handleChange={updatePaymentDetailsObject}
        />
        <PrimaryInput
          label="payer name"
          placeholder="Enter payer name"
          name="payerName"
          type="text"
          labelStyle="capitalize"
          handleChange={updatePaymentDetailsObject}
        />
        <PrimaryInput
          label="payer phone"
          placeholder="Enter payer phone"
          name="payerPhone"
          type="text"
          labelStyle="capitalize"
          handleChange={updatePaymentDetailsObject}
        />
        <PrimaryInput
          label="payer email"
          placeholder="Enter payer email"
          name="payerEmail"
          type="email"
          labelStyle="capitalize"
          handleChange={updatePaymentDetailsObject}
        />
        <PrimaryInput
          label="address"
          placeholder="Enter address"
          name="address"
          type="text"
          labelStyle="capitalize"
          handleChange={updatePaymentDetailsObject}
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
