import { apiClient } from "../core/api";
import { toast, Zoom } from "react-toastify";

export const GetUserInfo = (authHeader) => {
  try {
    const response = apiClient.get("/api/account/me", {
      headers: {
        Authorization: authHeader,
      },
    });
    return response;
  } catch (error) {
    if (error.message) {
      toast.error(error.message, {
        position: "bottom-center",
        transition: Zoom,
      });
      throw new Error(error.response);
    } else {
      throw new Error("An error occurred. Please try again.");
    }
  }
};

export const UpdateUserInfo = (data, authHeader) => {
  try {
    apiClient.put(
      "/api/account",
      {
        userId: data.userId,
        username: data.username,
        userImage: data.userImage,
        fullName: data.fullName,
        userAddress: data.userAddress,
      },
      {
        headers: {
          Authorization: authHeader
        }
      }
    );
  } catch (error) {
    console.log(error?.data);
  }
};

export const RequestDeleteAccount = (authHeader) => {
  apiClient
    .post(
      "/api/account/request-delete",
      {},
      {
        headers: {
          Authorization: authHeader,
        },
      }
    )
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error?.data);
      toast.error(error?.data?.message || "Error request delete account", {
        position: "top-center",
        transition: Zoom,
      });
    });
};

export const ChangePassword = async (data, authHeader, email) => {
  try {
    const response = await apiClient.post("/api/auth/reset-password", {
      email: email,
      newPassword: data.newPassword,
      oldPassword: data.currentPassword,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const GetNotifications = async (authHeader) => {
  try {
    const response = apiClient.get("/api/notifications", {
      headers: {
        Authorization: authHeader,
      },
    });
    return response;
  } catch (error) {
    console.log(error?.data);
  }
};
