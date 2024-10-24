import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import {ChangePassword} from "../../service/UserService";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { toast, Zoom } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UserChangePassword = () => {
  const [open, setOpen] = useState(false);
  const userState = useAuthUser();
  const authHeader = useAuthHeader();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const initialValues = {
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string()
      .required("New password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
        "Password must contain one uppercase, one lowercase, and one number"
      ),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Please confirm your new password"),
  });

  const handleSubmit = (values) => {
    try {
      const token = jwtDecode(authHeader);
      ChangePassword(values, authHeader, token.email);
      handleClose();
    } catch (error) {
      toast.error(error?.data?.message|| "Error to change password", {
        position: "top-center",
        transition: Zoom,
      })
    }
  };

  return (
    <React.Fragment>
      <Button
        sx={{
          boxShadow: "none",
          width: "170px",
          textTransform: "none",
          borderRadius: "8px",
        }}
        color="primary"
        variant="contained"
        onClick={handleClickOpen}
      >
        Change Password
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        sx={{
          "& .MuiDialog-paper": {
            width: "400px", // Set the desired width
            height: "auto", // Set height to auto to accommodate content
          },
        }}
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <Field name="currentPassword">
                  {({ field }) => (
                    <TextField
                      {...field}
                      label="Enter current password"
                      type="password"
                      fullWidth
                      variant="outlined"
                      margin="normal"
                    />
                  )}
                </Field>
                <ErrorMessage name="currentPassword">
                  {(msg) => (
                    <Typography
                      color="error"
                      variant="body2"
                      sx={{ width: "100%" }}
                    >
                      {msg}
                    </Typography>
                  )}
                </ErrorMessage>

                <Field name="newPassword">
                  {({ field }) => (
                    <TextField
                      {...field}
                      label="Enter new password"
                      type="password"
                      fullWidth
                      variant="outlined"
                      margin="normal"
                    />
                  )}
                </Field>
                <ErrorMessage name="newPassword">
                  {(msg) => (
                    <Typography
                      color="error"
                      variant="body2"
                      sx={{ width: "100%" }}
                    >
                      {msg}
                    </Typography>
                  )}
                </ErrorMessage>

                <Field name="confirmNewPassword">
                  {({ field }) => (
                    <TextField
                      {...field}
                      label="Confirm new password"
                      type="password"
                      fullWidth
                      variant="outlined"
                      margin="normal"
                    />
                  )}
                </Field>
                <ErrorMessage name="confirmNewPassword">
                  {(msg) => (
                    <Typography
                      color="error"
                      variant="body2"
                      sx={{ width: "100%" }}
                    >
                      {msg}
                    </Typography>
                  )}
                </ErrorMessage>

                <DialogActions>
                  <Button onClick={handleClose} color="secondary">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                  >
                    Change password
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default UserChangePassword;
