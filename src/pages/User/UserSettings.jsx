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
import { GetUserInfo } from "../../service/UserService"; // Đảm bảo hàm này đã được xuất khẩu đúng cách
import { toast, Zoom } from "react-toastify";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

export const UserProfile = () => {
  const authHeader = useAuthHeader(); // Sử dụng hook ở đây
  const [profileImage, setProfileImage] = useState(
    "/path/to/profile/picture.jpg"
  );
  const [userData, setUserData] = useState({
    email: "alexarawles@gmail.com",
    username: "Alexa Rawles",
    fullName: "Alexa Rawles",
    address: "Japan",
  });

  // Hàm gọi API để lấy thông tin người dùng
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await GetUserInfo(authHeader);
        const userInfo = response.data;
        setUserData({
          email: userInfo.email || "No Email",
          username: userInfo.username || "No Name",
          fullName: userInfo.fullName || "No Full Name",
          address: userInfo.address || "No Address",
        });
        setProfileImage(userInfo.userImage);
      } catch (error) {
        toast.error("An error occurred. Please try again." + error.message, {
          position: "top-center",
          transition: Zoom,
        });
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, [authHeader]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit form data to the server
    console.log("Form submitted:", userData);
    toast.success("Profile updated successfully!", {
      position: "top-center",
      transition: Zoom,
    });
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
                backgroundColor: "rgba(0, 0, 0, 0.3)", // Nền bán trong
                opacity: 0, // Làm icon ẩn khi không hover
                transition: "opacity 0.3s ease-in-out",
                "&:hover": {
                  opacity: 1, // Hiện icon khi hover vào
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
          {userData.username}
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
          label="Name"
          name="name"
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
          value={userData.address}
          onChange={handleInputChange}
        />
        <Box display="flex" justifyContent="center" gap={3} mt={3}>
          <Button type="submit" variant="contained" color="primary" sx={{
            boxShadow: "none",
            width: "150px",
            textTransform: 'none',
            borderRadius: "8px"
          }}>
            Save
          </Button>
          <Button variant="contained" color="error" sx={{
            boxShadow: "none",
            width: "170px",
            textTransform: 'none',
            borderRadius: "8px"
          }}>
            Delete account
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default UserProfile;
