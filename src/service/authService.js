import { jwtDecode } from "jwt-decode";
import { toast, Zoom } from "react-toastify";
import { apiClient } from "../core/api"; // Import apiClient from your api.js

export const LoginUser = async (
  data,
  navigate,
  signIn
) => {
  const loginPromise = apiClient.post("/api/auth/login", {
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
            const errorMessage =
              data.response.data?.message ||
              "An error occurred. Please try again.";
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

    const user = jwtDecode(response.data.token);
    signIn({
      auth: {
        token: response.data.token,
        type: 'Bearer',
      },
      userState: {
        username: data.username,
        userImage: user.image,
        role: user.role?.[0]?.authority,
      },
    });

    navigate("/");
  } catch (error) {
    throw new Error(
      error.response?.data.message || "An error occurred. Please try again."
    );
  }
};

export const RegisterUser = async (data, navigate) => {
  try {
    const response = await apiClient.post("/api/auth/register", {
      username: data.username,
      fullName: data.fullname,
      email: data.email,
      passwordHash: data.password,
    });
    toast.success(response.data.message || "Register successful!", {
      position: "top-center",
      transition: Zoom,
    });
    navigate("/register/confirm");
  } catch (error) {
    if (error.response.data.message) {
      toast.error(error.response.data.message, {
        position: "top-center",
        transition: Zoom,
      });
      throw new Error(error.response.data);
    } else {
      throw new Error("An error occurred. Please try again.");
    }
  }
};

export const HandleForgotPassword = async (data, navigate) => {
  try {
    const response = await apiClient.post("/api/auth/forgotPassword", {
      email: data,
    });

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

export const HandleLoginGoogle = async (
  accessToken,
  navigate,
  signIn
) => {
  try {
    const response = await apiClient.get(
      `/api/auth/google-callback?token=${accessToken}`
    );
    const user = jwtDecode(response.data.token);
    signIn({
      auth: {
        token: response.data.token,
        type: 'Bearer',
      },
      userState: {
        username: user.username,
        userImage: user.image,
        role: user.role?.[0]?.authority,
      },
    });

    // Navigate to home
    navigate("/");
  } catch (error) {
    console.error("Error in HandleLoginGoogle:", error);
  }
};
