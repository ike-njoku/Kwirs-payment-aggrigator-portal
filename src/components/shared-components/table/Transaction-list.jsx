import React from "react";

const CustomTable = ({ tableHeadings, tableData = [], loading }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-pumpkin">
          <tr>
            {tableHeadings.map((heading, index) => (
              <th key={index} className="px-5 py-3 text-left text-sm text-white font-semibold">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
  {loading ? (
    <tr>
      <td colSpan={tableHeadings.length} className="p-3 text-center text-gray-600">
        Loading...
      </td>
    </tr>
  ) : tableData.length > 0 ? (
    tableData.map((row, index) => {
      // Format amount as NGN currency
      const formattedAmount = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN', // Set currency to Nigerian Naira
      }).format(row.amount);

      // Format date in "20th March 2025" format
      const date = new Date(row.PaymentDate);
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();

      // Add suffix to the day (st, nd, rd, th)
      const suffix = ['th', 'st', 'nd', 'rd'][(day % 10) > 3 ? 0 : (day % 10)] || 'th';
      const formattedDate = `${day}${suffix} ${month} ${year}`;

      return (
        <tr key={index} className={`border-t hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}>
          <td className="px-5 py-3 text-sm text-gray-700">{row.PRN}</td>
          <td className="px-5 py-3 text-sm text-gray-700">{row.narration}</td>
          <td className="px-5 py-3 text-sm text-gray-700">{row.PSSP}</td>
          <td className="px-5 py-3 text-sm text-gray-700">{row.Status}</td>
          <td className="px-5 py-3 text-sm text-gray-700">{formattedAmount}</td>
          <td className="px-5 py-3 text-sm text-gray-700">{formattedDate}</td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan={tableHeadings.length} className="p-3 text-center text-gray-500">
        No Transactions Found
      </td>
    </tr>
  )}
</tbody>

      </table>
    </div>
  );
};

export default CustomTable;









