"use client";
import React, { useState } from "react";
import { IoFilter } from "react-icons/io5";

const DropdownFilter = () => {
  const [openDropdown, setOpenDropdown] = useState(false);

  const toggleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };
  return (
    <section className="">
      <button
        id="dropdownBgHoverButton"
        data-dropdown-toggle="dropdownBgHover"
        className="text-pumpkin focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center  relative  gap-2 border border-pumpkin"
        type="button"
        onClick={toggleDropdown}
      >
        Filter
        <IoFilter />
      </button>

      <div
        id="dropdownBgHover"
        className={`z-10 absolute mt-3 w-48 bg-white rounded-lg shadow-sm ${
          openDropdown ? "" : "hidden"
        }`}
      >
        <ul
          className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownBgHoverButton"
        >
          {["Recent", "Latest", "Previous"].map((option, i) => (
            <li key={i}>
              <div className="flex items-center p-2 rounded-sm hover:bg-pumpkin hover:text-white text-gray-600">
                <input
                  id={`checkbox-item-${i}`}
                  type="checkbox"
                  value=""
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm"
                />
                <label
                  htmlFor={`checkbox-item-${i}`}
                  className="w-full ms-2 text-sm font-medium rounded-sm "
                >
                  {option}
                </label>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default DropdownFilter;
