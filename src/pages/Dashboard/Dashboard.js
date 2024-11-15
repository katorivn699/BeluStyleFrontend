import React, { useEffect, useRef, useState } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { apiClient } from "../../core/api";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

const Dashboard = () => {
  const chartRef = useRef(null);
  const [brandPieChartData, setBrandPieChartData] = useState([]);
  const varToken = useAuthHeader();

  useEffect(() => {
    const fetchBrandPieChartData = async () => {
      try {
        const response = await apiClient.get(
          "http://localhost:8080/api/statistics/pie/brand",
          {
            headers: {
              Authorization: varToken,
            },
          }
        );
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

  useEffect(() => {
    am4core.useTheme(am4themes_animated);

    // Create the chart instance
    const chart = am4core.create("chartdiv", am4charts.PieChart3D);
    chart.hiddenState.properties.opacity = 0;
    chart.legend = new am4charts.Legend();

    // Disable the amCharts logo
    chart.logo.disabled = true;

    // Assign data to the chart
    chart.data = brandPieChartData;

    const series = chart.series.push(new am4charts.PieSeries3D());
    series.dataFields.value = "litres";
    series.dataFields.category = "country";

    // Store chart instance in the ref for cleanup
    chartRef.current = chart;

    return () => {
      // Dispose of chart instance on component unmount
      chart.dispose();
    };
  }, [brandPieChartData]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 ">Dashboard</h2>
      <p>Welcome to the admin dashboard!</p>
      <p>Here you can view your overall statistics and insights.</p>
      <div className="flex flex-col items-center ">
        <div id="chartdiv" style={{ width: "100%", height: "70vh" }}></div>
        <div className="mt-4 font-semibold text-lg">Brand Distribution</div>
      </div>
    </div>
  );
};

export default Dashboard;
