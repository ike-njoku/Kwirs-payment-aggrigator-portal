"use client";
import React, { useState } from "react";
import GatewayRadio from "../shared-components/inputs/GatewayRadio";
import icadpay from "../../../public/images/icad-logo.png";
import remita from "../../../public/images/remita.png";
import interswitch from "../../../public/images/interswitch.png";
import etranzact from "../../../public/images/etranzact.jpg";
import flutterWave from "../../../public/images/Flutterwave-Logo.jpg";

import PaymentButtons from "../shared-components/buttons/PaymentButtons";
import { initiateFlutterwavePayment } from "../../utils/flutterwavePayment";
import IcadPayModal from "./IcadPayModal";

const SelectPaymentGateway = ({ showPreviousComponent }) => {
  const [selectedOption, setSelectedOption] = useState("nil");
  const [showModal, setShowModal] = useState(false);

  const handleSelectGateway = (e) => {
    setSelectedOption(e.target.value);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const paymentGateways = [
    { name: "icadpay", img: icadpay },
    { name: "remita", img: remita },
    { name: "interswitch", img: interswitch },
    { name: "etranzact", img: etranzact },
    { name: "flutterWave", img: flutterWave },
  ];

  const publicKey = "FLWPUBK_TEST-1c4502bfb6f511ca669c5246ffec899a-X";

  const handlePayment = () => {
    initiateFlutterwavePayment({
      publicKey,
      email: "user@example.com",
      phoneNumber: "08012345678",
      firstName: "John",
      lastName: "Doe",
      setPaymentResponse: (ref) => console.log("Payment Ref:", ref),
      submitPaymentInfo: (info) => console.log("Payment Info:", info),
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
          <PaymentButtons label="Pay with Flutterwave" onClick={handlePayment} />
        )}

        {selectedOption === "icadpay" && (
          <PaymentButtons label="Pay with IcadPay" onClick={() => setShowModal(true)} />
        )}
      </div>
      

      {/* Render IcadPayModal conditionally */}
      {showModal && <IcadPayModal isOpen={showModal} onClose={closeModal} />}
    </section>
  );
};

export default SelectPaymentGateway;
