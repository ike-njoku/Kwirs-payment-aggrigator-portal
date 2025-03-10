"use client";
import React, { useState } from "react";
import GatewayRadio from "../shared-components/inputs/GatewayRadio";
import visa from "../../../public/images/icad-logo.png";
import remita from "../../../public/images/remita.png";
import interswitch from "../../../public/images/interswitch.png";
import etranzact from "../../../public/images/etranzact.jpg";
import flutterWave from "../../../public/images/Flutterwave-Logo.jpg";
import PaymentButtons from "../shared-components/buttons/PaymentButtons";
import { initiateFlutterwavePayment } from "../../utils/flutterwavePayment"; // Import Flutterwave function

const SelectPaymentGateway = ({ showPreviousComponent }) => {
  const [selectedOption, setSelectedOption] = useState("nil");

  const handleSelectGateway = (e) => {
    const { value } = e.target;
    setSelectedOption(value);
  };

  const paymentGateways = [
    { name: "visa", img: visa },
    { name: "remita", img: remita },
    { name: "interswitch", img: interswitch },
    { name: "etranzact", img: etranzact },
    { name: "flutterWave", img: flutterWave },
  ];


  // const publicKey = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY;
  const publicKey = "FLWPUBK_TEST-1c4502bfb6f511ca669c5246ffec899a-X";  // for now, replace with actual public key from .env later

  const handlePayment = () => {
    initiateFlutterwavePayment({
      publicKey,
      email: "user@example.com", // Replace with actual email
      phoneNumber: "08012345678", // Replace with actual phone number
      firstName: "John", // Replace with actual first name
      lastName: "Doe", // Replace with actual last name
      setPaymentResponse: (ref) => console.log("Payment Ref:", ref),
      submitPaymentInfo: (info) => console.log("Payment Info:", info),
      // setPaymentDenied: (status) => console.log("Payment Denied:", status),
      setCanceledPay: (status) => console.log("Payment Canceled:", status),
    });
  };

  return (
    <section className="w-full md:max-w-[450px] sm:mx-auto md:mx-0 md:ml-auto pt-8 pb-5 px-8 md:px-10 rounded-[28px] border border-pumpkin mt-10">
      <h3 className="font-bold sm:text-3xl capitalize text-center text-2xl text-white">
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

      <div className="w-full flex justify-between gap-4 items-center mt-6">
        <PaymentButtons label="Back" onClick={showPreviousComponent} />
        {selectedOption === "flutterWave" && (
          <PaymentButtons
            label="Pay with Flutterwave"
            onClick={handlePayment}
          />
        )}
      </div>
    </section>
  );
};

export default SelectPaymentGateway;
