import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Avatar,
  Typography,
  Box,
  IconButton,
  Grid2,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import {
  GetUserInfo,
  RequestDeleteAccount,
  UpdateUserInfo,
} from "../../service/UserService";
import { toast, Zoom } from "react-toastify";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { useNavigate } from "react-router-dom";
import UserChangePassword from "./UserChangePassword";
import userDefault from "../../assets/images/userdefault.webp";
import UserSideMenu from "../../components/menus/UserMenu";

export const UserProfile = () => {
  const authHeader = useAuthHeader();
  const navigate = useNavigate();
  const signOut = useSignOut();

  const [profileImage, setProfileImage] = useState(userDefault);
  const [userData, setUserData] = useState({
    userId: "",
    email: "",
    username: "",
    fullName: "",
    userAddress: "",
    currentPaymentMethod: "",
    userImage: "",
  });
  const [initialData, setInitialData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await GetUserInfo(authHeader);
        const userInfo = response.data;
        const userInfoData = {
          userId: userInfo.userId || "ID not available",
          email: userInfo.email || "Email not provided",
          username: userInfo.username || "Name not set",
          fullName: userInfo.fullName || "Full name not specified",
          userAddress: userInfo.address || "Address not provided",
          currentPaymentMethod: userInfo.currentPaymentMethod || "Place an order to add a payment method",
          userImage: userInfo.userImage || userDefault,
        };
        setUserData(userInfoData);
        setProfileImage(userInfo.userImage);
        setInitialData(userInfoData);
      } catch (error) {
        toast.error("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, [authHeader]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleRequestDelete = async () => {
    try {
      await RequestDeleteAccount(authHeader);
      toast.success("Account deletion requested successfully.", {
        position: "top-center",
        transition: Zoom,
      });

      setTimeout(() => {
        signOut();
        navigate("/");
      }, 3000);
    } catch (error) {
      toast.error("Error requesting account deletion.", {
        position: "top-center",
        transition: Zoom,
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setProfileImage(reader.result);
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
    try {
      if (selectedFile) {
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

        if (!uploadResult.success) throw new Error("Failed to upload image");

        userData.userImage = uploadResult.data.url;
      }
      await UpdateUserInfo(userData, authHeader);
      toast.success("Profile updated successfully!", {
        position: "top-center",
        transition: Zoom,
      });
      setInitialData(userData);
      setSelectedFile(null);
    } catch (error) {
      toast.error("An error occurred: " + error.message, {
        position: "top-center",
        transition: Zoom,
      });
    }
  };

  if (loading)
    return (
      <div>
        <Backdrop
          sx={{ color: "#858585", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    );

  return (
    <Grid2 container>
      <Grid2 size={4}>
        <UserSideMenu></UserSideMenu>
      </Grid2>
      <Grid2 size={7}>
        <Container maxWidth="sm" sx={{ marginLeft: 0 }}>
          <Box display="flex" flexDirection="row" alignItems="center" mt={5}>
            <Box
              sx={{
                position: "relative",
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
                    "&:hover": { opacity: 1 },
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <PhotoCamera sx={{ color: "white" }} />
                </IconButton>
              </label>
            </Box>
            <Box display="flex" flexDirection="column" px={3}>
              <Typography variant="h5">{userData.fullName}</Typography>
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
              readOnly
            />
            <TextField
              fullWidth
              margin="normal"
              label="Username"
              name="username"
              value={userData.username}
              readOnly
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
              name="userAddress"
              value={userData.userAddress}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Payment Method"
              name="currentPaymentMethod"
              value={userData.currentPaymentMethod}
              readOnly
            />
            <Box display="flex" justifyContent="center" gap={3} mt={3}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  width: "150px",
                  textTransform: "none",
                  borderRadius: "8px",
                  backgroundColor: "green",
                }}
                disabled={!hasChanges()}
              >
                Save
              </Button>
              <UserChangePassword />
              <Button
                variant="contained"
                color="error"
                sx={{
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
      </Grid2>
    </Grid2>
  );
};

export default UserProfile;
