import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { loginForStaffAndAdmin } from "../service/authService.js"; // Import authService
import useSignIn from "react-auth-kit/hooks/useSignIn";

const LoginForStaffAndAdmin = () => {
  const [username, setUsername] = useState("");
  const [passwordHash, setPasswordHash] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const signIn = useSignIn();
  const navigate = useNavigate();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginForStaffAndAdmin(
        { username, password: passwordHash },
        navigate,
        signIn
      );
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Staff/Admin Login
        </h2>
        <form
          onSubmit={handleLogin}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              placeholder="Enter username"
              required
            />
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label
                className="block text-gray-700 text-sm font-bold"
                htmlFor="password"
              >
                Password
              </label>
              <button
                type="button"
                onClick={toggleShowPassword}
                className="flex items-center text-gray-500 text-sm"
              >
                {showPassword ? (
                  <>
                    <BiSolidHide className="mr-1 text-2xl" /> Hide
                  </>
                ) : (
                  <>
                    <BiSolidShow className="mr-1 text-2xl" /> Show
                  </>
                )}
              </button>
            </div>

            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={passwordHash}
              onChange={(e) => setPasswordHash(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              placeholder="Enter password"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForStaffAndAdmin;
