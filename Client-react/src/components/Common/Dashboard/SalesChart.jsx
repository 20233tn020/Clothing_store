
// =======GENERA LA GRAFICA DEL MES ================


import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

const SalesChart = () => {
  const chartRef = useRef(null); // referencia al canvas
  const chartInstanceRef = useRef(null); // guarda la instancia del gráfico

  useEffect(() => {
    // Datos del gráfico
    const salesData = {
      labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo"],
      datasets: [
        {
          label: "Ventas",
          data: [1200, 1900, 3000, 5000, 2400],
          borderColor: "#4361ee",
          backgroundColor: "rgba(67, 97, 238, 0.2)",
          tension: 0.3, // suaviza la línea
          fill: true,
        },
      ],
    };

    // Si ya existe un gráfico anterior, destrúyelo para evitar duplicados
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Crear la gráfica
    chartInstanceRef.current = new Chart(chartRef.current, {
      type: "line",
      data: salesData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            mode: "index",
            intersect: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return "$" + value.toLocaleString();
              },
            },
          },
        },
      },
    });

    // Limpiar al desmontar el componente
    return () => {
      chartInstanceRef.current.destroy();
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default SalesChart;
