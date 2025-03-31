import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AxiosGet, AxiosPost } from "../../../services/http-service";
import ModalLayout from "./ModalLayout";

const EditAuthorization = ({ isOpen, onClose, fetchAuthorizations, authorizationId }) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const [loading, setLoading] = useState(false);
  const [authorizationData, setAuthorizationData] = useState({
    authorizationCode: "",
    taxpayerTIN: "",
    taxpayerName: "",
    Agency:"",
  });

  const [agencies, setAgencies] = useState([]);
  const [selectedAgencyId, setSelectedAgencyId] = useState("");

  useEffect(() => {
    if (!isOpen || !authorizationId) {
      console.log("❌ Modal not open or invalid authorizationId:", authorizationId);
      return;
    }

    console.log(`🟢 Fetching Authorization Data for ID: ${authorizationId}`);

    const fetchAuthorizationDetails = async () => {
      try {
        setLoading(true);
        const response = await AxiosGet(
          `${API_BASE_URL}/api/DLAuthorization/GetAuthorizationById/${authorizationId}`
        );

        console.log("🟢 API Response:", response?.data);

        if (response?.data?.StatusCode === 200 && response?.data?.Data?.length > 0) {
          const authData = response.data.Data[0];

          console.log("🟢 Authorization Data Fetched:", authData);

          setAuthorizationData({
            authorizationCode: authData.authorizationCode || "",
            taxpayerTIN: authData.taxpayerTIN || authData.tin || "",
            taxpayerName: authData.taxpayerName || authData.taxpayername || "",
            Agency: authData.Agency || authData.Agency || "",
          });

          setSelectedAgencyId(authData.agencyId ? String(authData.agencyId) : "");
        } else {
          console.log("❌ No data found in API response.");
          toast.error("Authorization data not found.");
        }
      } catch (error) {
        console.error("❌ Error fetching authorization details:", error);
        toast.error("Error fetching authorization details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorizationDetails();
  }, [isOpen, authorizationId]);


   const fetchAgencies = async () => {
      try {
        const response = await AxiosGet(`${API_BASE_URL}/api/Agencies/GetAllAgencies`);
        if (response?.data?.StatusCode === 200) {
          setAgencies(response.data.Data || []);
        } else {
          setAgencies([]);
          toast.error("Could not fetch agencies.");
        }
      } catch (error) {
        console.error("❌ Error fetching agencies:", error);
        toast.error("Error fetching agencies.");
      }
    };

  // Fetch Agencies for Dropdown
  useEffect(() => {
    fetchAgencies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuthorizationData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 Updating Authorization with Data:", {
      ...authorizationData,
      agencyId: selectedAgencyId,
    });

    try {
      setLoading(true);
      const response = await AxiosPost(
        `${API_BASE_URL}/api/DLAuthorization/Update`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          data: JSON.stringify({ authorizationId, ...authorizationData, agencyId: selectedAgencyId }),
        }
      );

      if (response?.data?.StatusCode === 200) {
        toast.success("Authorization updated successfully!");
        fetchAuthorizations();
        onClose();
      } else {
        toast.error("Failed to update authorization.");
      }
    } catch (error) {
      console.error("❌ Error updating authorization:", error);
      toast.error("Error updating authorization.");
    } finally {
      setLoading(false);
    }
  };

  return (
    isOpen && (
      <ModalLayout handleCloseModal={onClose}>
        <div className="w-full p-5">
          <h3 className="text-lg font-semibold pb-4 border-b border-gray-300 text-gray-700">
            Edit Authorization
          </h3>

          <form className="w-full mt-4" onSubmit={handleSubmit}>
            {/* ✅ Authorization Code */}
            <div className="w-full mb-4">
              <label className="text-base font-medium text-gray-700">
                Authorization Code
              </label>
              <input
                type="text"
                name="authorizationCode"
                className="w-full border-b-2 border-gray-300 h-[45px] bg-gray-100 px-3 focus:outline-none text-gray-700"
                value={authorizationData.authorizationCode}
                onChange={handleChange}
                required
              />
            </div>

            {/* ✅ Taxpayer TIN */}
            <div className="w-full mb-4">
              <label className="text-base font-medium text-gray-700">
                Taxpayer TIN
              </label>
              <input
                type="text"
                name="taxpayerTIN"
                className="w-full border-b-2 border-gray-300 h-[45px] bg-gray-100 px-3 focus:outline-none text-gray-700"
                value={authorizationData.taxpayerTIN}
                onChange={handleChange}
                required
              />
            </div>

            {/* ✅ Taxpayer Name */}
            <div className="w-full mb-4">
              <label className="text-base font-medium text-gray-700">
                Taxpayer Name
              </label>
              <input
                type="text"
                name="taxpayerName"
                className="w-full border-b-2 border-gray-300 h-[45px] bg-gray-100 px-3 focus:outline-none text-gray-700"
                value={authorizationData.taxpayerName}
                onChange={handleChange}
                required
              />
            </div>

            {/* ✅ Agency Dropdown */}
            <div className="w-full mb-4">
              <label className="text-base font-medium text-gray-700">Agency</label>
              {agencies.length > 0 ? (
                <select
                  className="w-full border-b-2 border-gray-300 h-[45px] rounded-md my-2 bg-gray-100 px-3 text-gray-700 focus:outline-none"
                  value={selectedAgencyId}
                  onChange={(e) => setSelectedAgencyId(e.target.value)}
                  required
                >
                  <option value="">Select Agency</option>
                  {agencies.map((agency) => (
                    <option key={agency.AgencyId} value={agency.AgencyId}>
                      {agency.description}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-500">Loading agencies...</p>
              )}
            </div>

            {/* ✅ Update Button */}
            <button
              type="submit"
              className="w-full py-2 bg-pumpkin text-white font-semibold rounded-md"
              disabled={loading}
            >
              {loading ? "Processing..." : "Update Authorization"}
            </button>
          </form>
        </div>
      </ModalLayout>
    )
  );
};

export default EditAuthorization;



























