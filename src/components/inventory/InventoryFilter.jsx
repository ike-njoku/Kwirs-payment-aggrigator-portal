import React from "react";

import { FaCaretDown } from "react-icons/fa";
const InventoryFilter = () => {
  return (
    <ul className="my-4 w-full flex  items-center lg:justify-start flex-wrap gap-4">
      {[...Array(6)].map((item, index) => {
        return (
          <li
            key={index}
            className="flex items-center justify-between w-full max-w-[150px] border-2 border-pumpkin dark:border-darkPumpkin2 text-pumpkin dark:text-darkPumpkin2 rounded-lg p-2 relative"
          >
            <select
              name=""
              id=""
              className="bg-transparent text-sm outline-none"
            >
              <option value="" className="capitalize text-sm p-2">
                Filter by {"item class"}
              </option>
            </select>
          </li>
        );
      })}

      {/*  */}
    </ul>
  );
};

export default InventoryFilter;
