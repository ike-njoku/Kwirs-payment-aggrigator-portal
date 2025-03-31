"use client";
import React, { useState, useEffect } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";

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
    isActive: "true",
  });

  const [taxOfficeTypes, setTaxOfficeTypes] = useState([]);
  const [lgas, setLgas] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [loadingLgas, setLoadingLgas] = useState(true);

  // Fetch dropdown data
  useEffect(() => {
    const fetchTaxOfficeTypes = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/taxOffice/GettaxOfficeType`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.StatusCode === 200) {
          setTaxOfficeTypes(data.Data || []);
        }
      } catch (error) {
        console.error("Error fetching tax office types:", error);
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
      } finally {
        setLoadingLgas(false);
      }
    };

    fetchTaxOfficeTypes();
    fetchLgas();
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
        isActive: index.isActive ? "true" : "false",
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
      !formData.TaxOfficeTypeId
    ) {
      alert("Please fill in required fields");
      return;
    }

    handleEditModal({
      ...formData,
      isActive: formData.isActive === "true",
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

        <form className="w-full" onSubmit={handleSubmit}>
          {Object.entries(formData).map(([key, value]) => (
            <div className="w-full mb-4" key={key}>
              <label className="text-base font-medium text-gray-700">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </label>
              <div className="border-b-2 border-pumpkin h-[45px] w-full rounded-md mt-2">
                {key === "isActive" ? (
                  <select
                    className="w-full h-full bg-gray-100 px-3 focus:outline-none"
                    name={key}
                    value={value}
                    onChange={handleChange}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
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
                        {type.TaxOfficeTypeId}
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
                ) : (
                  <input
                    className="w-full h-full bg-gray-100 px-3 focus:outline-none"
                    type={key.toLowerCase().includes("phone") ? "tel" : "text"}
                    name={key}
                    value={value}
                    onChange={handleChange}
                    placeholder={`Enter ${key
                      .replace(/([A-Z])/g, " $1")
                      .trim()}`}
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
