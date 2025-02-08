import React from "react";
import AuthHeader from ".";

const AuthLayout = ({ children }) => {
  return (
    <section className=" w-full custom-bg text-white">
      <div className="bg-[rgba(0,0,0,0.9)] min-h-screen">
        <div className="w-[90%] mx-auto xl:max-w-[1200px] xl:w-full  h-full py-6">
          <AuthHeader />
          {children}
        </div>
      </div>
    </section>
  );
};

export default AuthLayout;
