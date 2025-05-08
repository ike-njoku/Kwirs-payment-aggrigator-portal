"use client";
import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";
import SelectTaxOffice from "../SelectTaxOffice";

const GetBulkPaymentModal = ({ handleCloseModal, handleCreateModal }) => {
  const [mode, setMode] = useState("batch"); // "batch" or "date"
  const [batchNumber, setBatchNumber] = useState("");
  const [taxOfficeId, setTaxOfficeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (mode === "batch") {
      if (!batchNumber.trim()) {
        alert("Batch Number is required!");
        setIsLoading(false);
        return;
      }

      handleCreateModal({
        mode: "batch",
        batchNumber,
      });
    } else {
      if (!startDate || !endDate || !taxOfficeId.trim()) {
        alert("All fields are required!");
        setIsLoading(false);
        return;
      }

      handleCreateModal({
        mode: "date",
        startDate,
        endDate,
        TaxofficeId: taxOfficeId,
      });
    }

    setIsLoading(false);
    handleCloseModal();
  };

  return (
    <ModalLayout handleCloseModal={handleCloseModal}>
      <div className="w-full p-5">
        <h3 className="my-5 text-lg font-semibold pb-4 border-b border-b-gray-500 text-gray-700">
          Get Bulk Payment
        </h3>

        {/* Toggle Mode */}
        <div className="mb-4 flex gap-4">
          <button
            type="button"
            onClick={() => setMode("batch")}
            className={`px-4 py-2 rounded ${
              mode === "batch"
                ? "bg-pumpkin text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Get by Batch Number
          </button>
          <button
            type="button"
            onClick={() => setMode("date")}
            className={`px-4 py-2 rounded ${
              mode === "date"
                ? "bg-pumpkin text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Get by Date
          </button>
        </div>

        <form onSubmit={handleFormSubmit}>
          {mode === "batch" ? (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Batch Number
              </label>
              <input
                type="text"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                className="w-full border rounded-md px-3 py-2 mt-1"
                placeholder="Enter Batch Number"
                required
              />
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 mt-1"
                  required
                />
              </div>
              <SelectTaxOffice
                taxOfficeId={taxOfficeId}
                setTaxOfficeId={setTaxOfficeId}
              />
            </>
          )}

          <AuthButtons
            label="Submit"
            textColor="text-white"
            isLoading={isLoading}
          />
        </form>
      </div>
    </ModalLayout>
  );
};

export default GetBulkPaymentModal;
