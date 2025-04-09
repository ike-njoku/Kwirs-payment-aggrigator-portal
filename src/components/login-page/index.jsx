"use client";
import React, { useState } from "react";
import PrimaryInput from "../shared-components/inputs/PrimaryInput";
import AuthButtons from "../shared-components/buttons/AuthButtons";
import Link from "next/link";
import AuthLayout from "../shared-components/auth-components/AuthLayout";
import { AxiosPost } from "../../services/http-service";
import { toast } from "react-toastify";
import { generateAccessToken } from "../../services/auth-service";

const LoginPage = () => {
  const [authenticationDetails, setAuthenticationDetails] = useState({
    tin: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateAuthenticationDetails = (e) => {
    const name = e.target.name;
    setAuthenticationDetails((previousValue) => ({
      ...previousValue,
      [name]: e.target.value,
    }));
  };

  const storeAuthDetailsLocally = () => {
    localStorage.setItem("authDetails", JSON.stringify(authenticationDetails));
  };

  const authenticateUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const token = await generateAccessToken({
      password: authenticationDetails.password,
      username: "Admin",
      grant_type: "password",
    });

    if (!token || !token?.access_token) {
      toast.error("Could not generate access token");
      setIsLoading(false);
      return;
    }

    const _authenticationDetails = {
      Password: authenticationDetails.password,
      UserName: authenticationDetails.tin,
    };

    const authURL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/userManagement/Login`;
    const authResponse = await AxiosPost(authURL, _authenticationDetails);

    if (authResponse && authResponse.Status === "Fail") {
      toast.error("Invalid Credentials");
      setIsLoading(false);
      return;
    }

    const _authResponse = authResponse[0];
    _authResponse.UserName = authenticationDetails.tin;
    _authResponse.email = authenticationDetails.tin;
    _authResponse.Username = authenticationDetails.tin;

    if (authResponse && authResponse.password) authResponse.password = "";

    setIsLoading(false);
    storeAuthDetailsLocally(_authResponse);
    window.location.href = "/dashboard";
  };

  return (
    <AuthLayout>
      <div className="w-full">
        <section className="flex justify-between items-center py-5 mt-20 gap-8">
          <div className=" max-w-[600px] w-full hidden lg:flex flex-col justify-between ">
            <article className="w-full">
              <h3 className="text-white font-bold text-5xl">Welcome!</h3>
              <div className="w-full lg:flex mt-5 hidden gap-1">
                <p className="text-base">New User?</p>
                <Link href="/register" className="text-pumpkin text-base">
                  Register.
                </Link>
              </div>
            </article>

            <div className="w-full mt-16">
              <div className="w-full border-[3px] border-pumpkin max-w-[100px]"></div>
              <p className=" text-base leading-normal mt-3">
                Manage your tax payments seamlessly and securely.
              </p>
            </div>
          </div>
          {/*  */}
          <div className="w-full sm:max-w-[450px] mx-auto py-8 px-10 rounded-[28px] bg-[rgba(255,255,255,0.5)]">
            <h3 className="font-bold text-4xl capitalize text-center">login</h3>
            <form onSubmit={authenticateUser} className="w-full my-5">
              <PrimaryInput
                label="Tax ID"
                name="tin"
                // type="email"
                placeholder="N1234567"
                handleChange={updateAuthenticationDetails}
              />
              <PrimaryInput
                label="password"
                name="password"
                type="password"
                placeholder="********"
                handleChange={updateAuthenticationDetails}
              />

              <div className="flex justify-end">
                <Link
                  href="/reset-password"
                  className="text-pumpkin underline text-sm"
                >
                  Forgot Password?
                </Link>
              </div>

              <AuthButtons />
            </form>
          </div>
        </section>

        <div className="w-full flex justify-center lg:hidden gap-1">
          <p className="">New User?</p>
          <Link href="/register" className="text-pumpkin">
            Register.
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
