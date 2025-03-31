"use client";
import React, { useState, useEffect } from "react";
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

  const [taxOfficeTypes, setTaxOfficeTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);

  useEffect(() => {
    const fetchTaxOfficeTypes = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/taxOffice/GettaxOfficeType`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.StatusCode === 200) {
          setTaxOfficeTypes(data.Data || []); // Ensure we have an array
        } else {
          console.error("Failed to fetch tax office types");
        }
      } catch (error) {
        console.error("Error fetching tax office types:", error);
      } finally {
        setLoadingTypes(false);
      }
    };

    fetchTaxOfficeTypes();
  }, []);

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
      alert("Please fill in all required fields.");
      return;
    }

    handleCreateModal(formData);
    handleCloseModal();
  };

  return (
    <ModalLayout handleCloseModal={handleCloseModal}>
      <div className="w-full p-5">
        <h3 className="my-5 text-lg font-semibold pb-4 border-b border-gray-500 text-gray-700">
          Create Tax Office
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
                ) : (
                  <input
                    className="w-full h-full bg-gray-100 px-3 focus:outline-none"
                    type="text"
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
