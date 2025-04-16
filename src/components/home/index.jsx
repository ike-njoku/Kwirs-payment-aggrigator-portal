"use client";
import React, { useContext, useState } from "react";
import HomeNavigation from "../navigation";
import AssessmentNumberComponent from "./AssessmentNumberComponent";
import PaymentDetails from "./PaymentDetails";
import PaymentPeriod from "./PaymentPeriod";
import TaxPayerDetails from "./TaxPayerDetails";
import Invoice from "./Invoice";
import SelectPaymentGateway from "./SelectPaymentGateway";
import { PaymentRequest } from "@/context/PaymentRequestDetails";
import { toast } from "react-toastify";

const HomePage = () => {
  const [nextComponent, showNextComponent] = useState(0);
  const {
    paymentRequestDetails,
    setPaymentRequestDetails,
    paymentPRN,
    setPaymentPRN,
  } = useContext(PaymentRequest);

  const handleSetPaymentAssessmentNumber = (paymentNumber) => {
    paymentRequestDetails.paymentAssessmentNumber = paymentNumber;
    setPaymentRequestDetails({ ...paymentRequestDetails });
  };

  const handleSetTaxPayerDetails = (taxPayerDetails) => {
    setPaymentRequestDetails({ ...paymentRequestDetails, ...taxPayerDetails });
  };

  const handleStoreInvoiceDetails = (invoiceDetails) => {
    setPaymentRequestDetails({
      ...paymentRequestDetails,
      invoice: { ...invoiceDetails },
    });
  };

  const handleShowPayerDetails = (e) => {
    e.preventDefault();
    showNextComponent(1);
  };

  const handleShowPaymentPeriod = (e) => {
    e.preventDefault();
    showNextComponent(3);
  };

  const validatePaymentDetails = () => {
    const {
      address,
      amount,
      payerEmail,
      payerName,
      payerPhone,
      taxAgency,
      taxType,
    } = paymentRequestDetails;

    if (
      address &&
      address.length &&
      amount &&
      amount.length &&
      payerEmail &&
      payerEmail.length &&
      String(payerEmail).match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/) &&
      payerName &&
      payerName.length &&
      payerPhone &&
      payerPhone.length &&
      taxAgency &&
      taxAgency.length &&
      taxType &&
      taxType.length
    ) {
      return true;
    }
    toast.error("Please fill out all compulsory fields");
    return false;
  };
  const handleShowTaxPayerDetails = (e) => {
    if (!validatePaymentDetails()) return false;
    e.preventDefault();
    showNextComponent(2);
  };

  const handleShowInvoice = (e) => {
    e.preventDefault();
    showNextComponent(4);
  };

  const handleShowPaymentGateway = (e) => {
    e.preventDefault();
    showNextComponent(5);
  };

  return (
    <main className="w-full home-bg">
      <section className="w-full min-h-screen bg-[rgba(0,0,0,0.8)]">
        <div className="w-[90%] mx-auto xl:w-full xl:max-w-[1150px] py-6 min-h-screen ">
          <HomeNavigation />

          <div className=" w-full">
            <div className="max-w-[600px] w-full hidden lg:flex flex-col fixed top-1/2 -translate-y-1/2 text-white">
              <article className="w-full">
                <h3 className="text-white font-bold text-5xl">
                  Seamless Payments
                </h3>
                <div className="w-full lg:flex mt-5 hidden gap-1">
                  <p className="text-base italic">
                    With Quantum
                    <span className="text-pumpkin text-base">Gateway.</span>
                  </p>
                </div>
              </article>

              <div className="w-full mt-16">
                <div className="w-full border-[3px] border-pumpkin max-w-[100px]"></div>
                <p className=" text-base leading-normal mt-3">
                  Quick, Secure, and Reliable Tax Payments.
                </p>
              </div>
            </div>

            <div className="w-full my-10 overflow-y-auto customScroll">
              {/* max-h-[600px] overflow-y-auto customScroll */}

              {nextComponent === 0 && (
                <AssessmentNumberComponent
                  paymentAssessmentNumberment={handleSetPaymentAssessmentNumber}
                  showNextComponent={handleShowPayerDetails}
                  paymentRequestDetails={paymentRequestDetails}
                  setPaymentPRN={setPaymentPRN}
                  paymentPRN={paymentPRN}
                  handleShowInvoice={handleShowInvoice}
                />
              )}

              {nextComponent === 1 && (
                <PaymentDetails
                  showNextComponent={handleShowTaxPayerDetails}
                  showPreviousComponent={() => showNextComponent(0)}
                  paymentRequestDetails={paymentRequestDetails}
                />
              )}
              {nextComponent === 2 && (
                <TaxPayerDetails
                  showPreviousComponent={() => showNextComponent(1)}
                  paymentRequestDetails={paymentRequestDetails}
                  showNextComponent={handleShowPaymentPeriod}
                  handleSetTaxPayerDetails={handleSetTaxPayerDetails}
                />
              )}

              {nextComponent === 3 && (
                <PaymentPeriod
                  showPreviousComponent={() => showNextComponent(2)}
                  showNextComponent={handleShowInvoice}
                  handleSetTaxPayerDetails={handleSetTaxPayerDetails}
                  paymentRequestDetails={paymentRequestDetails}
                  storeInvoiceDetails={handleStoreInvoiceDetails}
                />
              )}

              {nextComponent === 4 && (
                <Invoice
                  showNextComponent={handleShowPaymentGateway}
                  showPreviousComponent={() => {
                    showNextComponent(0);
                    setPaymentRequestDetails({});
                    setPaymentPRN("");
                  }}
                  paymentRequestDetails={paymentRequestDetails}
                />
              )}

              {nextComponent === 5 && (
                <SelectPaymentGateway
                  showPreviousComponent={() => showNextComponent(4)}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
