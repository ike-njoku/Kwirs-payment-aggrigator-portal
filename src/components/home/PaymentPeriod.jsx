"use client";
import React, { useEffect, useState } from "react";
import PrimarySelect from "../shared-components/inputs/PrimarySelect";
import PrimaryInput from "../shared-components/inputs/PrimaryInput";
import PaymentPeriodTable from "../shared-components/table/PaymentPeriodTable";
import PaymentButtons from "../shared-components/buttons/PaymentButtons";
import { displayMonth, selectInputMonths } from "@/utils/functions";
import { toast } from "react-toastify";
import { AxiosGet, AxiosPost } from "../../services/http-service";

const PaymentPeriod = ({
  showNextComponent,
  showPreviousComponent,
  storeInvoiceDetails,
  paymentRequestDetails,
}) => {
  const [tableDetails, setTableDetails] = useState({
    year: "",
    amount: "",
    month: "",
  });
  const [tableData, setTableData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [PRN, setPRN] = useState("N/A");
  const [invoiceDetails, setInvoiceDetails] = useState({});
  const paymentDetails =
    JSON.parse(localStorage.getItem("paymentDetails") ?? "{}") || [];

  const handleAddItemToTable = async () => {
    const period = `${
      Number(tableDetails.month) + 1 < 10
        ? `0${Number(tableDetails.month) + 1}`
        : Number(tableDetails.month) + 1
    }/${tableDetails.year.slice(2)}`;

    const newData = {
      period,
      amount: tableDetails.amount,
    };

    const sum = Number(tableDetails.amount) + totalAmount;
    if (paymentDetails && sum > Number(paymentDetails?.amount)) {
      toast.error(
        `Total amount cannot be greater than ${paymentDetails?.amount}`
      );
      return;
    }

    const createPeriodResponse = await createPaymentPeriod(newData);
    if (!createPeriodResponse) {
      return;
    }
    setTableData((prev) => [...prev, newData]);
    setTotalAmount((prevAmount) => prevAmount + Number(tableDetails.amount));

    setTableDetails({
      year: "",
      amount: "",
      month: "",
    });
  };

  const checkForAmountMismatch = (e) => {
    const sum = Number(tableDetails.amount) + totalAmount;
    if (paymentDetails && sum < Number(paymentDetails?.amount)) {
      toast.error(`Total amount cannot be less than ${paymentDetails?.amount}`);
      return;
    }
    showNextComponent(e);
  };

  const createPaymentPeriod = async (paymentPeriodDetails) => {
    paymentPeriodDetails.month = tableDetails.month;
    paymentPeriodDetails.year = tableDetails.year;
    paymentPeriodDetails.PRN = paymentRequestDetails?.invoice?.PRN ?? "N/A";
    paymentPeriodDetails.CreatedBy = "1000000826"; //Insert admin details
    const requestUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/PaymentPeriod/Create`;

    const apiResponse = await AxiosPost(requestUrl, paymentPeriodDetails);
    if (!apiResponse || apiResponse.StatusCode == 500) {
      toast.error("could not create payment period");
      return false;
    }
    return await getPaymentPeriods();
  };

  const startYear = 1980;
  const currentYear = new Date().getFullYear();

  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, index) => startYear + index
  ).reverse();

  const handleOnchange = (e) => {
    const name = e.target.name;
    setTableDetails((prev) => ({ ...prev, [name]: e.target.value }));
  };

  const createPaymentInvoice = async () => {
    const _paymentRequestDetails = localStorage.getItem("paymentDetails");
    if (!_paymentRequestDetails) {
      toast.error("Please fill out the form leading here");
      return;
    }

    const paymentRequestDetails = JSON.parse(_paymentRequestDetails);

    const requestObject = {
      TIN: paymentRequestDetails.TIN ?? "N/A",
      taxPayerName: paymentRequestDetails.payerName,
      taxtypeId: "PAYE",
      amount: Number(paymentRequestDetails.amount),
      payerName: paymentRequestDetails.payerName,
      payerAddress: paymentRequestDetails.address,
      payerPhone: paymentRequestDetails.payerPhone,
      payerEmail: paymentRequestDetails.payerEmail,
      taxOffice: paymentRequestDetails.TaxOffice,
      narration: "sample string 11",
      createdBy: "1000000826", // Replace with admin details
      assessmentId: paymentRequestDetails.paymentAssessmentNumber ?? "",
    };

    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/invoice/Create`;
    const apiResponse = await AxiosPost(apiUrl, requestObject);
    if (apiResponse && apiResponse.Data) {
      const invoice = apiResponse.Data[0];
      setInvoiceDetails(invoice);
      setPRN(invoice.PRN);
      storeInvoiceDetails(invoice);
    }
    return;
  };

  const getPaymentPeriods = async () => {
    let _paymentDetails = localStorage.getItem("paymentDetails");
    if (!_paymentDetails) {
      toast.error("Please fill the form first");
      return;
    }

    _paymentDetails = JSON.parse(_paymentDetails);
    const PRN = _paymentDetails?.invoice?.PRN;
    if (!PRN) {
      await createPaymentInvoice();
      return;
    }
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/PaymentPeriod/GetAllPaymentPeriodByPRN/${PRN}`;

    const apiResponse = await AxiosGet(url);

    const { data } = apiResponse;
    const { Data } = data;
    const _tableData = Data;
    _tableData.map((period) => (period.prn = period.PRN));
    _tableData.map((period) => (period.amount = period.amount));
    _tableData.map(
      (data) => (data.period = `${displayMonth(data.month)} / ${data.year}`)
    );

    let _totalAmount = 0;
    for (let i = 0; i < _tableData.length; i++) {
      const currentItem = _tableData[i];
      _totalAmount += currentItem.amount;
    }

    setTableData(_tableData);
    setPRN(_tableData[0]?.PRN);
    setTotalAmount(_totalAmount);
  };

  const deletePaymentPeriod = async (paymentPeriod) => {
    const requestURL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/PaymentPeriod/Delete/${paymentPeriod.periodId}`;
    const apiResponse = await AxiosGet(requestURL);
    setTableData((prevVlue) =>
      prevVlue.filter((value) => value.periodId !== value.periodId)
    );
    setTotalAmount(totalAmount - paymentPeriod.amount);
    return await getPaymentPeriods();
  };

  useEffect(() => {
    getPaymentPeriods();
  }, []);

  return (
    <section className="w-full md:max-w-[700px] sm:mx-auto md:mx-0 md:ml-auto pt-8 pb-5 px-8 md:px-10 rounded-[28px] border border-pumpkin mt-10">
      <h3
        className={`font-bold sm:text-3xl capitalize text-center text-2xl text-white `}
      >
        Payment Period
      </h3>

      <div className="w-full mt-6 mb-5">
        <div className="flex flex-col sm:flex-row items-center justify-between  sm:gap-4">
          <PrimarySelect
            labelStyle="capitalize"
            placeholder="Select month"
            label="month"
            optionData={selectInputMonths.map((period, i) => (
              <option value={period.value} className="text-black" key={i}>
                {period.month}
              </option>
            ))}
            handleChange={handleOnchange}
            value={tableDetails.month}
            name="month"
          />
          <PrimarySelect
            labelStyle="capitalize"
            placeholder="Select year"
            label="year"
            optionData={years.map((year, i) => (
              <option value={year} className="text-black" key={i}>
                {year}
              </option>
            ))}
            handleChange={handleOnchange}
            value={tableDetails.year}
            name="year"
          />
          <PrimaryInput
            labelStyle="capitalize"
            label="amount"
            placeholder="Enter amount"
            value={tableDetails.amount}
            handleChange={handleOnchange}
            name="amount"
          />
        </div>

        <div
          className={` w-full rounded-lg h-[48px] max-w-[150px] overflow-hidden ml-auto hover:bg-transparent border-2 border-pumpkin transition-all mt-5 bg-pumpkin`}
        >
          <button
            className={`capitalize w-full h-full bg-transparent border-0 hover:text-pumpkin disabled:bg-[rgba(255,117,24,0.4)] text-white `}
            onClick={handleAddItemToTable}
          >
            Add
          </button>
        </div>

        <PaymentPeriodTable
          deletePaymentPeriod={deletePaymentPeriod}
          tableData={tableData ?? []}
          PRN={PRN ?? "N/A"}
        />

        <div className="flex justify-end items-center mt-5">
          <h3 className="text-white font-semibold">
            {" "}
            Total Amount: {totalAmount}
          </h3>
        </div>

        <div className="w-full flex justify-between gap-4 items-center mt-6">
          <PaymentButtons label="Back" onClick={showPreviousComponent} />
          <PaymentButtons onClick={checkForAmountMismatch} />
        </div>
      </div>
    </section>
  );
};

export default PaymentPeriod;
