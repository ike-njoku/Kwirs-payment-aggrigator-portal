import React from "react";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";

const EllipseDropdown = ({ handleDelete, handleEdit }) => {
  return (
    <section className="flex items-center gap-4">
      <button className="" onClick={handleEdit}>
        <FaRegEdit />
      </button>
      <button className="text-red-400" onClick={handleDelete}>
        <FaTrashAlt />
      </button>
    </section>
  );
};

export default EllipseDropdown;
