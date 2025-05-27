import { useEffect, useState } from "react";

const SelectCustomers = ({ selectedCustomer, setSelectedCustomer }) => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/Customers/GetAll`
        );
        if (!response.ok) throw new Error("Failed to fetch customers");

        const data = await response.json();

        if (data?.Data && Array.isArray(data.Data) && data.Data.length > 0) {
          setCustomers(data.Data);
        } else {
          console.warn("No customers found, using demo data.");
          setCustomers([
            { CustomerName: "Customer 1", CustomerId: 1000 },
            { CustomerName: "Customer 2", CustomerId: 1001 },
            { CustomerName: "Customer 3", CustomerId: 1002 },
            { CustomerName: "Customer 4", CustomerId: 1003 },
            { CustomerName: "Customer 5", CustomerId: 1004 },
          ]);
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
        setCustomers([
          { CustomerName: "Customer 1", CustomerId: 1000 },
          { CustomerName: "Customer 2", CustomerId: 1001 },
          { CustomerName: "Customer 3", CustomerId: 1002 },
          { CustomerName: "Customer 4", CustomerId: 1003 },
          { CustomerName: "Customer 5", CustomerId: 1004 },
        ]);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="w-full">
      <label
        className="text-base font-medium text-gray-700"
        htmlFor="customerSelect"
      >
        Customer
      </label>

      <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
        <select
          id="customerSelect"
          className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          required
        >
          <option value="">Select a Customer</option>
          {customers.map((customer, index) => (
            <option key={index} value={customer.CustomerId}>
              {customer.CustomerName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SelectCustomers;
