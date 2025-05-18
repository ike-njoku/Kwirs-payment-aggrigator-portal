import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import ModalSelect from "../inputs/ModalSelect";
import ModalTextInput from "../inputs/ModalTextInput";

const EditInventoryModal = ({
  handleCloseModal,
  selectedItem,
  handleEditInventoryItem,
}) => {
  const categoryList = [
    "Category 1",
    "Category 2",
    "Category 3",
    "Category 4",
    "Category 5",
  ];
  const customerList = [
    "Customer 1",
    "Customer 2",
    "Customer 3",
    "Customer 4",
    "Customer 5",
  ];

  const vendorList = [
    "Vendor 1",
    "Vendor 2",
    "Vendor 3",
    "Vendor 4",
    "Vendor 5",
  ];

  const storeList = ["Store 1", "Store 2", "Store 3", "Store 4", "Store 5"];

  const [inventoryData, setInventoryData] = useState({
    itemName: selectedItem.itemName || "",
    itemCode: selectedItem.itemCode || "",
    itemClass: selectedItem.itemClass || "",
    itemPrice: selectedItem.itemPrice || "",
    itemUnits: selectedItem.itemUnits || "",
    category: selectedItem.category || "",
    customer: selectedItem.customer || "",
    vendor: selectedItem.vendor || "",
    storeIssue: selectedItem.storeIssue || "",
  });
  const handleChangeValue = (e) => {
    const { name, value } = e.target;
    setInventoryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ selectedItem, inventoryData });

    handleEditInventoryItem(selectedItem, inventoryData);
  };

  return (
    <ModalLayout handleCloseModal={handleCloseModal}>
      <div className="w-full p-5">
        <h3 className="text-lg font-semibold pb-4 border-b border-gray-300 text-gray-700">
          Edit Inventory
        </h3>
        <form className="w-full mt-4" onSubmit={handleSubmit}>
          <ModalTextInput
            label="Name"
            name="itemName"
            placeholder="Enter item name"
            type="text"
            value={inventoryData.itemName}
            handleChange={handleChangeValue}
          />
          <ModalTextInput
            label="Code"
            name="itemCode"
            placeholder="Enter item code"
            type="text"
            value={inventoryData.itemCode}
            handleChange={handleChangeValue}
          />
          <ModalTextInput
            label="Units"
            name="itemUnits"
            placeholder="Enter item unit"
            type="number"
            value={inventoryData.itemUnits}
            handleChange={handleChangeValue}
          />
          <ModalTextInput
            label="Price"
            name="itemPrice"
            placeholder="Enter item price"
            type="number"
            value={inventoryData.itemPrice}
            handleChange={handleChangeValue}
          />
          <ModalTextInput
            label="Class"
            name="itemClass"
            placeholder="Enter item class"
            type="text"
            value={inventoryData.itemClass}
            handleChange={handleChangeValue}
          />
          <ModalSelect
            label="Category"
            name="category"
            placeholder="Select Category"
            value={inventoryData.category}
            handleChange={handleChangeValue}
            optionData={categoryList.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          />
          <ModalSelect
            label="Customer"
            name="customer"
            placeholder="Select Customer"
            value={inventoryData.customer}
            handleChange={handleChangeValue}
            optionData={customerList.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          />
          <ModalSelect
            label="Vendor"
            name="vendor"
            placeholder="Select Vendor"
            optionData={vendorList.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
            value={inventoryData.vendor}
            handleChange={handleChangeValue}
          />
          <ModalSelect
            label="Store"
            name="storeIssue"
            placeholder="Select Store"
            optionData={storeList.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
            value={inventoryData.storeIssue}
            handleChange={handleChangeValue}
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-pumpkin text-white font-semibold rounded-md"

            // disabled={loading}
          >
            {/* {loading ? "Processing..." : "Create Inventory"} */}
            {"Update Inventory"}
          </button>
        </form>
      </div>
    </ModalLayout>
  );
};

export default EditInventoryModal;
