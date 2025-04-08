import React, { useEffect } from "react";

function RRR() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://demo.remita.net/payment/v1/remita-pay-inline.bundle.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const makePayment = () => {
    const form = document.querySelector("#payment-form");

    if (!window.RmPaymentEngine) {
      console.error("Payment engine not loaded yet.");
      return;
    }

    const paymentEngine = window.RmPaymentEngine.init({
      key: "QzAwMDAyNzEyNTl8MTEwNjE4NjF8OWZjOWYwNmMyZDk3MDRhYWM3YThiOThlNTNjZTE3ZjYxOTY5NDdmZWE1YzU3NDc0ZjE2ZDZjNTg1YWYxNWY3NWM4ZjMzNzZhNjNhZWZlOWQwNmJhNTFkMjIxYTRiMjYzZDkzNGQ3NTUxNDIxYWNlOGY4ZWEyODY3ZjlhNGUwYTY=",
      processRrr: true,
      transactionId: Math.floor(Math.random() * 1101233),
      extendedData: {
        customFields: [
          {
            name: "rrr",
            value: form.querySelector('input[name="rrr"]').value,
          },
        ],
      },
      onSuccess: function (response) {
        console.log("callback Successful Response", response);
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "https://remita.net/");
        xhr.send();
      },
      onError: function (response) {
        console.log("callback Error Response", response);
      },
      onClose: function () {
        console.log("closed");
      },
    });

    paymentEngine.showPaymentWidget();
  };

  return (
    <div className="w-full flex flex-col items-center justify-center mt-4 bg-white p-4 rounded-lg shadow-md"> 
      <form
        onSubmit={(e) => {
          e.preventDefault();
          makePayment();
        }}
        id="payment-form"
      >
        <div className="form-floating mb-3 mt-3">
          <input
            type="text"
            className="form-control"
            id="js-rrr"
            name="rrr"
            placeholder="Enter RRR"
          />
          <label htmlFor="rrr">Enter RRR</label>
        </div>
        <p>
          <strong>Note:</strong> To generate an RRR to use on this page,
        </p>
        <ul>
          <li>
            <a
              href="https://api.remita.net/#ed5722a2-4bf3-40a0-99c5-37f94cb94a55"
              target="_blank"
              rel="noopener noreferrer"
            >
              Click here
            </a>{" "}
            to utilize our Invoice Generation API, or
          </li>
          <li>
            <a
              href="https://demo.remita.net/remita/onepage/QATEST/biller.spa"
              target="_blank"
              rel="noopener noreferrer"
            >
              Click here
            </a>{" "}
            to generate a Bill and go to the 'Bank Branch' Payment option to get
            the RRR
          </li>
        </ul>
        <button type="submit" className="button">
          Submit
        </button>
      </form>
    </div>
  );
}

export default RRR;
