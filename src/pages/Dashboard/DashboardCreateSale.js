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
import { apiClient } from "../../core/api";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

const DashboardCreateSale = () => {
  const [saleType, setSaleType] = useState("PERCENTAGE");
  const [saleValue, setSaleValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [saleStatus, setSaleStatus] = useState("ACTIVE");
  const navigate = useNavigate();

  const varToken = useAuthHeader();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newSale = {
      saleType,
      saleValue: parseFloat(saleValue),
      startDate,
      endDate,
      saleStatus,
    };

    apiClient
      .post("/api/sales", newSale, {
        headers: {
          Authorization: varToken,
        },
      })
      .then((response) => {
        console.log("Sale created successfully:", response.data);
        navigate("/Dashboard/Sales");
      })
      .catch((error) => {
        console.error("Error creating sale:", error);
      });
  };

  return (
    <div className="max-w-lg mx-auto">
      <Typography variant="h4" gutterBottom>
        Create New Sale
      </Typography>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormControl fullWidth margin="normal">
          <InputLabel>Sale Type</InputLabel>
          <Select
            value={saleType}
            onChange={(e) => setSaleType(e.target.value)}
            label="Sale Type"
          >
            <MenuItem value="PERCENTAGE">Percentage</MenuItem>
            <MenuItem value="FIXED_AMOUNT">Fixed Amount</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Sale Value"
          type="number"
          value={saleValue}
          onChange={(e) => setSaleValue(e.target.value)}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          required
        />

        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          required
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Sale Status</InputLabel>
          <Select
            value={saleStatus}
            onChange={(e) => setSaleStatus(e.target.value)}
            label="Sale Status"
          >
            <MenuItem value="ACTIVE">Active</MenuItem>
            <MenuItem value="INACTIVE">Inactive</MenuItem>
          </Select>
        </FormControl>

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Create Sale
        </Button>
      </form>
    </div>
  );
};

export default DashboardCreateSale;
