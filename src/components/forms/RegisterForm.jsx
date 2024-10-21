import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { RegisterUser } from "../../service/AuthService";
import { LoginGooglebtn, RegisterBtn } from "../buttons/Button";
import { Divider } from "@mui/material";
import { toast, Zoom } from "react-toastify";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  // Yup validation schema
  const validationSchema = Yup.object({
    username: Yup.string()
      .required("Username is required")
      .min(7, "Username must be at least 7 characters")
      .matches(
        /^[a-zA-Z0-9]*$/,
        "Username cannot contain special characters or spaces"
      ),
    fullname: Yup.string().required("Full name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*\d)[a-z\d]{8,}$/,
        "Password must contain at least one number and be at least 8 characters long"
      ),
    // .matches(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
    //   "Password must contain one uppercase, one lowercase, and one number"
    // ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Please confirm your password"),
  });

  const onSubmit = async (values) => {
    try {
      await RegisterUser(values, navigate);
    } catch (error) {
      toast.error("Error during registration: " + error.message, {
        position: "top-center",
        transition: Zoom,
      });
    }
  };

  return (
    <div>
      <h2 className="font-poppins text-5xl mb-6 text-left">Register</h2>
      <Formik
        initialValues={{
          username: "",
          fullname: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6">
            <div>
              <label className="block mb-2 text-gray-500 text-xl">
                Username
              </label>
              <Field
                type="text"
                name="username"
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 outline-none text-lg"
              />
              <ErrorMessage
                name="username"
                component="p"
                className="text-red-500 text-sm"
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-500 text-xl">
                Full name
              </label>
              <Field
                type="text"
                name="fullname"
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 outline-none text-lg"
              />
              <ErrorMessage
                name="fullname"
                component="p"
                className="text-red-500 text-sm"
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-500 text-xl">Email</label>
              <Field
                type="email"
                name="email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 outline-none text-lg"
              />
              <ErrorMessage
                name="email"
                component="p"
                className="text-red-500 text-sm"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xl text-gray-500">Password</label>
                <button
                  type="button"
                  className="flex items-center text-gray-500 text-xl"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? (
                    <>
                      <BiSolidHide className="mr-1 text-3xl text-gray-500" />
                      Hide
                    </>
                  ) : (
                    <>
                      <BiSolidShow className="mr-1 text-3xl text-gray-500" />
                      Show
                    </>
                  )}
                </button>
              </div>
              <Field
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 transition-all duration-200 outline-none text-lg text-gray-700"
              />
              <ErrorMessage
                name="password"
                component="p"
                className="text-red-500 text-sm"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xl text-gray-500">
                  Confirm Password
                </label>
                <button
                  type="button"
                  className="flex items-center text-gray-500 text-xl"
                  onClick={toggleShowConfirmPassword}
                >
                  {showConfirmPassword ? (
                    <>
                      <BiSolidHide className="mr-1 text-3xl text-gray-500" />
                      Hide
                    </>
                  ) : (
                    <>
                      <BiSolidShow className="mr-1 text-3xl text-gray-500" />
                      Show
                    </>
                  )}
                </button>
              </div>
              <Field
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 transition-all duration-200 outline-none text-lg text-gray-700"
              />
              <ErrorMessage
                name="confirmPassword"
                component="p"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="agreeTerm flex flex-row">
              <Field
                type="checkbox"
                name="agreeTerms"
                required
                className="mr-2 checkbox"
              />
              <p className="text-left text-xl">
                By continuing, you agree to the{" "}
                <Link className="underline font-semibold">Terms of Use</Link>{" "}
                and{" "}
                <Link className="underline font-semibold">Privacy Policy</Link>
              </p>
            </div>
            <RegisterBtn disabled={isSubmitting} />
          </Form>
        )}
      </Formik>
      <div className="otherLogin flex flex-col pt-10">
        <Divider>Or</Divider>
        <div className="loginWithGoogle flex pt-5 justify-center">
          <LoginGooglebtn />
        </div>
      </div>
    </div>
  );
}
