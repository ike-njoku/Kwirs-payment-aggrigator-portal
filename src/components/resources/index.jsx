"use client";
import React, { useState } from "react";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import CustomTable from "../shared-components/table";
import { resourcesTableData } from "../../utils/table_data";
import { FaPlus } from "react-icons/fa";

const ResourcesPage = () => {
  const tableHeadings = ["Name", "Date Created", "Actions"];
  const [tableData, setTableData] = useState(resourcesTableData);

  return (
    <DashboardLayout page="Resources">
      <section className="w-full">
        <div className=" w-[90%] mx-auto py-5">
          <div className=" w-full lg:mt-10">
            {/* search bar and filter options here */}
            <section className="w-full mb-3 flex justify-end items-center gap-5 lg:justify-start">
              <button
                id="dropdownBgHoverButton"
                data-dropdown-toggle="dropdownBgHover"
                className="text-pumpkin focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center  relative  gap-2 border border-pumpkin"
                type="button"
              >
                Create Resource
                <FaPlus />
              </button>
            </section>
            {/* table */}
            <CustomTable
              tableHeadings={tableHeadings}
              tableData={tableData}
              isEllipseDropdwon={true}
            />
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default ResourcesPage;
