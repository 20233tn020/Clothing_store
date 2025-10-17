import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
const ProductChart = () => {

  const chartRef = useRef(null); // referencia al canvas
  const chartInstanceRef = useRef(null); // guarda la instancia del gráfico

  useEffect(()=>{

          const productsData = {
            labels: ['Laptops', 'Smartphones', 'Tablets', 'Accesorios', 'Audio'],
            datasets: [{
                label: 'Unidades Vendidas',
                data: [120, 85, 45, 200, 75],
                backgroundColor: [
                    'rgba(67, 97, 238, 0.7)',
                    'rgba(76, 201, 240, 0.7)',
                    'rgba(248, 150, 30, 0.7)',
                    'rgba(247, 37, 133, 0.7)',
                    'rgba(72, 149, 239, 0.7)'
                ],
                borderWidth: 1
            }]
        };

        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }
        chartInstanceRef.current = new Chart(chartRef.current, {
            type: "bar",
            data: productsData,
            options:{
                responsive: true,
                maintainAspectRatio : false,
                plugins:{
                    legend: {
                        position: "top",
                    },
                },
            },
        });
        return () => {
      chartInstanceRef.current.destroy();
    };
   []});

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <canvas ref={chartRef}></canvas>
    </div>
  )
}
export default ProductChart;
