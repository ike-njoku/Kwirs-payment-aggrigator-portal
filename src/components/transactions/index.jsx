import React from "react";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import { FaPlus, FaCaretDown } from "react-icons/fa";
import TransctionComponent from "../dashboard/TransctionComponent";
import Link from "next/link";

const TransactionPage = () => {
  return (
    <DashboardLayout page="Transactions">
      <section className="w-full h-full mt-5">
        <div className="w-[90%] mx-auto xl:max-w-[1140px] lg:py-10">
          <section className="w-full mb-3 flex justify-end items-center gap-5">
            <Link
              href="/transactions/new"
              id="dropdownBgHoverButton"
              data-dropdown-toggle="dropdownBgHover"
              className="text-pumpkin focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center  relative  gap-2 border border-pumpkin"
              type="button"
            >
              New Payment
              <FaPlus />
            </Link>
          </section>

          <div className="w-full flex items-center justify-between">
            <article className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="text-base capitalize flex items-center gap-2">
                  sort by:{" "}
                  <span className="text-pumpkin text-base">Recently</span>
                </h3>
                <FaCaretDown />
              </div>
            </article>
          </div>

          <TransctionComponent />
        </div>
      </section>
    </DashboardLayout>
  );
};

export default TransactionPage;
