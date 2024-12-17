import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

const TopUsersChart = ({ topic }) => {
  const chartRef = useRef(null); // Referencia al contenedor del gráfico

  useEffect(() => {
    if (!topic.topUsers || topic.topUsers.length === 0) return;

    const chartInstance = echarts.init(chartRef.current); // Inicializar ECharts

    // Preparar datos
    const users = topic.topUsers.slice(0, 5).map((user) => `Usuario: ${user.username}`);
    const answersCounts = topic.topUsers.slice(0, 5).map((user) => user.count);

     // Colores personalizados para cada barra
     const colors = ["#8D34F9", "#B209EB", "#31BF71", "#FBBC04", "#F45442"];

    const options = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        name: "Respuestas",
      },
      yAxis: {
        type: "category",
        data: users, // Nombres de usuarios
        inverse: true, // Coloca los nombres de arriba hacia abajo
        axisLabel: {
          interval: 0,
          formatter: (value) => (value.length > 15 ? `${value.slice(0, 15)}...` : value), // Trunca nombres largos
        },
      },
      series: [
        {
          name: "Respuestas",
          type: "bar",
          data: answersCounts.map((value, index) => ({
            value,
            itemStyle: { color: colors[index] },
          })), // Valores de respuestas
          label: {
            show: true,
            position: "right",
            formatter: "{c}", // Muestra el valor al final de la barra
          },
          animationDuration: 3000, // Duración de la animación inicial
          animationEasing: "linear", // Suavidad en la animación
        },
      ],
    };

    chartInstance.setOption(options);

    // Limpiar la instancia de ECharts al desmontar el componente
    return () => {
      chartInstance.dispose();
    };
  }, [topic.topUsers]);

  return (
    <div>
      <div ref={chartRef} style={{ height: "400px", width: "100%" }}></div>
    </div>
  );
};

export default TopUsersChart;
