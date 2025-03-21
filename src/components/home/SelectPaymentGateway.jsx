"use client";
import React, { useState, useEffect } from "react";
import GatewayRadio from "../shared-components/inputs/GatewayRadio";
import icadpay from "../../../public/images/icad-logo.png";
import remita from "../../../public/images/remita.png";
import interswitch from "../../../public/images/interswitch.png";
import etranzact from "../../../public/images/etranzact.jpg";
import flutterWave from "../../../public/images/Flutterwave-Logo.jpg";
import { sha512, sha384, sha512_256, sha512_224 } from "js-sha512";

import PaymentButtons from "../shared-components/buttons/PaymentButtons";
import PayWithFlutterWave from "../../utils/flutterwavePayment";
import IcadPayModal from "./IcadPayModal";

const SelectPaymentGateway = ({ showPreviousComponent }) => {
  const [selectedOption, setSelectedOption] = useState("nil");
  const [showModal, setShowModal] = useState(false);

  const [invoiceData, setInvoiceData] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        // getting the PRN number form the Local storage
        const storedData = localStorage.getItem("paymentDetails");
        console.log("Stored Data:", storedData); // Debugging

        if (!storedData) {
          console.error("No payment details found in localStorage");
          return;
        }

        const parsedData = JSON.parse(storedData);

        if (!parsedData.invoice || !parsedData.invoice.PRN) {
          console.error("Invalid payment details structure");
          return;
        }

        const prnNumber = parsedData.invoice.PRN; // Extract PRN dynamically

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/invoice/GetSingleInvoice/${prnNumber}`
        );

        const result = await response.json();

        if (result.StatusCode === 200 && result.Data.length > 0) {
          setInvoiceData(result.Data[0]); // Store the first invoice object
          console.log("Invoice Data:", result.Data[0]); // Debugging
        } else {
          console.error("Invoice not found");
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
      }
    };

    fetchInvoice();
  }, []);

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

  // internswitch
  const handleInterswitchPayment = async () => {
    if (!invoiceData) {
      console.error("Invoice data not found");
      return;
    }

    try {
      const paymentPayload = {
        amount: invoiceData.Amount * 100, // Convert to kobo
        currency: "566", // Naira (NGN) currency code
        customerId: invoiceData.CustomerID,
        transactionRef: invoiceData.PRN, // Use PRN as transaction reference
        redirectUrl: `${window.location.origin}/payment-success`, // Change to your success page
      };

      // Send request to your backend to generate payment request hash
      const response = await fetch(
        "https://sandbox.interswitchng.com/collections/api/v1/gettransaction.json",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentPayload),
        }
      );

      const result = await response.json();

      if (result.paymentUrl) {
        window.location.href = result.paymentUrl; // Redirect user to Interswitch payment page
      } else {
        console.error("Failed to initiate Interswitch payment:", result);
      }
    } catch (error) {
      console.error("Error initiating Interswitch payment:", error);
    }
  };

  const internswitch = {
    product_id: invoiceData.PRN,
    pay_item_id: 222,
    amount: 20000,
    currency: 566,
    site_redirect_url: "/dashboard",
    txn_ref: invoiceData.PRN,
    cust_id: 99999,
    cust_name: "kenny",
    hash: "",
  };

  const harshValues = () => {
    const hash = `${internswitch.product_id}${internswitch.pay_item_id}${internswitch.amount}${internswitch.currency}${internswitch.site_redirect_url}${internswitch.txn_ref}${internswitch.cust_id}${internswitch.cust_name}`;
    return sha512(hash).toUpperCase();
  };
  const me = harshValues();
  console.log("harshing:", me);

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

      {/* <div className="w-full flex justify-between gap-4 items-center mt-6">
        <PaymentButtons label="Back" onClick={showPreviousComponent} />

        {selectedOption === "flutterWave" && (
          <PaymentButtons label="Pay with Flutterwave" onClick={handlePayment} />
        )}

        {selectedOption === "icadpay" && (
          <PaymentButtons label="Pay with IcadPay" onClick={() => setShowModal(true)} />
        )}
      </div> */}
      {/* 
      <div className="w-full flex justify-between gap-4 items-center mt-6">
        <PaymentButtons label="Back" onClick={showPreviousComponent} />

        {selectedOption === "flutterWave" && (
          <>
            <PayWithFlutterWave />
          </>
        )}
      </div> */}

      {/* Render IcadPayModal conditionally */}
      {/* {showModal && <IcadPayModal isOpen={showModal} onClose={closeModal} />
      
    } */}

      <div className="w-full flex justify-between gap-4 items-center mt-6">
        <PaymentButtons label="Back" onClick={showPreviousComponent} />

        {/* Show IcadPay button when selected */}
        {selectedOption === "icadpay" && invoiceData && (
          <PaymentButtons
            label="Pay with IcadPay"
            onClick={() => setShowModal(true)}
          />
        )}

        {/* Show Flutterwave button when selected */}
        {selectedOption === "flutterWave" && <PayWithFlutterWave />}

        {/* Show Interswitch button when selected */}
        {selectedOption === "interswitch" && invoiceData && (
          <PaymentButtons
            label="Pay with Interswitch"
            onClick={handleInterswitchPayment}
          />
        )}
      </div>

      {showModal && (
        <IcadPayModal
          isOpen={showModal}
          onClose={closeModal}
          invoiceData={invoiceData}
        />
      )}
    </section>
  );
};

export default SelectPaymentGateway;
