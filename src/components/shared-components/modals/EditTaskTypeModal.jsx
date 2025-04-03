"use client";
import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";
import AgencySelect from "../../shared-components/AgencySelect";


const EditTaskTypeModal = ({
  handleCloseModal,
  index,
  handleEditModal,
  label,
  heading,
}) => {
  const taxTypeId = index.taxTypeId;
  const createdBy = index.createdBy;
  const headCode = index.headCode;
  const subHeadCode = index.subHeadCode;
  const [agencyId, setagencyId] = useState("1");
  const [serviceId, setserviceId] = useState(index.serviceId);
  const [Dsecription, setDsecription] = useState(index.Dsecription);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = (e) => {
    setIsLoading(true);
    e.preventDefault();
    handleEditModal(index, {
      taxTypeId,
      createdBy,
      headCode,
      subHeadCode,
      agencyId,
      serviceId,
      Dsecription,
    });
    setIsLoading(false);
    handleCloseModal();
  };
  return (
    <ModalLayout handleCloseModal={handleCloseModal}>
      <div className="w-full p-5 ">
        <h3 className="my-5 text-lg font-semibold pb-4 border-b border-b-gray-500 text-gray-700">
          {heading}
        </h3>
        <form className="w-full" onSubmit={handleFormSubmit}>
          {/* <div className="w-full">
            <label
              className="text-base font-medium text-gray-700"
              htmlFor="headCode"
            >
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
          </div>{" "} */}
          {/* <div className="w-full">
            <label
              className="text-base font-medium text-gray-700"
              htmlFor="subHeadCode"
            >
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
          </div>{" "} */}
                             <AgencySelect agencyId={agencyId} setAgencyId={setagencyId} />
         
          {/* Resource URL Input */}
          <div className="w-full">
            <label
              className="text-base font-medium text-gray-700"
              htmlFor="serviceId"
            >
              Service Id
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                value={serviceId}
                onChange={(e) => setserviceId(e.target.value)}
                placeholder="service ID"
              />
            </div>
          </div>
          <div className="w-full">
            <label
              className="text-base font-medium text-gray-700"
              htmlFor="Dsecription"
            >
              Description
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                value={Dsecription}
                onChange={(e) => setDsecription(e.target.value)}
                placeholder="Description"
                required
              />
            </div>
          </div>
          <AuthButtons
            label="Update"
            textColor="text-white"
            isLoading={isLoading}
          />
        </form>
      </div>
    </ModalLayout>
  );
};

export default EditTaskTypeModal;
