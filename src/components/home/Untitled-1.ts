// "use client";

// import React, { useState, useEffect } from "react";
// import Script from "next/script";
// import GatewayRadio from "../shared-components/inputs/GatewayRadio";
// import icadpay from "../../../public/images/icad-logo.png";
// import remita from "../../../public/images/remita.png";
// import interswitch from "../../../public/images/interswitch.png";
// import etranzact from "../../../public/images/etranzact.jpg";
// import flutterWave from "../../../public/images/Flutterwave-Logo.jpg";
// import PaymentButtons from "../shared-components/buttons/PaymentButtons";
// import PayWithFlutterWave from "../../utils/flutterwavePayment";
// import IcadPayModal from "./IcadPayModal";

// const SelectPaymentGateway = ({ showPreviousComponent }) => {
//   const [selectedOption, setSelectedOption] = useState("nil");
//   const [showModal, setShowModal] = useState(false);
//   const [invoiceData, setInvoiceData] = useState(null);
//   const [isWebpayLoaded, setIsWebpayLoaded] = useState(false);

//   useEffect(() => {
//     const fetchInvoice = async () => {
//       try {
//         const storedData = localStorage.getItem("paymentDetails");
//         console.log("Stored Data:", storedData); // Debugging
//         if (!storedData) {
//           console.error("No payment details found in localStorage");
//           return;
//         }

//         const parsedData = JSON.parse(storedData);
//         if (!parsedData.invoice || !parsedData.invoice.PRN) {
//           console.error("Invalid payment details structure");
//           return;
//         }

//         const prnNumber = parsedData.invoice.PRN; // Extract PRN dynamically
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_BASE_URL}/api/invoice/GetSingleInvoice/${prnNumber}`
//         );

//         const result = await response.json();

//         if (result.StatusCode === 200 && result.Data.length > 0) {
//           setInvoiceData(result.Data[0]); // Store the first invoice object
//           console.log("Invoice Data:", result.Data[0]); // Debugging
//         } else {
//           console.error("Invoice not found");
//         }
//       } catch (error) {
//         console.error("Error fetching invoice:", error);
//       }
//     };

//     fetchInvoice();
//   }, []);

//   const handleSelectGateway = (e) => {
//     setSelectedOption(e.target.value);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//   };

//   // Interswitch Payment Handler

//   // Ensure script is loaded
//   useEffect(() => {
//     const checkWebpay = setInterval(() => {
//       if (window.webpayCheckout) {
//         console.log("Webpay Checkout SDK is loaded");
//         setIsWebpayLoaded(true);
//         clearInterval(checkWebpay);
//       }
//     }, 1000);
//   }, []);

//   const handleInterswitchPayment = () => {
//     const paymentRequest = {
//       merchant_code: "MX157626",
//       pay_item_id: "101007",
//       pay_item_name: "kennn",
//       cust_email: invoiceData.payerEmail,
//       cust_name: invoiceData.payerName,
//       cust_id: invoiceData.payerEmail,
//       txn_ref: invoiceData.PRN,
//       site_redirect_url: "https://sandbox.interswitchng.com/collections/w/pay",
//       amount: invoiceData.amount ? invoiceData.amount * 100 : 0,
//       currency: 566,
//       onComplete: (response) => {
//         console.log("Payment Response:", response);
//         alert("Payment Status: " + response.response_description);
//       },
//       mode: "TEST",
//     };

//     console.log("Payment Request:", paymentRequest);

//     window.webpayCheckout(paymentRequest);
//   };

//   const paymentGateways = [
//     { name: "icadpay", img: icadpay },
//     { name: "remita", img: remita },
//     { name: "interswitch", img: interswitch },
//     { name: "etranzact", img: etranzact },
//     { name: "flutterWave", img: flutterWave },
//   ];

//   return (
//     <section className="w-full md:max-w-[450px] sm:mx-auto md:mx-0 md:ml-auto pt-8 pb-5 px-8 md:px-10 rounded-[28px] border border-pumpkin mt-10">
//       <h3 className="font-bold sm:text-3xl capitalize text-center text-2xl text-white">
//         Select Payment Method
//       </h3>

//       {paymentGateways.map((item, i) => (
//         <GatewayRadio
//           img={item.img}
//           checkedValue={selectedOption}
//           onChange={handleSelectGateway}
//           value={item.name}
//           key={i}
//         />
//       ))}

//       <div className="w-full flex justify-between gap-4 items-center mt-6">
//         <PaymentButtons label="Back" onClick={showPreviousComponent} />

//         {selectedOption === "icadpay" && invoiceData && (
//           <PaymentButtons
//             label="Pay with IcadPay"
//             onClick={() => setShowModal(true)}
//           />
//         )}

//         {selectedOption === "interswitch" && invoiceData && (
//           <PaymentButtons
//             label="Pay with Interswitch"
//             onClick={handleInterswitchPayment}
//           />
//         )}

//         {selectedOption === "flutterWave" && <PayWithFlutterWave />}
//       </div>

//       {showModal && (
//         <IcadPayModal
//           isOpen={showModal}
//           onClose={closeModal}
//           invoiceData={invoiceData}
//         />
//       )}

//       <Script
//         src="https://newwebpay.interswitchng.com/inline-checkout.js" // This URL should be for production
//         strategy="lazyOnload"
//         onLoad={() => setIsWebpayLoaded(true)}
//       />
//     </section>
//   );
// };

// export default SelectPaymentGateway;
