import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { apiClient } from "../../core/api";
import { toast, Zoom } from "react-toastify";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

const DashboardCreateNotification = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetRoleId, setTargetRoleId] = useState("");
  const [touched, setTouched] = useState({
    title: false,
    message: false,
  });
  const authUser = useAuthUser();
  const userRole = authUser.role;
  const navigate = useNavigate();
  const varToken = useAuthHeader();

  const availableRoles =
    userRole === "ADMIN"
      ? [
          { id: 2, name: "Customer" },
          { id: 3, name: "Staff" },
        ]
      : [{ id: 2, name: "Customer" }];

  // Validation logic
  const isTitleValid = title.trim().length > 5;
  const isMessageValid = message.trim().length > 5;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      title: true,
      message: true,
    });

    if (!isTitleValid || !isMessageValid) return;

    await apiClient
      .post(
        "/api/notifications",
        {
          title,
          message,
          targetRoleId,
        },
        {
          headers: {
            Authorization: varToken,
          },
        }
      )
      .then((response) => {
        toast.success("Notification created successfully!", {
          position: "bottom-right",
          transition: Zoom,
        });
        navigate("/Dashboard/Notifications");
      })
      .catch((error) => {
        toast.error("Failed to create notification", {
          position: "bottom-right",
          transition: Zoom,
        });
        console.error("Error creating notification:", error);
      });
  };

  return (
    <div className="container mx-auto p-4">
      <Typography variant="h4" gutterBottom>
        Create Notification
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => setTouched((prev) => ({ ...prev, title: true }))}
          error={touched.title && !isTitleValid}
          helperText={
            touched.title && !isTitleValid
              ? "Title must be longer than 5 characters."
              : ""
          }
          required
        />
        <TextField
          label="Message"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onBlur={() => setTouched((prev) => ({ ...prev, message: true }))}
          error={touched.message && !isMessageValid}
          helperText={
            touched.message && !isMessageValid
              ? "Message must be longer than 5 characters."
              : ""
          }
          required
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Role</InputLabel>
          <Select
            value={targetRoleId}
            onChange={(e) => setTargetRoleId(e.target.value)}
          >
            {availableRoles.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary">
          Create Notification
        </Button>
      </form>
    </div>
  );
};

export default DashboardCreateNotification;
