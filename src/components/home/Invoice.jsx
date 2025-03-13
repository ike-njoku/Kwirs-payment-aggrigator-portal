import Image from "next/image";
import React from "react";
import InvoiceTable from "../shared-components/table/InvoiceTable";
import PaymentButtons from "../shared-components/buttons/PaymentButtons";
import { toast } from "react-toastify";

const Invoice = ({
  showPreviousComponent,
  showNextComponent,
  paymentRequestDetails,
}) => {
  console.table(paymentRequestDetails);
  return (
    <section className="w-full md:max-w-[550px] sm:mx-auto md:mx-0 md:ml-auto py-8 px-6 md:px-10 rounded-[28px] border border-pumpkin mt-16 bg-[rgba(255,255,255,0.7)]">
      <article className="w-full flex justify-between items-center">
        <h3
          className={`font-bold capitalize text-center text-2xl text-white md:text-3xl `}
        >
          Invoice
        </h3>
        <figure className="m-0 p-0 ">
          <Image
            src="/images/fctirs-logo.jpeg"
            width={70}
            height={70}
            alt="logo"
            className="object-contain"
          />
        </figure>
      </article>

      <div className="my-4 flex gap-8">
        <article className="flex flex-col justify-between gap-1 text-white max-w-[150px] w-full">
          <h3 className={`font-semibold capitalize text-base  `}>
            Invoice Number
          </h3>
          <p className="m-0 p-0 text-sm font-light">
            {" "}
            {paymentRequestDetails?.invoice.PRN ?? "N/A"}{" "}
          </p>
        </article>
        <article className="flex flex-col justify-between gap-1 text-white max-w-[150px] w-full">
          <h3 className={`font-semibold capitalize text-base  `}>
            Date Issued
          </h3>
          <p className="m-0 p-0 text-sm font-light">
            {new Date(
              paymentRequestDetails?.invoice?.createdDate
            ).toLocaleDateString() ?? ""}
          </p>
        </article>
      </div>
      {/*  */}
      <div className="my-5 flex gap-8">
        <article className="flex flex-col gap-1 text-white max-w-[150px] w-full">
          <h3 className={`font-semibold capitalize text-base  `}>Billed to:</h3>
          <p className="m-0 p-0 text-sm font-light">
            {paymentRequestDetails?.payerName}
          </p>
          <p className="m-0 p-0 text-sm font-light max-w-[">
            {paymentRequestDetails?.invoice?.payerAddress}
          </p>
          <p className="m-0 p-0 text-sm font-light max-w-[">
            TIN: {paymentRequestDetails?.invoice?.TIN ?? "N/A"}{" "}
          </p>
        </article>
        <article className="flex flex-col  gap-1 text-white max-w-[150px] w-full">
          <h3 className={`font-semibold capitalize  text-base  `}>
            contact details:
          </h3>
          <p className="m-0 p-0 text-sm font-light">
            {paymentRequestDetails?.invoice?.payerPhone}
          </p>
          <p className="m-0 p-0 text-sm font-light">
            {paymentRequestDetails?.invoice?.payerEmail}
          </p>
        </article>
      </div>
      <InvoiceTable />

      <div className="flex justify-end items-center mt-5">
        <h3 className=" font-semibold text-pumpkin">
          {" "}
          Total Amount (₦): <span className="text-white"> 0.00</span>
        </h3>
      </div>

      <div className="w-full  flex justify-between gap-4 items-center mt-6">
        <PaymentButtons label="Back" onClick={showPreviousComponent} />
        <PaymentButtons onClick={showNextComponent} />
      </div>
    </section>
  );
};

export default Invoice;
