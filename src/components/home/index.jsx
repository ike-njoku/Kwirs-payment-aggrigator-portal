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
        <div className="w-[90%] mx-auto xl:w-full xl:max-w-[1000px] py-6 min-h-screen">
          <HomeNavigation />

          <div className="w-full my-10">
            {nextComponent === 0 && (
              <AssessmentNumberComponent
                showNextComponent={handleShowPayerDetails}
              />
            )}

            {nextComponent === 1 && (
              <PaymentDetails
                showNextComponent={handleShowPaymentPeriod}
                showPreviousComponent={() => showNextComponent(0)}
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
      </section>
    </main>
  );
};

export default HomePage;
