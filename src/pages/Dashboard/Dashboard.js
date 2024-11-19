import React, { useEffect, useRef, useState } from "react";
import { apiClient } from "../../core/api";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import PieChart from "../../components/chart/pieChart";
import Column3DChart from "../../components/chart/3dColunmChart";
import CylinderChart3D from "../../components/chart/3dCylinderChart";

const Dashboard = () => {
  const [brandPieChartData, setBrandPieChartData] = useState([]);
  const [bestSellingData, setBestSellingData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState([]);
  const varToken = useAuthHeader();

  useEffect(() => {
    const fetchBrandPieChartData = async () => {
      try {
        const response = await apiClient.get("/api/statistics/pie/brand", {
          headers: {
            Authorization: varToken,
          },
        });
        const formattedData = response.data.map((item) => ({
          country: item[0],
          litres: item[1],
        }));
        setBrandPieChartData(formattedData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };
    const fetchBestSellingData = async () => {
      try {
        const response = await apiClient.get(
          "/api/statistics/best-selling-products",
          {
            headers: {
              Authorization: varToken,
            },
          }
        );
        const BestData = response.data.map((item) => ({
          category: item[1],
          value: item[2],
        }));
        setBestSellingData(BestData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    const fetchTotalRevenue = async () => {
      try {
        const response = await apiClient.get(
          "/api/statistics/revenue/monthly",
          {
            headers: {
              Authorization: varToken,
            },
          }
        );

        const tRevenue = response.data
          .map((item) => ({
            category: `${item.month},${item.year}`,
            revenue: item.totalAmount,
          }));
        if (Array.isArray(tRevenue) && tRevenue.length > 0) {
          setTotalRevenue(tRevenue);
        } else {
          console.warn("No valid data to set in totalRevenue.");
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchBrandPieChartData();
    fetchBestSellingData();
    fetchTotalRevenue();
  }, [varToken]);

  return (
    <div className="p-2">
      {/* Header Section */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-2">Dashboard</h2>
        <p>Welcome to the admin dashboard!</p>
        <p>Here you can view your overall statistics and insights.</p>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {/* Pie Chart */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Brand Distribution</h3>
          <PieChart brandPieChartData={brandPieChartData} />
        </div>

        {/* Placeholder for Future Charts */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md ">
          <h3 className="text-xl font-semibold mb-4">Total revenue</h3>
          <Column3DChart chartData={totalRevenue} />
        </div>
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Best-selling products</h3>
          <CylinderChart3D chartData={bestSellingData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
