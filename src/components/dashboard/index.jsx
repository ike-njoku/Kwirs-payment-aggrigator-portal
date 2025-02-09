import React from "react";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import DashCard from "./DashCard";
import DashProfileCard from "./DashProfileCard";
import { FaCaretDown, FaPlus } from "react-icons/fa";

const UserDashboard = () => {
  return (
    <DashboardLayout>
      <section className="w-full h-full mt-5">
        <div className="w-[90%] mx-auto xl:max-w-[1140px] lg:py-10">
          <section className="flex flex-col gap-8 w-full lg:flex-row justify-between">
            <div className="w-full flex overflow-x-auto flex-nowrap lg:max-w-[500px] border-2 border-gray-200 rounded-[28px] p-6 gap-8 lg:flex-col lg:flex-wrap">
              {/*  */}
              <div className="lg:mt-3 lg:w-full shrink-0 lg:shrink-[unset] w-fit">
                <h3 className="font-semibold text-xl lg:text-2xl capitalize mb-3">
                  total payments
                </h3>
                <DashCard />
              </div>

              <div className="w-fit lg:w-full lg:mt-6 shrink-0 lg:shrink-[unset]">
                <h3 className="font-semibold text-xl lg:text-2xl capitalize mb-3">
                  Profile
                </h3>
                <DashProfileCard />
              </div>
            </div>

            <div className="lg:max-w-[500px] w-full border-2 border-gray-200 rounded-[28px] p-6 gap-8">
              {/* create transaction */}
              <section className="w-full mb-3 flex justify-end items-center gap-5">
                <button
                  id="dropdownBgHoverButton"
                  data-dropdown-toggle="dropdownBgHover"
                  className="text-pumpkin focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center  relative  gap-2 border border-pumpkin"
                  type="button"
                >
                  New Transaction
                  <FaPlus />
                </button>
              </section>
              <div className="w-full flex items-center justify-between">
                <article className="flex flex-col">
                  <h3 className="font-semibold text-xl lg:text-2xl capitalize mb-3">
                    Transactions
                  </h3>

                  <div className="flex items-center gap-2">
                    <h3 className="text-base capitalize flex items-center gap-2">
                      sort by:{" "}
                      <span className="text-pumpkin text-base">Recently</span>
                    </h3>
                    <FaCaretDown />
                  </div>
                </article>
              </div>
            </div>
          </section>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default UserDashboard;
