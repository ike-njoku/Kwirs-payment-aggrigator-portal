import { useState, useEffect } from "react";
import ModalLayout from "./ModalLayout"; 
import { AxiosPost, AxiosGet } from "../../../services/http-service";
import { toast } from "react-toastify";

const AgencyModal = ({ onClose, refreshAgencies }) => {
  const [agencyCode, setAgencyCode] = useState("");
  const [description, setDescription] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [agencies, setAgencies] = useState([]); // ✅ Ensure agencies is an array
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  // ✅ Fetch TIN from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("authDetails");

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const loggedInUserTIN = parsedUser?.tin;

          if (loggedInUserTIN) {
            setCreatedBy(loggedInUserTIN);
          } else {
            toast.error("User TIN not found. Please log in again.");
          }
        } else {
          toast.error("User data not found. Please log in again.");
        }
      } catch (error) {
        toast.error("Invalid user data. Please log in again.");
      }
    }
  }, []);

  // ✅ Fetch agencies when modal opens
  useEffect(() => {
    fetchAgencies();
  }, []);

  // ✅ Fetch Agencies Function
  const fetchAgencies = async () => {
    try {
      const response = await AxiosGet(`${API_BASE_URL}/api/Agencies/GetAllAgencies`);
      if (response?.data?.Data) {
        setAgencies(response.data.Data);
      } else {
        setAgencies([]); // ✅ Prevents undefined state
      }
    } catch (error) {
      console.error("❌ Error fetching agencies:", error);
    }
  };

  // ✅ Handle Agency Creation
  const handleCreateAgency = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!createdBy) {
      toast.error("Invalid user details. Please log in again.");
      setLoading(false);
      return;
    }

    if (!agencyCode || !description) {
      toast.error("All fields are required.");
      setLoading(false);
      return;
    }

    const agencyData = {
      CreatedBy: createdBy,
      AgencyCode: agencyCode,
      Dsecription: description, // ✅ Keeping "Dsecription" as is
    };

    console.log("🚀 Sending API request with:", agencyData);

    try {
      const response = await AxiosPost(`${API_BASE_URL}/api/Agencies/Create`, agencyData);
      console.log("✅ Full API Response:", response);

      if (!response || response.StatusCode !== 200) {
        toast.error(response?.StatusMessage || "Failed to create agency.");
        return;
      }

      toast.success(response.StatusMessage || "Agency created successfully!");

      // ✅ Optimistic Update (Update UI immediately)
      // setAgencies((prev) => [...prev, response.Data]);

      // ✅ Ensure the latest data is fetched
      // await fetchAgencies();

      fetchAgencies();


      // ✅ Call refresh function if provided (triggers parent update)
      if (typeof refreshAgencies === "function") {
        refreshAgencies();
      }

      // ✅ Close modal if `onClose` exists
      if (typeof onClose === "function") {
        onClose();
      }

    } catch (error) {
      console.error("❌ Error creating agency:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalLayout handleCloseModal={onClose}>
      <div className="w-full p-5">
        <h3 className="text-lg font-semibold pb-4 border-b border-gray-300 text-gray-700">
          Create Agency
        </h3>
        <form className="w-full mt-4" onSubmit={handleCreateAgency}>
          {/* Created By (Auto-filled TIN, Hidden Input) */}
          <input type="hidden" value={createdBy} />

          {/* Agency Code */}
          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">Agency Code</label>
            <input
              type="text"
              className="w-full border-b-2 border-gray-300 h-[45px] bg-gray-100 px-3 focus:outline-none text-gray-700"
              value={agencyCode}
              onChange={(e) => setAgencyCode(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">Description</label>
            <input
              type="text"
              className="w-full border-b-2 border-gray-300 h-[45px] bg-gray-100 px-3 focus:outline-none text-gray-700"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-pumpkin text-white font-semibold rounded-md"
            disabled={loading}
          >
            {loading ? "Processing..." : "Create Agency"}
          </button>
        </form>
      </div>
    </ModalLayout>
  );
};

export default AgencyModal;











