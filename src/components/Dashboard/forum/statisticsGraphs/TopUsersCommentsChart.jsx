import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

const TopUsersCommentsChart = ({ topic }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!topic.topUsers || topic.topUsers.length === 0) return;

    const chartInstance = echarts.init(chartRef.current);

    // Preparar datos
    const users = topic.topUsers.slice(0, 5).map((user) => `Usuario: ${user.username}`);
    const commentsCounts = topic.topUsers.slice(0, 5).map((user) => user.count);

    // Colores personalizados para cada barra
    const colors = ["#FBBC04", "#200E3E", "#8D34F9", "#F45442", "#31BF71"];

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
        name: "Comentarios",
      },
      yAxis: {
        type: "category",
        data: users,
        inverse: true, // Invierte el orden de los usuarios
        axisLabel: {
          interval: 0,
          formatter: (value) => (value.length > 15 ? `${value.slice(0, 15)}...` : value), // Trunca nombres largos
        },
      },
      series: [
        {
          name: "Comentarios",
          type: "bar",
          data: commentsCounts.map((value, index) => ({
            value,
            itemStyle: { color: colors[index] }, // Asigna un color único a cada barra
          })),
          label: {
            show: true,
            position: "right",
            formatter: "{c}", // Muestra el valor al final de la barra
          },
          animationDuration: 3000,
          animationEasing: "linear",
        },
      ],
    };

    chartInstance.setOption(options);

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

export default TopUsersCommentsChart;
