import React from "react";
import TransactionTable from "../shared-components/table/TransactionTable";
import { FaPrint, FaShareNodes } from "react-icons/fa6";

const TransctionComponent = () => {
  return (
    <>
      <section className="my-6">
        <TransactionTable />
        <section className="w-full flex justify-end gap-4 mt-6">
          <button
            id="dropdownBgHoverButton"
            data-dropdown-toggle="dropdownBgHover"
            className="text-pumpkin focus:outline-none font-medium rounded-lg text-base px-5 py-2.5 text-center hidden md:inline-flex items-center  relative  gap-2 border border-pumpkin"
            type="button"
          >
            Print <FaPrint />
          </button>

          <button
            id="dropdownBgHoverButton"
            data-dropdown-toggle="dropdownBgHover"
            className="text-white focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center md:inline-flex items-center    gap-2 border border-pumpkin bg-pumpkin hidden"
            type="button"
          >
            Share <FaShareNodes />
          </button>

          <button
            id="dropdownBgHoverButton"
            data-dropdown-toggle="dropdownBgHover"
            className="text-pumpkin focus:outline-none font-medium rounded-lg text-base px-5 py-2.5 text-center md:hidden inline-flex items-center gap-2"
            type="button"
          >
            <FaPrint />
          </button>

          <button
            id="dropdownBgHoverButton"
            data-dropdown-toggle="dropdownBgHover"
            className="text-pumpkin focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2 md:hidden"
            type="button"
          >
            <FaShareNodes />
          </button>
        </section>
      </section>
    </>
  );
};

export default TransctionComponent;
