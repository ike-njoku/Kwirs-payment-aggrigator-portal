"use client";
import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";

const CreateTaxTypeModal = ({ handleCloseModal, handleCreateModal }) => {
   const [taxTypeId, settaxTypeId] = useState("DA");
    const [createdBy, setcreatedBy] = useState("admin");
    const [headCode, setheadCode] = useState("10001-001"); 
    const [subHeadCode, setsubHeadCode] = useState("1003");
    const [agencyId, setagencyId] = useState(1);
    const [serviceId, setserviceId] = useState("");
    const [Dsecription, setDsecription] = useState("WHT");
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      !taxTypeId.trim() ||
      !createdBy.trim() ||
      !headCode.trim() ||
      !subHeadCode.trim() ||
      !agencyId ||
      // !serviceId.trim() ||
      !Dsecription.trim()
    ) {
      alert("All fields are required!");
      setIsLoading(false);
      return;
    }
    // Agency: "TEST AGENCY";
    // createdBy: "Admin";
    // createdDate: "2025-03-29T20:12:45.143";
    // description: "WHT";
    // headCode: "10001-001";
    // isActive: true;
    // serviceId: "";
    // subHeadCode: "1003";
    // taxtypeId: "DA";

    // Dsecription: "WHT";
    // agencyId: "TEST AGENCY";
    // createdBy: "admin";
    // headCode: "10001-001";
    // serviceId: "ServiceId";
    // subHeadCode: "1003";
    // taxTypeId: "DA";

    handleCreateModal({
      taxTypeId: taxTypeId,
      createdBy: createdBy,
      headCode: headCode,
      subHeadCode: subHeadCode,
      agencyId: agencyId,
      serviceId: serviceId,
      Dsecription: Dsecription,
    });

    setIsLoading(false);
    handleCloseModal();
  };

  return (
    <ModalLayout handleCloseModal={handleCloseModal}>
      <div className="w-full p-5">
        <h3 className="my-5 text-lg font-semibold pb-4 border-b border-b-gray-500 text-gray-700">
          Create Tax Type
        </h3>

        <form className="w-full" onSubmit={handleFormSubmit}>
          {/* Tax ID Input */}
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Tax Type Id
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={taxTypeId}
                onChange={(e) => settaxTypeId(e.target.value)}
                placeholder="Enter Tax Type Id"
                required
              />
            </div>
          </div>
          {/* CreatedBy Input */}
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Created By
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={createdBy}
                onChange={(e) => setcreatedBy(e.target.value)}
                placeholder="Enter creator name"
                required
              />
            </div>
          </div>
          {/* Head Code Input */}
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Head Code
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={headCode}
                onChange={(e) => setheadCode(e.target.value)}
                placeholder="Enter Head Code"
                required
              />
            </div>
          </div>
          {/* Sub Head Code Input */}
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Sub Head Code
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={subHeadCode}
                onChange={(e) => setsubHeadCode(e.target.value)}
                placeholder="Enter Sub Head Code"
                required
              />
            </div>
          </div>
          {/* Agency Id Input */}
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Agency Id
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={agencyId}
                onChange={(e) => setagencyId(e.target.value)}
                placeholder="Enter Agency Id"
                required
              />
            </div>
          </div>

          {/* Service Id Input */}
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Service Id
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={serviceId}
                onChange={(e) => setserviceId(e.target.value)}
                placeholder="Enter Service ID"
              />
            </div>
          </div>

          {/* Description Input */}
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Description
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                type="text"
                className="w-full h-[80px]- bg-gray-100 px-3 py-2 focus:outline-none text-gray-700"
                value={Dsecription}
                onChange={(e) => setDsecription(e.target.value)}
                placeholder="Enter description"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
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
