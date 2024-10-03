import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Bounce, toast } from "react-toastify";
import { useAuth } from "../store/AuthContext";
import userDefault from "../assets/images/userdefault.svg"

export const LoginUser = async (data, navigate, setIsLoggedIn, setAvatarUrl, setUsername) => {
  try {
    const response = await axios.post("http://localhost:8080/api/auth/login", {
      username: data.username,
      passwordHash: data.password,
    });

    const userData = {
      token: response.data,
    };

    localStorage.setItem("AuthToken", JSON.stringify(userData));

    const user = jwtDecode(response.data); 
    setIsLoggedIn(true);
    setAvatarUrl(user.user_image || userDefault);
    setUsername(user.username);
    navigate("/");


    toast.success(response.data.message || "Login successful!", {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
      });

    return userData;
  } catch (error) {
    if (error.response) {
      // console.error("Login failed", error.response.data);
      toast.error(error.response.data, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
        });
      throw new Error(error.response.data);
    } else {
      console.error("Login failed", error);
      toast.warn('An error occurred. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
        });
      throw new Error("An error occurred. Please try again.");
    }
  }
};

export const HandleLogin = (navigate, setIsLoggedIn) => {
  const user = localStorage.getItem("AuthToken");
  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      const token = parsedUser.token;

      if (token) {
        const decoded = jwtDecode(token);
        if (decoded.role !== null) {
          navigate("/");
          setIsLoggedIn(true);
        }
      } else {
        console.log("Token not found in user object");
      }
    } catch (error) {
      console.error("Invalid token or user data", error);
    }
  } else {
    console.log("No user found in local storage");
  }
};

export const RegisterUser = async (data, navigate) => {
  try {
    const response = await axios.post("http://localhost:8080/api/users", {
      username: data.username,
      fullName: data.fullname,
      email: data.email,
      passwordHash: data.password,
      roleId: 2,
    });
    toast.success(response.data.message || "Register successful!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
    navigate("/login")

  } catch (error) {
    if (error.response) {
      console.error("Register failed", error.response.data);
      toast.error(error.response.data, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      throw new Error(error.response.data);
    } else {
      console.error("Register failed", error);
      alert("An error occurred. Please try again.");
      throw new Error("An error occurred. Please try again.");
    }
  }
};

export const HandleForgotPassword = async (data, navigate) => {
  try {
      const response = await axios.post('http://localhost:8080/api/auth/forgotPassword', { email: data });

      const token = response.data.token;

      localStorage.setItem('ForgotAuth', token);

      navigate("/forgotPassword/success");
  } catch (error) {
      toast.error(error.response.data, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
  }
};
