"use client";
import React, { useState, useEffect } from "react";
import AuthLayout from "../shared-components/auth-components/AuthLayout";
import PrimaryInput from "../shared-components/inputs/PrimaryInput";
import AuthButtons from "../shared-components/buttons/AuthButtons";
import Link from "next/link";
import { AxiosGet, AxiosPost } from "../../services/http-service";
import {
  CLIENT_TIN_VALIDATION_ERROR,
  TIN_VALIDATION_ERROR,
} from "../../utils/constants";
import VerifyInput from "../shared-components/inputs/VerifyInput";
import { toast } from "react-toastify";
import { FaAngleLeft } from "react-icons/fa";

const RegisterPage = () => {
  const [tinDetails, setTinDetials] = useState({});

  const [showNextComponent, setShowNextComponent] = useState(false);

  const [registrationButtonIsDisabled, setRegistrationButtonIsDisabled] =
    useState(true);

  const verifyTin = async () => {
    //delete the following lines later
    setShowNextComponent(true);

    const TIN = registerationDetails.taxIdentificationNumber;
    const dob = registerationDetails.dateOfBirth;
    const requestBody = { TIN, dob, bvn: "" };

    const tinValidationURL = `https://fcttaxportal.fctirs.gov.ng/api/TIN`;
    const taxIDValidationResponse = await AxiosPost(
      tinValidationURL,
      requestBody
    );
    const { data } = taxIDValidationResponse;

    // if (data.message == TIN_VALIDATION_ERROR) {
    //   toast.error(CLIENT_TIN_VALIDATION_ERROR);
    //   return;
    // }

    // // setTinDetials({ ...data });
    setTinDetials({
      response: "ok",
      uid: "1053249494",
      sid: "something",
      amount: 100.0,
      name: "JAMES OLANREWAJU OLUKOTUN",
      email: "james.olukotun@fctirs.gov.ng",
      phoneNumber: "NA",
      message: "Valid TIN",
    });
    setShowNextComponent(true);

    return true;
  };

  const [registerationDetails, setRegistrationDetails] = useState({
    taxIdentificationNumber: "",
    dateOfBirth: "",
    password: "",
  });

  const handleShowNextComponent = (e) => {
    e.preventDefault();
    const { taxIdentificationNumber, email, password } = registerationDetails;
    const isFormValid = taxIdentificationNumber && email && password;
    setRegistrationButtonIsDisabled(!isFormValid);
    setShowNextComponent(true);
  };

  const updateRegistrationDetails = (e) => {
    const name = e.target.name;
    setRegistrationDetails((previousValue) => ({
      ...previousValue,
      [name]: e.target.value,
    }));

    setRegistrationButtonIsDisabled(false);
  };

  const submitRegistrationRequest = async (e) => {
    e.preventDefault();
    return await verifyTin();
  };

  const completeRegistration = async (e) => {
    e.preventDefault();
    console.table(tinDetails);
    const requestBody = {
      FirstName: tinDetails.FirstName,
      LastName: tinDetails.LastName,
      DateOfBirth: tinDetails.DateOfBirth,
      ChangePassword: true,
      IsActive: true,
      Email: tinDetails.Email,
      Password: "Olanrewaju01.",

      // Address: "Abuja",
      // City: "Abuja",
      // StateId: "22",
      // CountryId: "1",
      // LGAId: "259",
      // PrimaryPhone: "08000000000",
      // CreateDate: "2025-02-07",
      // UserName: taxIDValidationResponse
    };

    const registrationResponse = await AxiosPost(
      "https://fcttaxportal.fctirs.gov.ng/api/userManagement/Create",
      requestBody
    );

    console.log("--------->>>> ", registrationResponse);
  };

  useEffect(() => {
    const { taxIdentificationNumber, dateOfBirth, password } =
      registerationDetails;
    setRegistrationButtonIsDisabled(
      !(taxIdentificationNumber && dateOfBirth && password)
    );
  }, [registerationDetails]);

  return (
    <AuthLayout>
      <div className="w-full">
        <section className="flex justify-between items-center py-5 mt-20 gap-8">
          <div className=" max-w-[600px] w-full hidden lg:flex flex-col justify-between ">
            <article className="w-full">
              <h3 className="text-white font-bold text-5xl w-full">
                Create New Account
              </h3>
              <div className="w-full lg:flex mt-5 hidden gap-1">
                <p className="text-base">Already have an account?</p>
                <Link href="/login" className="text-pumpkin text-base">
                  Login.
                </Link>
              </div>
            </article>

            <div className="w-full mt-16">
              <div className="w-full border-[3px] border-pumpkin max-w-[100px]"></div>
              <p className=" text-base leading-normal mt-3">
                Payment aggregation system.
              </p>
            </div>
          </div>
          {/*  */}

          <div className="w-full sm:max-w-[450px] mx-auto py-8 px-10 rounded-[28px] bg-[rgba(255,255,255,0.5)]">
            <h3
              className={` font-bold sm:text-4xl capitalize text-center text-2xl `}
            >
              {showNextComponent ? (
                <span className="flex items-center  gap-6 w-full">
                  <button onClick={() => setShowNextComponent(false)}>
                    <FaAngleLeft />
                  </button>

                  <span className="w-full">Verify Details</span>
                </span>
              ) : (
                "Register"
              )}
            </h3>

            {showNextComponent ? (
              <form
                className="w-full my-5 max-h-[350px] overflow-y-auto customScroll"
                onSubmit={completeRegistration}
              >
                <VerifyInput
                  disabled={true}
                  label="Tax Identification Number"
                  value={tinDetails.uid}
                />
                <VerifyInput
                  disabled={true}
                  label="fullname"
                  value={tinDetails.name}
                />
                <VerifyInput
                  disabled={true}
                  label="email"
                  value={tinDetails.email}
                />
                {/* <VerifyInput disabled={true} label="BVN" value="323456789" /> */}
                {/* <VerifyInput
                  disabled={true}
                  label="Date of birth"
                  value="23/04/2024"
                /> */}
                {/* <VerifyInput disabled={true} label="tax office" value="KUB" /> */}

                <AuthButtons isDisabled={false} label="Confirm Registration" />
              </form>
            ) : (
              <form
                className="w-full my-5"
                onSubmit={submitRegistrationRequest}
              >
                <PrimaryInput
                  label="TIN"
                  name="taxIdentificationNumber"
                  type="text"
                  placeholder="N123456789"
                  handleChange={updateRegistrationDetails}
                />
                <PrimaryInput
                  label="Date of Birth / Date of Incoporation (non individual)"
                  name="dateOfBirth"
                  type="date"
                  placeholder="Date of Birth / Date of Incoporation (non individual)"
                  handleChange={updateRegistrationDetails}
                />
                {/* <PrimaryInput
                  label="email"
                  name="email"
                  type="text"
                  placeholder="abc@gmail.com"
                  handleChange={updateRegistrationDetails}
                /> */}
                <PrimaryInput
                  label="password"
                  name="password"
                  type="password"
                  placeholder="********"
                  handleChange={updateRegistrationDetails}
                />

                <AuthButtons
                  isDisabled={registrationButtonIsDisabled}
                  label="register"
                />
              </form>
            )}
          </div>
        </section>

        <div className="w-full flex justify-center lg:hidden gap-1">
          <p className="">Already have an account?</p>
          <Link href="/login" className="text-pumpkin">
            Login.
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
