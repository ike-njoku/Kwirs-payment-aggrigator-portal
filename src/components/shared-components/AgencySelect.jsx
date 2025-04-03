import { useEffect, useState } from "react";

const AgencySelect = ({ agencyId, setAgencyId }) => {
  const [agencies, setAgencies] = useState([]);

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/Agencies/GetAllAgencies`
        );
        if (!response.ok) throw new Error("Failed to fetch agencies");

        const data = await response.json();

        // Extract the Data array from the response
        if (data?.Data && Array.isArray(data.Data)) {
          setAgencies(data.Data);
        } else {
          console.error("Unexpected API response format:", data);
          setAgencies([]); // Ensure it's an array
        }
      } catch (error) {
        console.error("Error fetching agencies:", error);
        setAgencies([]);
      }
    };

    fetchAgencies();
  }, []);

  return (
    <div className="w-full">
      <label className="text-base font-medium text-gray-700" htmlFor="agencyId">
        Agency
      </label>

      <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
        <select
          className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
          value={agencyId}
          onChange={(e) => setAgencyId(e.target.value)}
          required
        >
          <option value="">Select Agency</option>
          {agencies.length > 0 ? (
            agencies.map((agency) => (
              <option key={agency.AgencyId} value={agency.AgencyId}>
                {agency.description}
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

export default AgencySelect;
