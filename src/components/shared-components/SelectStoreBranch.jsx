import { useEffect, useState } from "react";

const SelectStoreBranch = ({ branchId, setBranchId }) => {
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/StoreBranches/GetAll`
        );
        if (!response.ok) throw new Error("Failed to fetch store branches");

        const data = await response.json();

        if (data?.Data && Array.isArray(data.Data)) {
          setBranches(data.Data);
        } else {
          console.error("Unexpected API response format:", data);
          setBranches([]);
        }
      } catch (error) {
        console.error("Error fetching store branches:", error);
        setBranches([]);
      }
    };

    fetchBranches();
  }, []);

  return (
    <div className="w-full">
      <label className="text-base font-medium text-gray-700" htmlFor="branchId">
        Select Store Branch
      </label>

      <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
        <select
          className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
          value={branchId}
          onChange={(e) => setBranchId(e.target.value)}
          required
        >
          <option value="">Store Branch</option>
          {branches.length > 0 ? (
            branches.map((branch) => (
              <option key={branch.branchId} value={branch.branchId}>
                {branch.branchName}
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

export default SelectStoreBranch;
