import React from "react";

const PaymentPeriodTable = ({ tableData, PRN, deletePaymentPeriod }) => {
  const tableHeadings = [
    "S/N",
    "PRN",
    "Period (mm/yy)",
    "Amount (₦)",
    "Actions",
  ];
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
                  {PRN}
                </td>

                <td className="px-6 py-4 text-gray-900 capitalize text-sm">
                  {tableInfo.period}
                </td>

                <td className="px-6 py-4 text-gray-900 text-sm">
                  {tableInfo.amount}
                </td>

                <td className="px-6 py-4 text-gray-900 text-sm">
                  <span
                    onClick={() => deletePaymentPeriod(tableInfo)}
                    style={{ cursor: "pointer" }}
                  >
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      stroke-width="0"
                      viewBox="0 0 448 512"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"></path>
                    </svg>
                  </span>
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
