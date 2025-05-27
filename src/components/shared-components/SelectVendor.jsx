import { useEffect, useState } from "react";

const SelectVendor = ({ vendorId, setVendorId }) => {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/Vendors/GetAll`
        );
        if (!response.ok) throw new Error("Failed to fetch vendors");

        const data = await response.json();

        if (data?.Data && Array.isArray(data.Data)) {
          setVendors(data.Data);
        } else {
          console.error("Unexpected API response format:", data);
          setVendors([]);
        }
      } catch (error) {
        console.error("Error fetching vendors:", error);
        setVendors([]);
      }
    };

    fetchVendors();
  }, []);

  return (
    <div className="w-full">
      <label
        className="text-base font-medium text-gray-700"
        htmlFor="vendorId"
      >
        Vendor
      </label>

      <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
        <select
          className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
          value={vendorId}
          onChange={(e) => setVendorId(e.target.value)}
          required
        >
          <option value="">Select Vendor</option>
          {vendors.length > 0 ? (
            vendors.map((vendor) => (
              <option key={vendor.vendorId} value={vendor.vendorId}>
                {vendor.vendorName}
              </option>
            ))
          ) : (
            <option disabled>Loading...</option>
          )}
        </select>
      </div>
    </div>
  );
};

export default SelectVendor;
