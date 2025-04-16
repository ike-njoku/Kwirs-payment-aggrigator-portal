"use client";
import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";
import SelectTaxOffice from "../SelectTaxOffice";
import SelectTaxType from "../SelectTaxType";

const CreateBulkPaymentModal = ({ handleCloseModal, handleCreateModal }) => {
  const [taxOfficeId, setTaxOfficeId] = useState("");
  const [taxTypeId, setTaxTypeId] = useState("");
  const [fileUpload, setFileUpload] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!taxOfficeId.trim() || !taxTypeId.trim() || !fileUpload) {
      alert("All fields are required!");
      setIsLoading(false);
      return;
    }

    handleCreateModal({
      TaxOfficeId: taxOfficeId,
      TaxType: taxTypeId,
      ExcelFile: fileUpload,
    });

    setIsLoading(false);
    handleCloseModal();
  };

  return (
    <ModalLayout handleCloseModal={handleCloseModal}>
      <div className="w-full p-5">
        <h3 className="my-5 text-lg font-semibold pb-4 border-b border-b-gray-500 text-gray-700">
          Create Bulk Payment
        </h3>
        <form className="w-full" onSubmit={handleFormSubmit}>
          <SelectTaxOffice
            taxOfficeId={taxOfficeId}
            setTaxOfficeId={setTaxOfficeId}
          />

          <SelectTaxType taxTypeId={taxTypeId} setTaxTypeId={setTaxTypeId} />

          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Upload Excel File
            </label>
            <div className="border-b-2 border-b-pumpkin  w-full rounded-md my-4 flex items-center">
              <input
                type="file"
                accept=".xls,.xlsx"
                className="w-full bg-gray-100 px-3 py-2 focus:outline-none text-gray-700"
                onChange={(e) => setFileUpload(e.target.files[0])}
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

export default CreateBulkPaymentModal;
