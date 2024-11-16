import React, { useEffect, useRef, useState } from "react";
import { apiClient } from "../../core/api";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import PieChart from "../../components/chart/pieChart";
import Column3DChart from "../../components/chart/3dColunmChart";
import CylinderChart3D from "../../components/chart/3dCylinderChart";

const Dashboard = () => {
  const chartRef = useRef(null);
  const [brandPieChartData, setBrandPieChartData] = useState([]);
  const varToken = useAuthHeader();

  const chartData = [
    { category: "Category 1", value: 45 },
    { category: "Category 2", value: 78 },
    { category: "Category 3", value: 62 },
    { category: "Category 4", value: 54 },
    { category: "Category 5", value: 90 },
  ];

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

    fetchBrandPieChartData();
  }, [varToken]);

  return (
    <div className="p-2">
      {/* Header Section */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-2">Dashboard</h2>
        <p>Welcome to the admin dashboard!</p>
        <p>Here you can view your overall statistics and insights.</p>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example Stats Cards */}
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold">Total Sales</h3>
          <p className="text-2xl font-bold text-blue-600">$12,345</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold">Total Orders</h3>
          <p className="text-2xl font-bold text-green-600">543</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold">Active Users</h3>
          <p className="text-2xl font-bold text-red-600">1,234</p>
        </div>
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
          <Column3DChart />
        </div>
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Best-selling products</h3>
          <CylinderChart3D chartData={chartData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
