"use client";

import React, { useEffect, useState } from "react";
import ModalLayout from "./ModalLayout";
import { AxiosGet } from "../../../services/http-service";
import { toast } from "react-toastify";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const FilterModal = ({ isOpen, onClose, filters, setFilters }) => {
  const [stores, setStores] = useState([]);
  const [items, setItems] = useState([]);
  const [issueDates, setIssueDates] = useState([]);

  useEffect(() => {
    fetchStores();
    fetchItems();
    fetchIssueDates();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await AxiosGet(`${API_BASE_URL}/api/StoreBranches/GetAll`);
      setStores(res?.data?.Data || []);
    } catch {
      toast.error("Failed to load stores");
    }
  };

  const fetchItems = async () => {
    try {
      const res = await AxiosGet(`${API_BASE_URL}/api/Inventory/ItemDetails/GetAll`);
      setItems(res?.data?.Data || []);
    } catch {
      toast.error("Failed to load items");
    }
  };

  const fetchIssueDates = async () => {
    try {
      const res = await AxiosGet(`${API_BASE_URL}/api/Inventory/StoreIssue/GetAll`);
      const issues = res?.data?.Data || [];

      // Extract and format dates without time, then get unique
      const uniqueDates = [...new Set(issues.map(issue => issue.IssuedDate?.split("T")[0]))];
      setIssueDates(uniqueDates.filter(Boolean)); // Remove falsy values
    } catch {
      toast.error("Failed to load issue dates");
    }
  };

  if (!isOpen) return null;

  return (
    <ModalLayout handleCloseModal={onClose}>
      <div className="w-full p-5">
        <h3 className="text-lg font-semibold pb-4 border-b border-gray-300 text-gray-700">
          Filter Store Issues
        </h3>

        {/* Item Filter */}
        <div className="w-full mb-4">
          <label className="text-base font-medium text-gray-700">Item</label>
          <select
            name="item"
            value={filters.item}
            onChange={(e) => setFilters((prev) => ({ ...prev, item: e.target.value }))}
            className="w-full border-b-2 border-gray-300 h-[45px] bg-gray-100 px-3 text-gray-700"
          >
            <option value="">All Items</option>
            {items.map((item) => (
              <option key={item.id} value={item.description}>
                {item.description}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div className="w-full mb-4">
          <label className="text-base font-medium text-gray-700">Date</label>
          <select
            name="date"
            value={filters.date}
            onChange={(e) => setFilters((prev) => ({ ...prev, date: e.target.value }))}
            className="w-full border-b-2 border-gray-300 h-[45px] bg-gray-100 px-3 text-gray-700"
          >
            <option value="">All Dates</option>
            {issueDates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>

        {/* Store Filter */}
        <div className="w-full mb-4">
          <label className="text-base font-medium text-gray-700">Store</label>
          <select
            name="store"
            value={filters.store}
            onChange={(e) => setFilters((prev) => ({ ...prev, store: e.target.value }))}
            className="w-full border-b-2 border-gray-300 h-[45px] bg-gray-100 px-3 text-gray-700"
          >
            <option value="">All Stores</option>
            {stores.map((store) => (
              <option key={store.id} value={store.branchName}>
                {store.branchName}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() =>
              setFilters({
                item: "",
                date: "",
                store: "",
              })
            }
            className="px-4 py-2 border border-gray-400 text-gray-600 rounded-md hover:bg-gray-100"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default FilterModal;

