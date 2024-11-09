import React from "react";
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
import { apiClient } from "../../core/api";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast, Zoom } from "react-toastify";

const DashboardCreateSale = () => {
  const navigate = useNavigate();
  const varToken = useAuthHeader();

  const validationSchema = Yup.object({
    saleType: Yup.string()
      .required("Sale type is required")
      .oneOf(["PERCENTAGE", "FIXED_AMOUNT"], "Invalid sale type"),
    saleValue: Yup.number()
      .required("Sale value is required")
      .min(0, "Sale value cannot be negative")
      .when("saleType", {
        is: "PERCENTAGE",
        then: (schema) =>
          schema.max(
            100,
            "Sale value cannot be greater than 100 for percentage"
          ),
      })
      .max(999999999999, "Sale value cannot exceed 999999999999"),
    startDate: Yup.date()
      .required("Start date is required")
      .min(new Date(), "Start date cannot be in the past"),
    endDate: Yup.date()
      .required("End date is required")
      .min(Yup.ref("startDate"), "End date must be after start date"),
    saleStatus: Yup.string().required("Sale status is required"),
  });

  const handleSubmit = (values) => {
    apiClient
      .post("/api/sales", values, {
        headers: { Authorization: varToken },
      })
      .then((response) => {
        toast.success("Create sale successfully", {
          position: "bottom-right",
          transition: Zoom,
        });
        console.log("Sale created successfully:", response.data);
        navigate("/Dashboard/Sales");
      })
      .catch((error) => {
        toast.error("Create sale failed", {
          position: "bottom-right",
          transition: Zoom,
        });
        console.error("Error creating sale:", error);
      });
  };

  return (
    <div className="max-w-lg mx-auto">
      <Typography variant="h4" gutterBottom>
        Create New Sale
      </Typography>
      <Formik
        initialValues={{
          saleType: "PERCENTAGE",
          saleValue: "",
          startDate: "",
          endDate: "",
          saleStatus: "ACTIVE",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue }) => (
          <Form className="space-y-6">
            <FormControl fullWidth margin="normal">
              <InputLabel>Sale Type</InputLabel>
              <Field
                name="saleType"
                as={Select}
                label="Sale Type"
                onChange={(e) => setFieldValue("saleType", e.target.value)}
              >
                <MenuItem value="PERCENTAGE">Percentage</MenuItem>
                <MenuItem value="FIXED_AMOUNT">Fixed Amount</MenuItem>
              </Field>
              {errors.saleType && touched.saleType && (
                <Typography color="error">{errors.saleType}</Typography>
              )}
            </FormControl>

            <Field
              name="saleValue"
              as={TextField}
              label="Sale Value"
              type="number"
              fullWidth
              margin="normal"
              error={Boolean(errors.saleValue && touched.saleValue)}
              helperText={touched.saleValue && errors.saleValue}
            />

            <Field
              name="startDate"
              as={TextField}
              label="Start Date"
              type="datetime-local"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              error={Boolean(errors.startDate && touched.startDate)}
              helperText={touched.startDate && errors.startDate}
            />

            <Field
              name="endDate"
              as={TextField}
              label="End Date"
              type="datetime-local"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              error={Boolean(errors.endDate && touched.endDate)}
              helperText={touched.endDate && errors.endDate}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Sale Status</InputLabel>
              <Field
                name="saleStatus"
                as={Select}
                label="Sale Status"
                onChange={(e) => setFieldValue("saleStatus", e.target.value)}
              >
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
              </Field>
              {errors.saleStatus && touched.saleStatus && (
                <Typography color="error">{errors.saleStatus}</Typography>
              )}
            </FormControl>

            <Button type="submit" variant="contained" color="primary" fullWidth>
              Create Sale
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default DashboardCreateSale;
