import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const DashboardEditSale = () => {
  const [saleType, setSaleType] = useState("PERCENTAGE");
  const [saleValue, setSaleValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [saleStatus, setSaleStatus] = useState("ACTIVE");
  const navigate = useNavigate();
  const { saleId } = useParams();

  const varToken = localStorage.getItem("_auth");

  useEffect(() => {
    apiClient
      .get(`/api/sales/${saleId}`, {
        headers: {
          Authorization: "Bearer " + varToken,
        },
      })
      .then((response) => {
        const sale = response.data;
        setSaleType(sale.saleType);
        setSaleValue(sale.saleValue);
        setStartDate(formatDate(sale.startDate));
        setEndDate(formatDate(sale.endDate));
        setSaleStatus(sale.saleStatus);
      })
      .catch((error) => {
        console.error("Error fetching sale details:", error);
      });
  }, [saleId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedSale = {
      saleType,
      saleValue: parseFloat(saleValue),
      startDate,
      endDate,
      saleStatus,
    };

    apiClient
      .put(`/api/sales/${saleId}`, updatedSale, {
        headers: {
          Authorization: "Bearer " + varToken,
        },
      })
      .then((response) => {
        console.log("Sale updated successfully:", response.data);
        navigate("/Dashboard/Sales");
      })
      .catch((error) => {
        console.error("Error updating sale:", error);
      });
  };

  return (
    <div className="max-w-lg mx-auto">
      <Typography variant="h4" gutterBottom>
        Edit Sale {saleId}
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
          Update Sale
        </Button>
      </form>
    </div>
  );
};

export default DashboardEditSale;
