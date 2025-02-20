"use client";
import React, { useState } from "react";
import GatewayRadio from "../shared-components/inputs/GatewayRadio";
import visa from "../../../public/images/visa-logo.png";
import remita from "../../../public/images/remita.png";
import interswitch from "../../../public/images/interswitch.png";
import etranzact from "../../../public/images/etranzact.jpg";
import flutterWave from "../../../public/images/Flutterwave-Logo.jpg";
import PaymentButtons from "../shared-components/buttons/PaymentButtons";

const SelectPaymentGateway = ({ showPreviousComponent }) => {
  const [selectedOption, setSelectedOption] = useState("nil");

  const handleSelectGateway = (e) => {
    const { name, value } = e.target;
    setSelectedOption(value);
  };

  const paymentGateways = [
    {
      name: "visa",
      img: visa,
    },
    {
      name: "remita",
      img: remita,
    },
    {
      name: "interswitch",
      img: interswitch,
    },
    {
      name: "etranzact",
      img: etranzact,
    },
    {
      name: "flutterWave",
      img: flutterWave,
    },
  ];

  return (
    <section className="w-full md:max-w-[450px] sm:mx-auto md:mx-0 md:ml-auto pt-8 pb-5 px-8 md:px-10 rounded-[28px] border border-pumpkin mt-10">
      <h3
        className={`font-bold sm:text-3xl capitalize text-center text-2xl text-white `}
      >
        Select Payment Method
      </h3>

      {paymentGateways.map((item, i) => (
        <GatewayRadio
          img={item.img}
          checkedValue={selectedOption}
          onChange={handleSelectGateway}
          value={item.name}
          key={i}
        />
      ))}

      <div className="w-full md:max-w-[450px] sm:mx-auto md:mx-0 md:ml-auto  flex justify-between gap-4 items-center mt-6">
        <PaymentButtons label="Back" onClick={showPreviousComponent} />
        {/* <PaymentButtons onClick={showNextComponent} /> */}
      </div>
    </section>
  );
};

export default SelectPaymentGateway;
