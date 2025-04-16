"use client";
import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";

const CreateSendEmail = ({
  handleCloseModal,
  handleCreateModal,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    sms: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.sms || !formData.description) {
      alert("Please fill in all fields.");
      return;
    }

    handleCreateModal(formData);
    handleCloseModal();
  };

  return (
    <ModalLayout handleCloseModal={handleCloseModal}>
      <div className="w-full p-5">
        <h3 className="my-5 text-lg font-semibold pb-4 border-b border-gray-500 text-gray-700">
          Create Notification
        </h3>

        <form className="w-full" onSubmit={handleSubmit}>
          {[
            { name: "email", label: "Email Content", type: "text" },
            { name: "sms", label: "SMS Content", type: "text" },
            { name: "description", label: "Description", type: "text" },
          ].map((field) => (
            <div className="w-full mb-4" key={field.name}>
              <label className="text-base font-medium text-gray-700">
                {field.label}
              </label>
              <div className="border-b-2 border-pumpkin h-[45px] w-full rounded-md mt-2">
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full h-full bg-gray-100 px-3 focus:outline-none"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              </div>
            </div>
          ))}

          <AuthButtons
            label="Create Notification"
            textColor="text-white"
            isLoading={isLoading}
          />
        </form>
      </div>
    </ModalLayout>
  );
};

export default CreateSendEmail;
