import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

const DonuChart = ({ topic }) => {
  const chartRef = useRef(null); // Referencia al contenedor de la gráfica

  const commentsCount = topic.commentsCount;
  const answersCount = topic.topUsersAnswer.reduce((acc, user) => acc + user.count, 0);

  useEffect(() => {
    if(!topic.commentsCount || topic.commentsCount.length ==0 ) return;

    const chartInstance = echarts.init(chartRef.current); // Inicializar ECharts

    const options = {
        tooltip: {
            trigger: 'item'
          },
          legend: {
            top: '5%',
            left: 'center'
          },
      series: [
        {
            name: 'Datos',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            padAngle: 5,
            itemStyle: {
              borderRadius: 10
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
          data: [
            { value: commentsCount, name: "Comentarios", itemStyle: { color: "#008BD8" } },
            { value: answersCount, name: "Respuestas", itemStyle: { color: "#00D8A1" }},
          ],
        },
      ],
    };

    chartInstance.setOption(options);

    // Limpiar la instancia de ECharts al desmontar el componente
    return () => {
      chartInstance.dispose();
    };
  }, [commentsCount, answersCount]);

  return (
    <div>
      <h2 className="text-center text-xl font-bold">Estadísticas</h2>
      <div ref={chartRef} style={{ height: "400px" }}></div>
    </div>
  );
};

export default DonuChart;
