"use client";
import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";

const CreateTaxOffices = ({
  handleCloseModal,
  handleCreateModal,
  isLoading,
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
    isActive: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.TaxOfficeId ||
      !formData.TaxOfficeName ||
      !formData.TaxOfficeTypeId
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    handleCreateModal(formData);
    handleCloseModal();
    setFormData({
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
      isActive: true,
    });
  };

  return (
    <ModalLayout handleCloseModal={handleCloseModal}>
      <div className="w-full p-5">
        <h3 className="my-5 text-lg font-semibold pb-4 border-b border-gray-500 text-gray-700">
          Create Tax Office
        </h3>
        <form className="w-full" onSubmit={handleSubmit}>
          {Object.keys(formData).map((key) => (
            <div className="w-full" key={key}>
              <label
                className="text-base font-medium text-gray-700"
                htmlFor={key}
              >
                {key.replace(/([A-Z])/g, " $1").trim()}
              </label>
              <div className="border-b-2 border-pumpkin h-[45px] w-full rounded-md my-4">
                {key === "isActive" ? (
                  <select
                    className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                ) : (
                  <input
                    className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                    type="text"
                    name={key}
                    value={formData[key]}
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
            label="Create"
            textColor="text-white"
            isLoading={isLoading}
          />
        </form>
      </div>
    </ModalLayout>
  );
};

export default CreateTaxOffices;
