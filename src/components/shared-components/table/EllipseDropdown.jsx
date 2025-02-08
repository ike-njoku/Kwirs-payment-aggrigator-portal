import React from "react";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";

const EllipseDropdown = ({
  handleDelete,
  handleEdit,
  id,
  setSelectedItem,
  item,
}) => {
  const deleteItem = () => {
    handleDelete();
    setSelectedItem(id);
  };

  const editItem = () => {
    handleEdit();
    setSelectedItem(item);
  };
  return (
    <section className="flex items-center gap-4">
      <button className="" onClick={editItem}>
        <FaRegEdit />
      </button>
      <button className="text-red-400" onClick={deleteItem}>
        <FaTrashAlt />
      </button>
    </section>
  );
};

export default EllipseDropdown;
