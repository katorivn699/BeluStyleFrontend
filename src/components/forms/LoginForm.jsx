import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";

import { LoginUser } from "../../service/AuthService";
import { GoogleLoginButton, LoginBtn } from "../buttons/Button";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { Divider } from "@mui/material";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const signIn = useSignIn();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    try {
      await LoginUser(data, navigate, signIn);
    } catch (error) {
      // toast.error(error.message, {
      //   position: "top-center",
      //   });
    }
  };
  const handleRememberMeChange = () => {
    setRememberMe((prev) => !prev);
  };

  return (
    <div className="pt-20">
      <h2 className="font-poppins text-5xl mb-6 text-left">Login</h2>{" "}
      {/* Increase font size */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block mb-2 text-gray-500 text-xl">
            {/* Increase font size */}
            Username
          </label>
          <input
            type="text"
            tabIndex={1}
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 outline-none text-lg" // Increase padding and font size
            {...register("username", {
              required: "Username can't be blank", // Thông báo khi trường bị bỏ trống
              minLength: {
                value: 7,
                message: "Username must be at least 7 characters", // Thông báo yêu cầu ít nhất 7 ký tự
              },
              pattern: {
                value: "[a-zA-Z0-9]+$",
                message:
                  "Only letters and numbers are allowed. No special characters or email (no '@' allowed).",
              },
            })}
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username.message}</p>
          )}
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xl text-gray-500">Password</label>{" "}
            {/* Increase font size */}
            <button
              type="button"
              className="flex items-center text-gray-500 text-xl swap"
              onClick={toggleShowPassword}
            >
              {showPassword ? (
                <>
                  <BiSolidHide className="mr-1 text-3xl text-gray-500" /> Hide
                </>
              ) : (
                <>
                  <BiSolidShow className="mr-1 text-3xl text-gray-500" /> Show
                </>
              )}
            </button>
          </div>
          <input
            type={showPassword ? "text" : "password"}
            tabIndex={2}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 transition-all duration-200 outline-none text-lg text-gray-700" // Increase padding and font size
            {...register("password", {
              required: "Password is required",
              pattern: {
                value:
                  "(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
                message:
                  "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
              },
              minLength: {
                value : 7,
                message: "Password must be at least 7 characters"
              }
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={handleRememberMeChange}
            className="mr-2"
          />
          <label htmlFor="rememberMe" className="text-gray-500 text-xl">
            Remember Me
          </label>
        </div>
        <p className="text-left text-xl">
          By continuting, you argee to the{" "}
          <Link className="underline font-semibold">Term of use</Link> and{" "}
          <Link className="underline font-semibold">Privacy Policy</Link>{" "}
        </p>
        <LoginBtn tabindex="3"></LoginBtn>
      </form>
      <div className="OtherFeature pt-10 flex justify-center">
        <Link to="/forgotPassword">
          <p className="font-semibold font-montserrat underline">
            Forgot password?
          </p>
        </Link>
      </div>
      <div className="register flex justify-center pt-5">
        <p className="font font-montserrat">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="underline font-medium font-montserrat"
          >
            Sign up
          </Link>
        </p>
      </div>
      <div className="otherLogin flex flex-col pt-10">
        <Divider>Or continue with</Divider>
        <div className="loginWithGoogle flex pt-10 justify-center">
          <GoogleLoginButton signIn={signIn} />
        </div>
      </div>
    </div>
  );
}
