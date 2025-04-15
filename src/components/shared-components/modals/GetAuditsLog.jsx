"use client";
import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";

const GetAuditLogs = ({ handleCloseModal, handleCreateModal, isLoading }) => {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    UserName: "",
    function: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.startDate || !formData.endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    // Construct payload with only required and non-empty optional fields
    const payload = {
      startDate: formData.startDate,
      endDate: formData.endDate,
    };

    if (formData.UserName.trim()) payload.UserName = formData.UserName.trim();
    if (formData.function.trim()) payload.function = formData.function.trim();

    handleCreateModal(payload); // Send payload to parent
    handleCloseModal(); // Close modal
  };

  return (
    <ModalLayout handleCloseModal={handleCloseModal}>
      <div className="w-full p-5">
        <h3 className="my-5 text-lg font-semibold pb-4 border-b border-gray-500 text-gray-700">
          Get Audit Logs
        </h3>

        <form className="w-full" onSubmit={handleSubmit}>
          {["startDate", "endDate"].map((key) => (
            <div className="w-full mb-4" key={key}>
              <label className="text-base font-medium text-gray-700">
                {key === "startDate" ? "Start Date" : "End Date"}
              </label>
              <div className="border-b-2 border-pumpkin h-[45px] w-full rounded-md mt-2">
                <input
                  type="date"
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="w-full h-full bg-gray-100 px-3 focus:outline-none"
                />
              </div>
            </div>
          ))}

          <AuthButtons
            label="Get Audit Logs"
            textColor="text-white"
            isLoading={isLoading}
          />
        </form>
      </div>
    </ModalLayout>
  );
};

export default GetAuditLogs;
