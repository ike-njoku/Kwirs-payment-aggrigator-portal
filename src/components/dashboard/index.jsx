import React from "react";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import DashCard from "./DashCard";

const UserDashboard = () => {
  return (
    <DashboardLayout>
      <section className="w-full h-full">
        <div className="w-[90%] mx-auto xl:max-w-[1140px] lg:py-10">
          <section className="flex flex-col gap-8 w-full lg:flex-row justify-between">
            <div className="w-full lg:max-w-[500px] border-2 border-gray-200 rounded-[28px] p-6 ">
              <h3 className="font-semibold text-xl lg:text-2xl capitalize mb-3">
                total payments
              </h3>
              <DashCard />
            </div>
            <div className="lg:max-w-[500px] w-full"></div>
          </section>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default UserDashboard;
