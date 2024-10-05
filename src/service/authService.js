import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast, Zoom } from "react-toastify";
import userDefault from "../assets/images/userdefault.svg";

export const LoginUser = async (
  data,
  navigate,
  setIsLoggedIn,
  setAvatarUrl,
  setUsername
) => {
  const loginPromise = axios.post("http://localhost:8080/api/auth/login", {
    username: data.username,
    passwordHash: data.password,
  });

  toast.promise(
    loginPromise,
    {
      pending: "Logging in...",
      success: "Login successful!",
      error: {
        render({ data }) {
          if (data.response) {
            const errorMessage = data.response.data?.message || "An error occurred. Please try again.";
            return errorMessage;
          }
          return "An error occurred. Please try again."; 
        },
      },
    },
    {
      position: "bottom-center",
      transition: Zoom,
    }
  );

  try {
    const response = await loginPromise;

    const userData = {
      token: response.data.token,
      expire: response.data.expirationTime,
    };

    localStorage.setItem("NextAuth", JSON.stringify(userData));

    const user = jwtDecode(response.data.token);
    setIsLoggedIn(true);
    setAvatarUrl(user.image || userDefault);
    setUsername(user.sub);
    navigate("/");

    return userData;
  } catch (error) {
    console.error("Error during login:", error); 
    throw new Error(error.response?.data.message || "An error occurred. Please try again.");
  }
};


export const RegisterUser = async (data, navigate) => {
  try {
    const response = await axios.post("http://localhost:8080/api/auth/register", {
      username: data.username,
      fullName: data.fullname,
      email: data.email,
      passwordHash: data.password,
      roleId: 2,
    });
    toast.success(response.data.message || "Register successful!", {
      position: "top-center",
      transition: Zoom,
    });
    navigate("/login");
  } catch (error) {
    if (error.response) {
      console.error("Register failed", error.response.data);
      toast.error(error.response.data, {
        position: "top-center",
        transition: Zoom,
      });
      throw new Error(error.response.data);
    } else {
      // console.error("Register failed", error);
      // alert("An error occurred. Please try again.");
      throw new Error("An error occurred. Please try again.");
    }
  }
};

export const HandleForgotPassword = async (data, navigate) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/auth/forgotPassword",
      { email: data }
    );

    const token = response.data.token;

    localStorage.setItem("ForgotAuth", token);

    navigate("/forgotPassword/success");
  } catch (error) {
    toast.error(error.response.data, {
      position: "top-center",
      transition: Zoom,
    });
  }
};
