import { useState, useEffect } from "react";
import ModalLayout from "./ModalLayout"; 
import AuthButtons from "../buttons/AuthButtons";
import { AxiosPost } from "../../../services/http-service";
import { toast } from "react-toastify";

const AgencyModal = ({ onClose }) => {
  const [agencyCode, setAgencyCode] = useState("");
  const [description, setDescription] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  // Auto-populate CreatedBy field with logged-in user TIN
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("authDetails");
        console.log("🔍 Raw storedUser:", storedUser); // Debugging log
  
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log("✅ Parsed User Data:", parsedUser); // Debugging log
  
          // Try setting UserName from multiple possible keys
          const loggedInUserId = parsedUser?.UserName || parsedUser?.tin || parsedUser?.email;
  
          if (loggedInUserId) {
            setCreatedBy(loggedInUserId);
            console.log("✅ Updated UserName:", loggedInUserId);
          } else {
            toast.error("User identifier not found in auth details.");
          }
        } else {
          toast.error("User data not found. Please log in again.");
        }
      } catch (error) {
        toast.error("Invalid user data. Please log in again.");
      }
    }
  }, []);

  // Handle form submission
  const handleCreateAgency = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    // ✅ Fetch Token Again
    const token = localStorage.getItem("authToken");
    console.log("🔍 Retrieved Token Before API Call:", token);
  
    if (!token) {
      toast.error("Session expired. Please log in again.");
      setLoading(false);
      return;
    }
  
    const agencyData = {
      CreatedBy: createdBy,
      AgencyCode: agencyCode,
      Description: description,
    };
  
    try {
      const response = await AxiosPost(
        `${API_BASE_URL}/api/Agencies/Create`,
        agencyData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response?.data?.StatusCode === 200) {
        toast.success("Agency created successfully!");
        onClose();
      } else {
        toast.error(response?.data?.StatusMessage || "Failed to create agency.");
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
          
          {/* Created By (Auto-filled TIN) */}
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

          {/* Submit Button (Now inside form to trigger submit) */}
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








