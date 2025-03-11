"use client";
import React, { useState } from "react";
import HomeNavigation from "../navigation";
import AssessmentNumberComponent from "./AssessmentNumberComponent";
import PaymentDetails from "./PaymentDetails";
import PaymentPeriod from "./PaymentPeriod";
import TaxPayerDetails from "./TaxPayerDetails";
import Invoice from "./Invoice";
import SelectPaymentGateway from "./SelectPaymentGateway";

const HomePage = () => {
  const [nextComponent, showNextComponent] = useState(0);
  const [paymentRequestDetails, setPaymentRequestDetails] = useState({});

  const handleSetPaymentAssessmentNumber = (paymentNumber) => {
    paymentRequestDetails.paymentAssessmentNumber = paymentNumber;
    setPaymentRequestDetails({ ...paymentRequestDetails });
    localStorage.setItem(
      "paymentDetails",
      JSON.stringify(paymentRequestDetails)
    );
  };

  console.log(
    "PAYMENT REQUEST DETAILS ----------->>>> ",
    paymentRequestDetails
  );

  const handleSetPaymtDetails = (paymentDetailsObject) => {
    setPaymentRequestDetails({
      ...paymentRequestDetails,
      ...paymentDetailsObject,
    });
  };

  const handleShowPayerDetails = (e) => {
    e.preventDefault();
    showNextComponent(1);
  };

  const handleShowPaymentPeriod = (e) => {
    e.preventDefault();
    showNextComponent(2);
  };
  const handleShowTaxPayerDetails = (e) => {
    e.preventDefault();
    showNextComponent(3);
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

          <div className="lg:grid lg:grid-cols-2 justify-between items-center gap-8 w-full">
            <div className="max-w-[600px] w-full hidden lg:flex flex-col justify-between text-white">
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

            <div className="w-full my-10 max-h-[600px] overflow-y-auto customScroll">
              {nextComponent === 0 && (
                <AssessmentNumberComponent
                  paymentAssessmentNumberment={handleSetPaymentAssessmentNumber}
                  showNextComponent={handleShowPayerDetails}
                />
              )}
              {/* 
              
              - accessNumber  
              - paymentDetails
              - paymentPeriod
              - taxPayerDetails
              - invoice
              */}

              {nextComponent === 1 && (
                <PaymentDetails
                  showNextComponent={handleShowPaymentPeriod}
                  showPreviousComponent={() => showNextComponent(0)}
                  paymentDetails={handleSetPaymtDetails}
                />
              )}

              {nextComponent === 2 && (
                <PaymentPeriod
                  showPreviousComponent={() => showNextComponent(1)}
                  showNextComponent={handleShowTaxPayerDetails}
                />
              )}

              {nextComponent === 3 && (
                <TaxPayerDetails
                  showPreviousComponent={() => showNextComponent(2)}
                  showNextComponent={handleShowInvoice}
                />
              )}
              {nextComponent === 4 && (
                <Invoice
                  showNextComponent={handleShowPaymentGateway}
                  showPreviousComponent={() => showNextComponent(3)}
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
