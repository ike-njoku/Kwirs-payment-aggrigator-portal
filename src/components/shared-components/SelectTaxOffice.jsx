import { useEffect, useState } from "react";

const SelectTaxOffice = ({ taxOfficeId, setTaxOfficeId }) => {
  const [taxOffices, setTaxOffices] = useState([]);

  useEffect(() => {
    const fetchTaxOffices = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/taxOffice/GetAllTaxOffices`
        );
        if (!response.ok) throw new Error("Failed to fetch tax offices");

        const data = await response.json();

        if (data?.Data && Array.isArray(data.Data)) {
          setTaxOffices(data.Data);
        } else {
          console.error("Unexpected API response format:", data);
          setTaxOffices([]);
        }
      } catch (error) {
        console.error("Error fetching tax offices:", error);
        setTaxOffices([]);
      }
    };

    fetchTaxOffices();
  }, []);

  return (
    <div className="w-full">
      <label
        className="text-base font-medium text-gray-700"
        htmlFor="taxOfficeId"
      >
        Tax Office
      </label>

      <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
        <select
          className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
          value={taxOfficeId}
          onChange={(e) => setTaxOfficeId(e.target.value)}
          required
        >
          <option value="">Select Tax Office</option>
          <option value="KUB">Test tax Office</option>
          {taxOffices.map((office) => (
            <option key={office.TaxOfficeId} value={office.TaxOfficeId}>
              {office.TaxOfficeName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SelectTaxOffice;
