// src/components/ReportAnalyze.jsx
import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

const ReportAnalyze = ({ type = "doughnut", data, options }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(chartRef.current, {
      type,
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",

          },
        },
        ...options, // permite personalización extra
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [type, data, options]);

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ReportAnalyze;
