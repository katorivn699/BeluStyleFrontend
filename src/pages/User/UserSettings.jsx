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

  UpdateUserInfo,
} from "../../service/UserService";
import { toast, Zoom } from "react-toastify";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { useNavigate } from "react-router-dom";
import UserChangePassword from "./UserChangePassword";
import userDefault from "../../assets/images/userdefault.webp";
import UserSideMenu from "../../components/menus/UserMenu";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import vnpay from "../../assets/images/vnpay.jpg";
import payos from "../../assets/images/payos.svg";
import { BiSolidBank } from "react-icons/bi";
import cod from "../../assets/images/cod.png";
import DeleteAccountButton from "../../components/buttons/DeleteAccount";

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
    phoneNumber: "",
    userImage: "",
  });
  const [initialData, setInitialData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const signIn = useSignIn();

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
          userAddress: userInfo.userAddress || "Address not provided",
          currentPaymentMethod:
            userInfo.currentPaymentMethod ||
            "Place an order to add a payment method",
          userImage: userInfo.userImage || userDefault,
          phoneNumber: userInfo.phoneNumber || "Phone number not provided", // Ensure phone number is populated
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
    console.log(userData);
  };

  const handleDeleteSuccess = () => {
    signOut();
    navigate("/");
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
      await UpdateUserInfo(userData, authHeader, signIn);
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
              <Typography variant="h5" className="font-montserrat">
                {userData.fullName}
              </Typography>
              <Typography
                variant="body1"
                color="textSecondary"
                className="font-montserrat"
              >
                {userData.email}
              </Typography>
            </Box>
          </Box>
          <Box component="form" mt={3} onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              sx={{
                "& .MuiInputBase-input": {
                  fontFamily: "Montserrat",
                },
                label: {
                  fontFamily: "Montserrat",
                },
              }}
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
              sx={{
                "& .MuiInputBase-input": {
                  fontFamily: "Montserrat",
                },
                label: {
                  fontFamily: "Montserrat",
                },
              }}
              readOnly
            />
            <TextField
              fullWidth
              margin="normal"
              label="Full Name"
              name="fullName"
              value={userData.fullName}
              onChange={handleInputChange}
              sx={{
                "& .MuiInputBase-input": {
                  fontFamily: "Montserrat",
                },
                label: {
                  fontFamily: "Montserrat",
                },
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Phone number"
              name="phoneNumber"
              value={userData.phoneNumber}
              onChange={handleInputChange}
              sx={{
                "& .MuiInputBase-input": {
                  fontFamily: "Montserrat",
                },
                label: {
                  fontFamily: "Montserrat",
                },
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Address"
              name="userAddress"
              value={userData.userAddress}
              onChange={handleInputChange}
              sx={{
                "& .MuiInputBase-input": {
                  fontFamily: "Montserrat",
                },
                label: {
                  fontFamily: "Montserrat",
                },
              }}
            />
            {/* <TextField
              fullWidth
              margin="normal"
              label="Payment Method"
              name="currentPaymentMethod"
              value={userData.currentPaymentMethod}
              readOnly
              sx={{
                fontFamily: "Poppins",
              }}
            /> */}
            <div className="pt-3">
              <div className="flex justify-start items-center w-auto h-20 border-2 rounded-lg px-10 font-montserrat">
                {(() => {
                  switch (userData.currentPaymentMethod) {
                    case "VNPAY":
                      return (
                        <>
                          <img src={vnpay} alt="VNPAY" className="w-16 h-16" />
                          <p className="pl-5">VNPAY</p>
                        </>
                      );
                    case "PAYOS":
                      return (
                        <>
                          <img src={payos} alt="PAYOS" className="w-16 h-16" />
                          <p className="pl-5">PAYOS</p>
                        </>
                      );
                    case "TRANSFER":
                      return (
                        <>
                          <BiSolidBank className="text-3xl"/>
                          <p className="pl-5">Bank Transfer</p>
                        </>
                      );
                    case "COD":
                      return (
                        <>
                          <img
                            src={cod}
                            alt="Cash on Delivery"
                            className="w-16 h-16"
                          />
                          <p className="pl-5">Cash on Delivery</p>
                        </>
                      );
                    default:
                      return <p className="pl-5">No previous payment method</p>;
                  }
                })()}
              </div>
            </div>
            <Box display="flex" justifyContent="center" gap={3} mt={3}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  fontFamily: "Montserrat",
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
              <DeleteAccountButton
                authHeader={authHeader}
                onDeleteSuccess={handleDeleteSuccess}
              />
            </Box>
          </Box>
        </Container>
      </Grid2>
    </Grid2>
  );
};

export default UserProfile;
