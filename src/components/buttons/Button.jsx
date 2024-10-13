import React, { useState } from "react";
import { FaCartPlus, FaShareAlt } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import { HandleLoginGoogle } from "../../service/AuthService";
import { Link, useNavigate } from "react-router-dom";

export function AddToCart({ onClick, tabindex = "0" }) {
  return (
    <button
      onClick={onClick}
      tabIndex={tabindex}
      className="bg-white text-blue-500 font-bold py-2 px-4 rounded flex items-center mx-2 hover:bg-gray-50 transition-opacity duration-300"
    >
      <FaCartPlus className="mr-2" />
      Add to cart
    </button>
  );
}

export function Share({ onClick, tabindex = "0" }) {
  return (
    <button
      onClick={onClick}
      tabIndex={tabindex}
      className="bg-transparent text-white font-bold py-2 px-4 rounded flex items-center mx-2 transition-opacity duration-300 hover:bg-zinc-500 bg-opacity-20"
    >
      <FaShareAlt className="mr-2" /> Share
    </button>
  );
}

export function ShowMore({ onClick, tabindex = "0" }) {
  return (
    <button
      onClick={onClick}
      tabIndex={tabindex}
      className="bg-white text-blue-700 font-bold border border-blue-700 rounded-lg py-2 px-4 flex items-center hover:bg-blue-700 hover:text-white transition duration-300"
    >
      Show More
    </button>
  );
}

export function LoginBtn({ onClick, tabindex = "0" }) {
  return (
    <button
      type="submit"
      onClick={onClick}
      tabIndex={tabindex}
      className="w-full btn btn-active hover:btn-neutral bg-base-200 rounded-full text-xl transition-colors duration-300 ease-in-out"
    >
      Login
    </button>
  );
}

export function ForgotBtn({ onClick, tabindex = "0" }) {
  return (
    <button
      type="submit"
      onClick={onClick}
      tabIndex={tabindex}
      className="w-full bg-gray-200 text-white p-4 rounded-full text-xl hover:bg-black hover:text-white transition-colors duration-300 ease-in-out"
    >
      Reset password
    </button>
  );
}

export function GoogleLoginButton({signIn}) {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const accessToken = tokenResponse.access_token;
      HandleLoginGoogle(accessToken, navigate, signIn);
    },
    scope: "openid email profile",
  });

  return (
    <button onClick={() => login()} className="google-login-button">
      <FcGoogle className="icon text-3xl" />
    </button>
  );
}

export function BtnTheme() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "pastel");

  const handleToggle = (e) => {
    const newTheme = e.target.checked ? "dark" : "pastel";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };
  return (
    <button>
      <label className="swap swap-rotate">
        <input
          type="checkbox"
          className="theme-controller"
          checked={theme === "dark"}
          onChange={handleToggle}
        />
        <svg
          className="swap-off h-8 w-8 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
        </svg>
        <svg
          className="swap-on h-8 w-8 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
        </svg>
      </label>
    </button>
  );
}

export const BuyNow = () => {
  return (
    <>
      <Link><div className="btn bg-blueOcean w-44 rounded-lg ">Buy now</div></Link>
    </>
  )
};
