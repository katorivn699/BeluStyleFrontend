import { jwtDecode } from "jwt-decode";
import { toast, Zoom } from "react-toastify";
import { apiClient } from "../core/api";

export const LoginUser = async (data, navigate, signIn) => {
  const loginPromise = apiClient
    .post("/api/auth/login", {
      username: data.username,
      passwordHash: data.password,
    })
    .then((response) => {
      const user = jwtDecode(response.data.token);

      // Check the user's role and throw an error if it's not CUSTOMER
      if (user.role?.[0]?.authority !== "CUSTOMER") {
        throw new Error("Access Denied: Only customers are allowed");
      }

      // Proceed with login if the role is CUSTOMER
      signIn({
        auth: {
          token: response.data.token,
          type: "Bearer",
        },
        userState: {
          username: data.username,
          userImage: user.image,
          role: user.role?.[0]?.authority,
        },
      });
      navigate("/");
      return response;
    });

  toast.promise(
    loginPromise,
    {
      pending: "Logging in...",
      success: "Login successful!",
      error: {
        render({ data }) {
          if (data?.message === "Access Denied: Only customers are allowed") {
            return "Access Denied: Only customers are allowed";
          }
          const errorMessage =
            data?.response?.data?.message ||
            "An error occurred. Please try again.";
          return errorMessage;
        },
      },
    },
    {
      position: "bottom-center",
      transition: Zoom,
    }
  );

  try {
    await loginPromise;
  } catch (error) {
    // Errors are handled within toast.promise, so no need for additional handling here
  }
};

export const RegisterUser = async (data, navigate) => {
  try {
    await apiClient.post("/api/auth/register", {
      username: data.username,
      fullName: data.fullname,
      email: data.email,
      passwordHash: data.password,
    });
    localStorage.setItem("mail", data.email);
    navigate("/register/confirm-registration");
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
    const response = await apiClient.post("/api/auth/forgot-password", {
      email: data.email,
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

export const HandleLoginGoogle = async (accessToken, navigate, signIn) => {
  try {
    const response = await apiClient.get(
      `/api/auth/google-callback?token=${accessToken}`
    );
    const user = jwtDecode(response.data.token);
    signIn({
      auth: {
        token: response.data.token,
        type: "Bearer",
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

export const ResetPassword = async (password, email, token, navigate) => {
  try {
    const response = await apiClient.post("/api/auth/reset-password", {
      email: email,
      newPassword: password,
      token: token,
    });
    toast.success(response.data.message, {
      position: "bottom-center",
      transition: Zoom,
    });
    navigate("/reset-password/success");
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data.message
      : error.message;
    toast.error(`Reset password error: ${errorMessage}`, {
      position: "bottom-center",
      transition: Zoom,
    });
  }
};

export const loginForStaffAndAdmin = async (data, navigate, signIn) => {
  const loginPromise = apiClient.post("/api/auth/login-for-staff-and-admin", {
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

    console.log(response.data.token);
    console.log(user);

    signIn({
      auth: {
        token: response.data.token,
        type: "Bearer",
      },
      userState: {
        username: data.username,
        userFullName: user.fullName,
        userImage: user.image,
        role: user.role?.[0]?.authority,
      },
    });

    navigate("/Dashboard");
  } catch (error) {
    throw new Error(
      error.response?.data.message || "An error occurred. Please try again."
    );
  }
};
