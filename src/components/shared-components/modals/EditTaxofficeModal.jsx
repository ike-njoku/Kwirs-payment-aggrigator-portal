"use client";
import React, { useState, useEffect } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";
import SwitchIcon from "@/components/users/SwitchIcon";

const EditTaxOfficeModal = ({
  handleCloseModal,
  index, // The selected tax office data
  handleEditModal,
  isLoading,
  heading = "Edit Tax Office",
}) => {
  const [formData, setFormData] = useState({
    TaxOfficeId: "",
    TaxOfficeName: "",
    TaxOfficeTypeId: "",
    RegionId: "",
    Street: "",
    City: "",
    LGAId: "",
    Telephone: "",
    TaxOfficerName: "",
    TaxOfficerPhone: "",
    isActive: true, // Changed from string to boolean
  });

  const [taxOfficeTypes, setTaxOfficeTypes] = useState([]);
  const [lgas, setLgas] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [loadingLgas, setLoadingLgas] = useState(true);
  const [loadingRegions, setLoadingRegions] = useState(true);
  const [error, setError] = useState(null);

  // Function to clean up label names by removing 'Id' and proper formatting
  const formatLabel = (key) => {
    return key
      .replace(/Id$/, "") // Remove 'Id' at the end
      .replace(/([A-Z])/g, " $1") // Add space before capital letters
      .trim();
  };

  // Toggle function for the SwitchIcon
  const toggleStatus = () => {
    setFormData((prev) => ({
      ...prev,
      isActive: !prev.isActive,
    }));
  };

  // Fetch dropdown data
  useEffect(() => {
    const fetchTaxOfficeTypes = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/taxOffice/GettaxOfficeType`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.StatusCode === 200) {
          setTaxOfficeTypes(data.Data || []);
        } else {
          console.error("Failed to fetch tax office types");
          setError("Failed to load tax office types");
        }
      } catch (error) {
        console.error("Error fetching tax office types:", error);
        setError("Error loading tax office types");
      } finally {
        setLoadingTypes(false);
      }
    };

    const fetchLgas = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/utility/GetAllLGA`;
        const response = await fetch(url);
        const data = await response.json();
        setLgas(data || []);
      } catch (error) {
        console.error("Error fetching LGAs:", error);
        setError("Error loading LGAs");
      } finally {
        setLoadingLgas(false);
      }
    };

    const fetchRegions = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/taxOffice/GettaxOfficeRegion`;
        const response = await fetch(url);
        const data = await response.json();
        console.log("Region Data:", data);

        if (data.StatusCode === 200) {
          setRegions(data.Data || []);
        } else {
          console.error("Failed to fetch regions");
          setError("Failed to load regions");
        }
      } catch (error) {
        console.error("Error fetching regions:", error);
        setError("Error loading regions");
      } finally {
        setLoadingRegions(false);
      }
    };

    fetchTaxOfficeTypes();
    fetchLgas();
    fetchRegions();
  }, []);

  // Initialize form data when index changes
  useEffect(() => {
    if (index) {
      setFormData({
        TaxOfficeId: index.TaxOfficeId?.toString() || "",
        TaxOfficeName: index.TaxOfficeName || "",
        TaxOfficeTypeId: index.TaxOfficeTypeId?.toString() || "",
        RegionId: index.RegionId?.toString() || "",
        Street: index.Street || "",
        City: index.City || "",
        LGAId: index.LGAId?.toString() || "",
        Telephone: index.Telephone || "",
        TaxOfficerName: index.TaxOfficerName || "",
        TaxOfficerPhone: index.TaxOfficerPhone || "",
        isActive: index.isActive || false, // Changed to boolean
      });
    }
  }, [index]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.TaxOfficeId ||
      !formData.TaxOfficeName ||
      !formData.TaxOfficeTypeId ||
      !formData.RegionId
    ) {
      alert("Please fill in required fields");
      return;
    }

    handleEditModal({
      ...formData,
      TaxOfficeId: index.TaxOfficeId, // Preserve original ID
    });

    handleCloseModal();
  };

  return (
    <ModalLayout handleCloseModal={handleCloseModal}>
      <div className="w-full p-5">
        <h3 className="my-5 text-lg font-semibold pb-4 border-b border-gray-500 text-gray-700">
          {heading}
        </h3>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form className="w-full" onSubmit={handleSubmit}>
          {Object.entries(formData).map(([key, value]) => (
            <div className="w-full mb-4" key={key}>
              <label className="text-base font-medium text-gray-700">
                {formatLabel(key)}
              </label>
              <div className="border-b-2 border-pumpkin h-[45px] w-full rounded-md mt-2">
                {key === "isActive" ? (
                  <div className="flex items-center h-full px-3">
                    <SwitchIcon
                      isActive={formData.isActive}
                      onToggle={toggleStatus}
                    />
                    <span className="ml-2 text-gray-700">
                      {formData.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                ) : key === "TaxOfficeTypeId" ? (
                  <select
                    className="w-full h-full bg-gray-100 px-3 focus:outline-none"
                    name={key}
                    value={value}
                    onChange={handleChange}
                    disabled={loadingTypes}
                  >
                    <option value="">Select Tax Office Type</option>
                    {taxOfficeTypes.map((type) => (
                      <option
                        key={type.TaxOfficeTypeId}
                        value={type.TaxOfficeTypeId}
                      >
                        {type.TaxOfficeTypeName}
                      </option>
                    ))}
                  </select>
                ) : key === "LGAId" ? (
                  <select
                    className="w-full h-full bg-gray-100 px-3 focus:outline-none"
                    name={key}
                    value={value}
                    onChange={handleChange}
                    disabled={loadingLgas}
                  >
                    <option value="">Select LGA</option>
                    {lgas.map((lga) => (
                      <option key={lga.LGAId} value={lga.LGAId.toString()}>
                        {lga.LGAName}
                      </option>
                    ))}
                  </select>
                ) : key === "RegionId" ? (
                  <select
                    className="w-full h-full bg-gray-100 px-3 focus:outline-none"
                    name={key}
                    value={value}
                    onChange={handleChange}
                    disabled={loadingRegions}
                  >
                    <option value="">Select Region</option>
                    {regions.map((region) => (
                      <option
                        key={region.RegionId || region.Id}
                        value={(region.RegionId || region.Id).toString()}
                      >
                        {region.RegionName || region.Name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="w-full h-full bg-gray-100 px-3 focus:outline-none"
                    type={key.toLowerCase().includes("phone") ? "tel" : "text"}
                    name={key}
                    value={value}
                    onChange={handleChange}
                    placeholder={`Enter ${formatLabel(key)}`}
                  />
                )}
              </div>
            </div>
          ))}

          <AuthButtons
            label="Update Tax Office"
            textColor="text-white"
            isLoading={isLoading}
          />
        </form>
      </div>
    </ModalLayout>
  );
};

export default EditTaxOfficeModal;
