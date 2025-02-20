"use client";
import React, { useState } from "react";
import GatewayRadio from "../shared-components/inputs/GatewayRadio";
import visa from "../../../public/images/visa-logo.png";
import stripe from "../../../public/images/stripe2.webp";
import paystack from "../../../public/images/paystack-logo.png";
import remita from "../../../public/images/remita.png";

const SelectPaymentGateway = ({ showPreviousComponent }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [paymentGateway, setPaymentGateway] = useState({
    visa: "",
    stripe: "",
    paystack: "",
    remita: "",
  });

  const handleSelectGateway = (e) => {
    const { name, value } = e.target;
    setSelectedOption(e.target.value);
    setPaymentGateway({ ...paymentGateway, [name]: value });
  };
  return (
    <section className="w-full md:max-w-[450px] sm:mx-auto md:mx-0 md:ml-auto pt-8 pb-5 px-8 md:px-10 rounded-[28px] border border-pumpkin mt-10">
      <h3
        className={`font-bold sm:text-3xl capitalize text-center text-2xl text-white `}
      >
        Select Payment Gateway
      </h3>

      <GatewayRadio
        img={visa}
        checkedValue={selectedOption}
        name="visa"
        onChange={handleSelectGateway}
        value={paymentGateway.visa}
      />
      <GatewayRadio
        img={stripe}
        checkedValue={selectedOption}
        name="stripe"
        onChange={handleSelectGateway}
        value={paymentGateway.stripe}
      />
    </section>
  );
};

export default SelectPaymentGateway;
