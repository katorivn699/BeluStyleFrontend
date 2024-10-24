import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
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
    apiClient
      .put(
        "/api/account",
        {
          userId : data.userId,
          username: data.username,
          userImage: data.userImage,
          fullName: data.fullName,
          userAddress: data.userAddress,
        },
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
        toast.error("Error Update User Info: " + error?.message, {
          position: "top-center",
          transition: Zoom,
        });
      });
};

export const RequestDeleteAccount = (authHeader) => {
  apiClient.post("/api/request-delete",
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
    toast.error(error?.data?.message || "Error request delete account", {
      position: "top-center",
      transition: Zoom,
    })
  })
}

export const ChangePassword = (data , authHeader, email) => {
  apiClient.post("/api/auth/reset-password", {
    mail: email,
    NewPassword: data.newPassword,
    OldPassword: data.currentPassword
  }, {
    headers: {
      Authorization: authHeader
    }
  }
)
}
