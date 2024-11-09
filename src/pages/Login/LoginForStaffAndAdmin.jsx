import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { loginForStaffAndAdmin } from "../../service/AuthService";
import useSignIn from "react-auth-kit/hooks/useSignIn";

const LoginForStaffAndAdmin = () => {
  const [username, setUsername] = useState("");
  const [passwordHash, setPasswordHash] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen bg-gradient-to-r from-white via-blue-300 to-blue-600 flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Staff/Admin Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              className="block text-sm font-semibold text-gray-600 mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow-md border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder="Enter your username"
              tabIndex={1}
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-semibold text-gray-600 mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={passwordHash}
                onChange={(e) => setPasswordHash(e.target.value)}
                className="shadow-md border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:ring-2 focus:ring-blue-500 transition duration-300"
                placeholder="Enter your password"
                tabIndex={2}
                required
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl"
              >
                {showPassword ? <BiSolidHide /> : <BiSolidShow />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              tabIndex={3}
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
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
