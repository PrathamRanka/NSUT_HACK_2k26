import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface BarChartProps {
  data?: Record<string, number>;
  style?: React.CSSProperties;
}

const BarChart: React.FC<BarChartProps> = ({ data: inputData }) => {
  // Use inputData if provided, otherwise fallback to empty or default
  const labels = inputData ? Object.keys(inputData) : ["Base Score", "MI Score", "Vendor History", "Amount Anamoly", "Frequency Anomaly"];
  const values = inputData ? Object.values(inputData) : [0, 0, 0, 0, 0];

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Risk Contribution",
        data: values,
        backgroundColor: "rgba(0, 102, 255, 0.8)", // Blue color
        barThickness: 30,
        maxBarThickness: 60,
        borderRadius: 6,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100 // assuming risk scores are out of 100
      }
    }
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
