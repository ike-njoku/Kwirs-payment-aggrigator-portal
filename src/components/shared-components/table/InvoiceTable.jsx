import React, { useEffect, useState } from "react";
import { AxiosGet } from "../../../services/http-service";
import { displayMonth } from "../../../utils/functions";

const InvoiceTable = (paymentRequestDetails) => {
  const [tableData, setTableData] = useState([]);
  // const tableData = [
  //   {
  //     prn: paymentRequestDetails.paymentRequestDetails.invoice?.PRN,
  //     agency: "some agency",
  //     taxType: "some tax type",
  //     period: "Feb 2024",
  //     amount: paymentRequestDetails?.paymentRequestDetails?.invoice?.amount,
  //   },
  // ];

  const getPaymentPeriods = async () => {
    const PRN = paymentRequestDetails.paymentRequestDetails.invoice?.PRN;
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

    setTableData(_tableData);
  };

  console.log("____________data", tableData);

  useEffect(() => {
    getPaymentPeriods();
  }, []);

  // const tableHeadings = ["PRN", "Agency", "Tax Type", "Period", "Amount(₦)"];
  const tableHeadings = ["PRN", "Period", "Amount(₦)"];

  return (
    <div className="relative overflow-x-auto h-auto w-full mt-8 w-full">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 table-auto ">
        <thead className="text-xs text-white uppercase bg-pumpkin">
          <tr>
            {tableHeadings.map((heading, i) => (
              <th scope="col" className="px-2 py-3 " key={i}>
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.length > 0 &&
            tableData.map((tableInfo, i) => (
              <tr
                className="odd:bg-[rgba(255,255,255,0.5)] even:bg-gray-100 border-b border-gray-200 text-sm"
                key={i}
              >
                <td
                  scope="row"
                  className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap capitalize text-sm"
                >
                  {tableInfo.prn}
                </td>

                {/* <td className="px-2 py-4 text-gray-900 capitalize text-sm">
                  {tableInfo.agency}
                </td> */}

                {/* <td className="px-2 py-4 text-gray-900 text-sm">
                  {tableInfo.taxType}
                </td> */}

                <td className="px-2 py-4 text-gray-900 text-sm">
                  {tableInfo.period}
                </td>
                <td className="px-2 py-4 text-gray-900 text-sm">
                  {tableInfo.amount}
                </td>
              </tr>
            ))}

          {tableData.length === 0 && (
            <tr>
              <td
                colSpan={tableHeadings.length}
                className="bg-[rgba(255,255,255,0.5)]"
              >
                <h3 className="w-full font-semibold py-5 text-2xl text-center">
                  No data available
                </h3>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTable;
