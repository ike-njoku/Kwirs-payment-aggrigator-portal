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
