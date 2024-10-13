import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { RegisterUser } from "../../service/AuthService";
import { GoogleLoginButton } from "../buttons/Button";
import { toast, Zoom } from "react-toastify";

export function RegisterForm() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const password = watch("password");

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const onSubmit = async (data) => {
    try {
      await RegisterUser(data, navigate);
    } catch (error) {
      // console.error("Error during login:", error.message);
      toast.error("Error during login:" + error.message, {
        position: "top-center",
        transition: Zoom,
      });
    }
  };

  return (
    <div>
      <h2 className="font-poppins text-5xl mb-6 text-left">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block mb-2 text-gray-500 text-xl">Username</label>
          <input
            type="text"
            tabIndex={1}
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 outline-none text-lg"
            {...register("username", { required: "Username is required" })}
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-2 text-gray-500 text-xl">Full name</label>
          <input
            type="text"
            tabIndex={1}
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 outline-none text-lg"
            {...register("fullname", { required: "Full name is required" })}
          />
          {errors.fullname && (
            <p className="text-red-500 text-sm">{errors.fullname.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-2 text-gray-500 text-xl">Email</label>
          <input
            type="email"
            tabIndex={1}
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 outline-none text-lg"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
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
          <input
            type={showPassword ? "text" : "password"}
            tabIndex={2}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 transition-all duration-200 outline-none text-lg text-gray-700"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xl text-gray-500">Confirm Password</label>
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
          <input
            type={showConfirmPassword ? "text" : "password"}
            tabIndex={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 transition-all duration-200 outline-none text-lg text-gray-700"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
          )}
        </div>
        <div className="agreeTerm flex flex-row">
          <input type="checkbox" id="rememberMe" required className="mr-2 checkbox" />
          <p className="text-left text-xl">
            By continuing, you agree to the{" "}
            <Link className="underline font-semibold">Terms of Use</Link> and{" "}
            <Link className="underline font-semibold">Privacy Policy</Link>
          </p>
        </div>
        <button
          type="submit"
          tabIndex={3}
          className="w-full btn btn-active hover:btn-neutral rounded-full text-xl transition-colors duration-300 ease-in-out"
        >
          Register
        </button>
      </form>
      <div className="otherLogin flex flex-col pt-10">
        <div className="divider">Or</div>
        <div className="loginWithGoogle flex pt-5 justify-center">
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
}
