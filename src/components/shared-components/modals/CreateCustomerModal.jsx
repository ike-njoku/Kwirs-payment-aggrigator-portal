"use client";
import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";
import AgencySelect from "../../shared-components/AgencySelect";

const CreateTaxTypeModal = ({ handleCloseModal, handleCreateModal }) => {
  // const CreatedBy = "Admin";

  const [customerId, setcustomerId] = useState("12345");
  const [customerName, setcustomerName] = useState("");
  const [Address, setAddress] = useState("");
  const [phone, setphone] = useState("");
  const [email, setemail] = useState("");
  const [meansofIdentification, setmeansofIdentification] = useState("");
  const [IdentificationId, setIdentificationId] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      // !CreatedBy.trim() ||
      !customerId.trim() ||
      !customerName.trim() ||
      !Address.trim() ||
      !phone.trim()
    ) {
      alert("All fields are required!");
      setIsLoading(false);
      return;
    }

    handleCreateModal({
      // CreatedBy,
      customerId,
      customerName,
      Address,
      phone,
      email,
      meansofIdentification,
      IdentificationId,
    });


    setIsLoading(false);
    handleCloseModal();
  };

  return (
    <ModalLayout handleCloseModal={handleCloseModal}>
      <div className="w-full p-5">
        <h3 className="my-5 text-lg font-semibold pb-4 border-b border-b-gray-500 text-gray-700">
          Create Customer
        </h3>
        <form className="w-full" onSubmit={handleFormSubmit}>
          <div className="w-full hidden">
            <label className="text-base font-medium text-gray-700">
              Customer ID
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={customerId}
                onChange={(e) => setcustomerId(e.target.value)}
                placeholder="Enter Customer ID"
                required
              />
            </div>
          </div>
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Customer Name
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={customerName}
                onChange={(e) => setcustomerName(e.target.value)}
                placeholder="Enter Customer Name"
                required
              />
            </div>
          </div>
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Address
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={Address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter Address"
                required
              />
            </div>
          </div>
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Phone Number
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={phone}
                onChange={(e) => setphone(e.target.value)}
                placeholder="Enter Phone Number"
                required
              />
            </div>
          </div>
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">Email</label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                placeholder="Enter Email"
              />
            </div>
          </div>
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Means of Identification
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <select
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                value={meansofIdentification}
                onChange={(e) => setmeansofIdentification(e.target.value)}
                required
              >
                <option value="">Select Identification</option>
                <option value="NIN">NIN</option>
                <option value="Voter's Card">Voter's Card</option>
                <option value="Driver's License">Driver's License</option>
                <option value="Passport">Passport</option>
                <option value="Staff ID">Staff ID</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Identification Number
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={IdentificationId}
                onChange={(e) => setIdentificationId(e.target.value)}
                placeholder="Enter ID Number"
              />
            </div>
          </div>
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

export default CreateTaxTypeModal;
