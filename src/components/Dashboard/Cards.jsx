import React, { useState, useEffect, useRef } from "react";
import { useUserContext } from "../../context/user/user.context.jsx";
import { useCoursesContext } from "../../context/courses/courses.context.jsx";
import { useTranslation } from "react-i18next";
import { Bar, Doughnut } from "react-chartjs-2";
import * as echarts from 'echarts'; // Importación de ECharts

import { AiFillBook } from "react-icons/ai";
import { FaUsersSlash } from "react-icons/fa";
import { HiMiniUsers } from "react-icons/hi2";
import { HiUserPlus } from "react-icons/hi2";


const Cards = ({ isLeftBarVisible }) => {
  const { usersData } = useUserContext();
  const { courses } = useCoursesContext();
  const { t } = useTranslation("global");
  const [stats, setStats] = useState({
    cursos: 0,
    usuariosRegistrados: 0,
    usuariosActivos: 0,
    usuariosInactivos: 0,
  });

  const chartRef = useRef(null); // Referencia para el contenedor del gráfico
  const pieChartRef = useRef(null); // Referencia para el gráfico de pastel

  useEffect(() => {
    // Configuración del gráfico de barras avanzado de ECharts
    if (chartRef.current) {
      const myChart = echarts.init(chartRef.current);

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: [t("cardsComponent.titleactiveUsers"), t("cardsComponent.titleinactiveUsers"), t("cardsComponent.titleregisteredUsers")], // Ejes con traducción
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            type: 'bar',
            barWidth: '60%', // Ancho de las barras
            data: [
              {
                value: stats.usuariosActivos,
                itemStyle: {
                  color: '#31BF71', // Color para usuarios activos
                  name: t(""), // Traducción para el nombre de la serie
                },
              },
              {
                value: stats.usuariosInactivos,
                itemStyle: {
                  color: '#F45442', // Color para usuarios inactivos
                },
              },
              {
                value: stats.usuariosRegistrados,
                itemStyle: {
                  color: '#FBBF24', // Color para usuarios registrados
                },
              },
            ], // Datos dinámicos con color específico
          },
        ],
      };

      myChart.setOption(option);

      // Configurar el gráfico para ser responsivo
      window.addEventListener('resize', myChart.resize);

      // Destruir el gráfico cuando el componente se desmonte
      return () => {
        myChart.dispose();
        window.removeEventListener('resize', myChart.resize);
      };
    }
  }, [stats, t]);

  useEffect(() => {
    // Configuración del gráfico de pastel de ECharts
    if (pieChartRef.current) {
      const myChart = echarts.init(pieChartRef.current);

      const option = {
        tooltip: {
          trigger: 'item',
        },
        legend: {
          top: '5%',
          left: 'center',
        },
        series: [
          {
            name: t("cardsComponent.StatisticsCoures"), // Nombre del gráfico, traducible
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              {
                value: stats.cursos,
                name: t("cardsComponent.titlecourses"),
                itemStyle: {
                  color: '#783CDA', // Color para cursos
                },
              },
            ],
          },
        ],
      };

      myChart.setOption(option);

      // Configurar el gráfico para ser responsivo
      window.addEventListener('resize', myChart.resize);

      // Destruir el gráfico cuando el componente se desmonte
      return () => {
        myChart.dispose();
        window.removeEventListener('resize', myChart.resize);
      };
    }
  }, [stats, t]);

  useEffect(() => {
    const activeUsers = usersData.filter((user) => user.state);
    const inactiveUsers = usersData.filter((user) => !user.state);

    setStats({
      cursos: courses.length,
      usuariosRegistrados: usersData.length,
      usuariosActivos: activeUsers.length,
      usuariosInactivos: inactiveUsers.length,
    });
  }, [usersData, courses]);


  return (
    <div className="bg-white overflow-hidden min-h-screen">
      <div className="p-24 space-y-16">
              <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-4">
                <h1 className="text-3xl relative font-bold mb-0 top-[-4rem] text-left">
                  {t("cardsComponent.stadisticTitle")}
                </h1>
                <h1 className="text-3xl relative font-bold mb-0 top-[-4rem] text-left text-[#783CDA]">
                  {t("cardsComponent.stadisticTitle1")}
                </h1>
              </div>
              
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-24">
              {/* Usuario Activo */}
              <div className="relative bg-[#F8F2F2] text-gray-900 rounded-lg shadow-lg shadow-[#31BF71] hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center">
                <div className="absolute top-[-4rem] left-1/2 transform -translate-x-1/2 text-[#31BF71] text-6xl">
                  <HiMiniUsers />
                </div>
                <h3 className="text-lg font-semibold mb-0 text-left w-full">
                  {t("cardsComponent.activeUsers")}
                </h3>
                <div className="w-full flex justify-center my-4">
                  <div className="w-20 h-20 bg-[#31BF71] rounded-full flex items-center justify-center">
                    <span className="text-6xl font-bold text-black">
                      {stats.usuariosActivos}
                    </span>
                  </div>
                </div>
                <p className="text-center w-full">
                  {t("cardsComponent.activeUsersDescription")}
                </p>
              </div>

              {/* Usuario Inactivo */}
              <div className="relative bg-[#F8F2F2] text-gray-900 rounded-lg shadow-lg shadow-[#F45442] hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center">
                <div className="absolute top-[-4rem] left-1/2 transform -translate-x-1/2 text-[#F45442] text-6xl">
                  <FaUsersSlash />
                </div>
                <h3 className="text-lg font-semibold mb-0 text-left w-full">
                  {t("cardsComponent.inactiveUsers")}
                </h3>
                <div className="w-full flex justify-center my-4">
                  <div className="w-20 h-20 bg-[#F45442] rounded-full flex items-center justify-center">
                    <span className="text-6xl font-bold text-black">
                      {stats.usuariosInactivos}
                    </span>
                  </div>
                </div>
                <p className="text-center w-full">
                  {t("cardsComponent.inactiveUsersDescription")}
                </p>
              </div>

              {/* Cursos */}
              <div className="relative bg-[#F8F2F2] text-gray-900 rounded-lg shadow-lg shadow-[#783CDA] hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center">
                <div className="absolute top-[-4rem] left-1/2 transform -translate-x-1/2 text-[#783CDA] text-6xl">
                  <AiFillBook />
                </div>
                <h3 className="text-lg font-semibold mb-0 text-left w-full">
                  {t("cardsComponent.courses")}
                </h3>
                <div className="w-full flex justify-center my-4">
                  <div className="w-20 h-20 bg-[#783CDA] rounded-full flex items-center justify-center">
                    <span className="text-6xl font-bold text-black">
                      {stats.cursos}
                    </span>
                  </div>
                </div>
                <p className="text-center w-full">
                  {t("cardsComponent.coursesDescription")}
                </p>
              </div>

              {/* Usuarios Registrados */}
              <div className="relative bg-[#F8F2F2] text-gray-900 rounded-lg shadow-lg shadow-[#FBBF24] hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center">
                <div className="absolute top-[-4rem] left-1/2 transform -translate-x-1/2 text-[#FBBF24] text-6xl">
                  <HiUserPlus />
                </div>
                <h3 className="text-lg font-semibold mb-0 text-left w-full">
                  {t("cardsComponent.registeredUsers")}
                </h3>
                <div className="w-full flex justify-center my-4">
                  <div className="w-20 h-20 bg-[#FBBF24] rounded-full flex items-center justify-center">
                    <span className="text-6xl font-bold text-black">
                      {stats.usuariosRegistrados}
                    </span>
                  </div>
                </div>
                <p className="text-center w-full">
                  {t("cardsComponent.registeredUsersDescription")}
                </p>
              </div>
            </div>

            {/* Estadísticas de Usuarios y Cursos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               {/* Contenedor de gráficos responsivos */}
              <div className="w-full h-80 bg-[#F8F2F2] shadow-lg p-4 rounded-lg flex flex-col items-center shadow-lg shadow-[#1E1034] hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-lg font-semibold mb-2">{t("cardsComponent.users")}</h3>
                <div className="w-full h-full">
                  <div ref={chartRef} style={{ width: '100%', height: '100%' }}></div>
                </div>
              </div>

              <div className="w-full h-80 bg-[#F8F2F2] shadow-lg p-4 rounded-lg flex flex-col items-center shadow-lg shadow-[#1E1034] hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-lg font-semibold mb-2">{t("cardsComponent.stadisticCourse")}</h3>
                <div className="w-full h-full">
                  <div ref={pieChartRef} style={{ width: '100%', height: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>
    </div>
    
  );
};

export default Cards;
