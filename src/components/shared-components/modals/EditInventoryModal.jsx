import React, { useState, useEffect } from "react";
import ModalLayout from "./ModalLayout";
import ModalSelect from "../inputs/ModalSelect";
import ModalTextInput from "../inputs/ModalTextInput";
import { AxiosGet, AxiosPost } from "@/services/http-service";
import { toast } from "react-toastify";

const EditInventoryModal = ({
  handleCloseModal,
  selectedItem,
  handleEditInventoryItem,
  fetchAllInventory,
}) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const [loading, setLoading] = useState(false);
  const [inventoryData, setInventoryData] = useState({
    itemCode: selectedItem.itemCode || 0,
    description: selectedItem.description || "",
    barcode: selectedItem.barcode || "",
    cost: selectedItem.cost || 0.0,
    max: selectedItem.max || 0.0,
    reorder: selectedItem.reorder || 0.0,
    Active: selectedItem.Active || false,
    Unit: selectedItem.Unit || "Box",
    opBalance: selectedItem.opBalance || 0.0,
    ItemClassification: selectedItem.ItemClassification || "",
  });
  const [classifications, setClassifications] = useState([]);

  const fetchAllClass = async () => {
    try {
      setLoading(true);
      const response = await AxiosGet(
        `${API_BASE_URL}/api/Inventory/ItemClassification/GetAll`
      );

      if (response.status !== 200) {
        toast.error("An error occurred");
        setLoading(false);
        return;
      }

      setClassifications(response.data.Data);
      setLoading(false);
    } catch (error) {
      console.log("ERROR", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllClass();
  }, []);

  const handleChangeValue = (e) => {
    const { name, value } = e.target;
    setInventoryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    // handleEditInventoryItem(selectedItem, inventoryData);

    try {
      e.preventDefault();
      console.log({ selectedItem, inventoryData });
      const payload = {
        active: inventoryData.Active,
        ItemCode: Number(inventoryData.itemCode),
        cost: Number(inventoryData.cost),
        max: Number(inventoryData.max),
        reorder: Number(inventoryData.reorder),
        openingBalance: Number(inventoryData.opBalance),
        classCode: 1,
        unitcode: 1,
        description: inventoryData.description,
        barcode: inventoryData.barcode,
      };
      // api call
      const response = await AxiosPost(
        `${API_BASE_URL}/api/Inventory/ItemDetails/Update`,
        payload
      );

      if (response.StatusCode !== 200) {
        toast.error(response.StatusMessage);
        setLoading(false);
        return;
      }
      toast.success("Classification updated successfully!");
      fetchAllInventory();
      setLoading(false);
      handleCloseModal();
    } catch (error) {
      console.log("Error", error);
      setLoading(false);
    }
  };

  return (
    <ModalLayout handleCloseModal={handleCloseModal}>
      <div className="w-full p-5">
        <h3 className="text-lg font-semibold pb-4 border-b border-gray-300 text-gray-700">
          Edit Inventory
        </h3>
        <form className="w-full mt-4" onSubmit={handleSubmit}>
          <ModalTextInput
            label="Description"
            name="description"
            placeholder="Enter item description"
            type="text"
            value={inventoryData.description}
            handleChange={handleChangeValue}
          />
          <ModalTextInput
            label="Item Code"
            name="itemCode"
            placeholder="Enter item code"
            type="number"
            value={inventoryData.itemCode}
            handleChange={handleChangeValue}
          />
          <ModalTextInput
            label="Barcode"
            name="barcode"
            placeholder="Enter barcode"
            type="text"
            value={inventoryData.barcode}
            handleChange={handleChangeValue}
          />
          <ModalTextInput
            label="Cost"
            name="cost"
            placeholder="Enter item cost"
            type="number"
            value={inventoryData.cost}
            handleChange={handleChangeValue}
          />
          <ModalTextInput
            label="Max"
            name="max"
            placeholder="Enter max quantity"
            type="number"
            value={inventoryData.max}
            handleChange={handleChangeValue}
          />
          <ModalTextInput
            label="Reorder"
            name="reorder"
            placeholder="Enter reorder level"
            type="number"
            value={inventoryData.reorder}
            handleChange={handleChangeValue}
          />
          <ModalTextInput
            label="Opening Balance"
            name="opBalance"
            placeholder="Enter opening balance"
            type="number"
            value={inventoryData.opBalance}
            handleChange={handleChangeValue}
          />
          <ModalTextInput
            label="Unit"
            name="Unit"
            placeholder="Enter unit"
            type="text"
            value={inventoryData.Unit}
            handleChange={handleChangeValue}
          />
          <ModalSelect
            label="Classification"
            name="ItemClassification"
            placeholder="Select item classification"
            value={inventoryData.ItemClassification}
            handleChange={handleChangeValue}
            optionData={classifications.map((classificationInfo, index) => (
              <option key={index} value={classificationInfo.description}>
                {classificationInfo.description}
              </option>
            ))}
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
