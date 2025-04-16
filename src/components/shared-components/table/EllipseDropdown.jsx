import React from "react";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";

const EllipseDropdown = ({
  handleDelete,
  handleEdit,
  id,
  setSelectedItem,
  item,
  showDelete = true, // Default to true (shows delete button)
}) => {
  const editItem = () => {
    handleEdit(item); // Pass the item to edit
    setSelectedItem(item);
  };

  const deleteItem = () => {
    handleDelete(item); // Pass the item to delete
    setSelectedItem(id);
  };

  return (
    <section className="flex items-center gap-4">
      <button onClick={editItem} className="text-gray-700 hover:text-gray-900">
        <FaRegEdit />
      </button>

      {/* Only show delete button if showDelete is true */}
      {showDelete && (
        <button
          onClick={deleteItem}
          className="text-red-400 hover:text-red-600"
        >
          <FaTrashAlt />
        </button>
      )}
    </section>
  );
};

export default EllipseDropdown;
