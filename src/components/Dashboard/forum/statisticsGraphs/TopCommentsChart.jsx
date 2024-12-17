import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

const TopCommentsChart = ({ topic }) => {
  const chartRef = useRef(null); // Referencia al contenedor del gráfico

  useEffect(() => {
    if (!topic.top5Comments || topic.top5Comments.length === 0) return;

    const chartInstance = echarts.init(chartRef.current); // Inicializar ECharts

    // Extraer títulos y conteos
    const titles = topic.top5Comments.map((comment) => comment.content);
    const answersCounts = topic.top5Comments.map((comment) => comment.answersCount);

    // Colores personalizados para cada barra
    const colors = ["#00D8A1", "#F45442", "#8D34F9", "#FBBC04", "#200E3E"];

    const options = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow", // Indicador de sombra en el eje
        },
      },
      xAxis: {
        type: "category",
        data: titles, // Títulos de los comentarios
        axisLabel: {
          interval: 0, // Mostrar todas las etiquetas
          rotate: 30, // Rotar etiquetas si son largas
        },
      },
      yAxis: {
        type: "value",
        name: "Respuestas",
      },
      series: [
        {
          name: "Respuestas",
          type: "bar",
          data: answersCounts.map((value, index) => ({
            value,
            itemStyle: { color: colors[index] },
          })), // Valores de respuestas
          itemStyle: {
            color: "#7C3AED", // Color del gráfico
          },
          barWidth: "50%", // Ancho de las barras
        },
      ],
    };

    chartInstance.setOption(options);

    // Limpiar la instancia de ECharts al desmontar el componente
    return () => {
      chartInstance.dispose();
    };
  }, [topic.top5Comments]);

  return (
    <div>
      <div ref={chartRef} style={{ height: "400px", width: "100%" }}></div>
    </div>
  );
};

export default TopCommentsChart;
