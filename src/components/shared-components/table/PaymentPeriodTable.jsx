import React from "react";

const PaymentPeriodTable = ({ tableData = [] }) => {
  const tableHeadings = ["S/N", "PRN", "Period (mm/yy)", "Amount (₦)"];
  return (
    <div className="relative overflow-x-auto h-auto shadow-md sm:rounded-lg mt-8">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
        <thead className="text-xs text-white uppercase bg-pumpkin">
          <tr>
            {tableHeadings.map((heading, i) => (
              <th scope="col" className="px-6 py-3" key={i}>
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.length > 0 &&
            tableData.map((tableInfo, i) => (
              <tr
                className="odd:bg-white even:bg-gray-100 border-b border-gray-200 text-sm"
                key={i}
              >
                <td
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap capitalize text-sm"
                >
                  {i + 1}
                </td>

                <td
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap capitalize text-sm"
                >
                  {/* {tableInfo.title} */}
                  ...
                </td>

                <td className="px-6 py-4 text-gray-900 capitalize text-sm">
                  {tableInfo.period}
                </td>

                <td className="px-6 py-4 text-gray-900 text-sm">
                  {tableInfo.amount}
                </td>
              </tr>
            ))}

          {tableData.length === 0 && (
            <tr>
              <td colSpan={tableHeadings.length} className="bg-white">
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

export default PaymentPeriodTable;
