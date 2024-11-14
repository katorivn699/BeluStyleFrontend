import React, { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts";
import { apiClient } from "../../core/api";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

const Dashboard = () => {
  const [brandPieData, setBrandPieData] = useState([]);
  const varToken = useAuthHeader();

  const generateColors = (numColors) => {
    const colors = [];
    const colorPalette = [
      "#FF5733", // Red-Orange
      "#33FF57", // Green
      "#3357FF", // Blue
      "#FF33A6", // Pink
      "#FFD700", // Yellow
      "#00FF7F", // Spring Green
      "#8A2BE2", // Blue-Violet
      "#FF6347", // Tomato Red
      "#20B2AA", // Light Sea Green
      "#FF69B4", // Hot Pink
      "#FF1493", // Deep Pink
      "#FF4500", // Orange Red
      "#2E8B57", // Sea Green
      "#BA55D3", // Medium Orchid
      "#FF8C00", // Dark Orange
    ];

    for (let i = 0; i < numColors; i++) {
      colors.push(colorPalette[i % colorPalette.length]);
    }

    return colors;
  };

  useEffect(() => {
    const brandPie = async () => {
      try {
        const response = await apiClient.get(
          "http://localhost:8080/api/statistics/pie/brand",
          {
            headers: {
              Authorization: varToken,
            },
          }
        );

        const formattedData = response.data.map((item, index) => ({
          id: index,
          value: item[1], // sales count
          label: item[0], // brand name
        }));

        setBrandPieData(formattedData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    brandPie();
  }, [varToken]);

  // Generate colors based on the number of brands
  const chartColors = generateColors(brandPieData.length);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <p>Welcome to the admin dashboard!</p>
      <p>Here you can view your overall statistics and insights.</p>

      <div className="w-fit">
        <PieChart
          colors={chartColors} // Dynamically assigned distinct colors
          series={[{ data: brandPieData }]}
          width={400}
          height={200}
        />
        <div className="mt-4 font-semibold text-lg text-center">
          Brand Distribution
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
