"use client";
import React, { useState } from "react";

const InventoryFilter = ({ filterData, setFilterKey, filterOption }) => {
  const [filterOptionData, setFilterOptionData] = useState();
  const handleChangeFilter = (e) => {
    const { value } = e.target;

    setFilterOptionData(value);
    setFilterKey({
      filterOption,
      filterValue: value,
    });
  };
  return (
    <li className="flex items-center justify-between w-full max-w-[200px] border-2 border-pumpkin dark:border-darkPumpkin2 text-pumpkin dark:text-darkPumpkin2 rounded-lg p-2 relative">
      <select
        className="bg-transparent text-sm outline-none capitalize"
        value={filterOptionData}
        onChange={handleChangeFilter}
      >
        <option value="" className="capitalize text-sm p-2">
          Filter by {filterOption}
        </option>
        {filterData}
      </select>
    </li>
  );
};

export default InventoryFilter;
