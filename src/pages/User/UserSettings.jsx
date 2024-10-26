import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Avatar,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { GetUserInfo, RequestDeleteAccount, UpdateUserInfo } from "../../service/UserService";
import { toast, Zoom } from "react-toastify";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { useNavigate } from "react-router-dom";
import UserChangePassword from "./UserChangePassword";

export const UserProfile = () => {
  const authHeader = useAuthHeader();
  const navigate = useNavigate();
  const signOut = useSignOut();
  const [profileImage, setProfileImage] = useState(
    "/path/to/profile/picture.jpg"
  );
  const [userData, setUserData] = useState({
    userId: "",
    email: "alexarawles@gmail.com",
    username: "Alexa Rawles",
    fullName: "Alexa Rawles",
    userAddress: "Japan",
    currentPaymentMethod: "COD",
    userImage: "",
  });
  const [initialData, setInitialData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await GetUserInfo(authHeader);
        const userInfo = response.data;
        const userInfoData = {
          userId: userInfo.userId || "No Id",
          email: userInfo.email || "No Email",
          username: userInfo.username || "No Name",
          fullName: userInfo.fullName || "No Full Name",
          userAddress: userInfo.address || "No Address",
          currentPaymentMethod: userInfo.currentPaymentMethod || "Order first!",
          userImage: userInfo.userImage || "No image",
        };
        setUserData(userInfoData);
        setProfileImage(userInfo.userImage);
        setInitialData(userInfoData);
      } catch (error) {
      }
    };

    fetchUserInfo();
  }, [authHeader]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleRequestDelete = () => {
    try {
      const response = RequestDeleteAccount(authHeader);
      toast.success(response?.data?.message || "Request delete account successfully!", {
        position: "top-center",
        transition: Zoom,
      })
      signOut();
    } catch (error) {
      toast.error(error?.data?.message || "Error request delete account!", {
        position: "top-center",
        transition: Zoom,
      })
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // Store the selected file
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result); // Display the selected image
      };
      reader.readAsDataURL(file);
    }
  };

  const hasChanges = () => {
    return (
      JSON.stringify(initialData) !== JSON.stringify(userData) ||
      selectedFile !== null
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedFile) {
      const uploadPromise = new Promise(async (resolve, reject) => {
        try {
          const formData = new FormData();
          formData.append("image", selectedFile);

          const uploadResponse = await fetch(
            "https://api.imgbb.com/1/upload?key=387abfba10f808a7f6ac4abb89a3d912",
            {
              method: "POST",
              body: formData,
            }
          );

          const uploadResult = await uploadResponse.json();

          if (uploadResult.success) {
            const imageUrl = uploadResult.data.url;

            const updatedUserData = {
              ...userData,
              userImage: imageUrl,
            };
            UpdateUserInfo(updatedUserData, authHeader);
            resolve(updatedUserData);
          } else {
            reject(new Error("Failed to upload image"));
          }
        } catch (error) {
          reject(error);
        }
      });

      toast.promise(
        uploadPromise,
        {
          pending: "Uploading image...",
          success: "Profile updated successfully!",
          error: {
            render({ data }) {
              return data.message || "An error occurred during image upload.";
            },
          },
        },
        {
          position: "top-center",
          transition: Zoom,
        }
      );
    } else {
      try {
        const updatedOriginImageData = {
          ...userData,
        };
        const response = UpdateUserInfo(updatedOriginImageData, authHeader);
        toast.success(
          response || "Profile updated successfully!",
          {
            position: "top-center",
            transition: Zoom,
          }
        );
      } catch (error) {
        console.log(error);
        toast.error("Error update profile: " + error, {
          position: "top-center",
          transition: Zoom,
        });
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="row" alignItems="center" mt={5}>
        <Box
          sx={{
            position: "relative",
            display: "inline-block",
            width: 100,
            height: 100,
          }}
        >
          <Avatar
            alt="Profile Picture"
            src={profileImage}
            sx={{ width: 100, height: 100 }}
          />
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="profile-image-upload"
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="profile-image-upload">
            <IconButton
              color="primary"
              component="span"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                opacity: 0,
                transition: "opacity 0.3s ease-in-out",
                "&:hover": {
                  opacity: 1,
                },
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <PhotoCamera sx={{ color: "white" }} />
            </IconButton>
          </label>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="left" px={3}>
          <Typography variant="h5" mt={2}>
            {userData.fullName}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {userData.email}
          </Typography>
        </Box>
      </Box>
      <Box component="form" mt={3} onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          value={userData.email}
          readOnly={true}
        />
        <TextField
          fullWidth
          margin="normal"
          label="UserName"
          name="username"
          value={userData.username}
          onChange={handleInputChange}
          readOnly={true}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Full Name"
          name="fullName"
          value={userData.fullName}
          onChange={handleInputChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Address"
          name="address"
          value={userData.userAddress}
          onChange={handleInputChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Payment"
          name="payment"
          value={userData.currentPaymentMethod}
          onChange={handleInputChange}
          readOnly={true}
        />
        <Box display="flex" justifyContent="center" gap={3} mt={3}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              boxShadow: "none",
              width: "150px",
              textTransform: "none",
              borderRadius: "8px",
              backgroundColor: "green"
            }}
            disabled={!hasChanges()} // Disable save button if no changes
          >
            Save
          </Button>
          <UserChangePassword/>
          <Button
            variant="contained"
            color="error"
            sx={{
              boxShadow: "none",
              width: "170px",
              textTransform: "none",
              borderRadius: "8px",
            }}
            onClick={handleRequestDelete}
          >
            Delete account
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default UserProfile;
