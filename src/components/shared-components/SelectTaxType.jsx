import { useEffect, useState } from "react";

const SelectTaxType = ({ taxTypeId, setTaxTypeId }) => {
  const [taxTypes, setTaxTypes] = useState([]);

  useEffect(() => {
    const fetchTaxTypes = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/TaxTypes/GetAllTaxTypes`
        );
        if (!response.ok) throw new Error("Failed to fetch tax types");

        const data = await response.json();

        if (data?.Data && Array.isArray(data.Data)) {
          setTaxTypes(data.Data);
        } else {
          console.error("Unexpected API response format:", data);
          setTaxTypes([]);
        }
      } catch (error) {
        console.error("Error fetching tax types:", error);
        setTaxTypes([]);
      }
    };

    fetchTaxTypes();
  }, []);

  return (
    <div className="w-full">
      <label
        className="text-base font-medium text-gray-700"
        htmlFor="taxTypeId"
      >
        Tax Type
      </label>

      <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
        <select
          className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
          value={taxTypeId}
          onChange={(e) => setTaxTypeId(e.target.value)}
          required
        >
          <option value="">Select Tax Type</option>
          {taxTypes.length > 0 ? (
            taxTypes.map((taxType) => (
              <option key={taxType.TaxTypeId} value={taxType.TaxTypeId}>
                {taxType.description}
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

export default SelectTaxType;
