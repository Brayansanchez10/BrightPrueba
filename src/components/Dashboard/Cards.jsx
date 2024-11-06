import React, { useState, useEffect, useRef } from "react";
import { useUserContext } from "../../context/user/user.context.jsx";
import { useCoursesContext } from "../../context/courses/courses.context.jsx";
import { useTranslation } from "react-i18next";
import * as echarts from "echarts";

import { FaGraduationCap, FaUserSlash, FaUserCheck, FaUserPlus } from "react-icons/fa";

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

  const chartRef = useRef(null);
  const pieChartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current && usersData.length > 0) {
      let myChart = echarts.init(chartRef.current);

      const updateChart = () => {
        myChart.dispose();
        myChart = echarts.init(chartRef.current);

        const htmlElement = document.documentElement;
        const isDarkMode = htmlElement.classList.contains('dark');
        const textColor = isDarkMode ? '#ffffff' : '#1E1034';

        const usersByMonth = usersData.reduce((acc, user) => {
          const date = new Date(user.createdAt);
          const month = date.getMonth();
          if (!acc[month]) {
            acc[month] = { total: 0, active: 0, inactive: 0 };
          }
          acc[month].total++;
          if (user.state) {
            acc[month].active++;
          } else {
            acc[month].inactive++;
          }
          return acc;
        }, {});

        const months = [
          t("months.january"),
          t("months.february"),
          t("months.march"),
          t("months.april"),
          t("months.may"),
          t("months.june"),
          t("months.july"),
          t("months.august"),
          t("months.september"),
          t("months.october"),
          t("months.november"),
          t("months.december"),
        ];

        const activeData = new Array(12).fill(0);
        const inactiveData = new Array(12).fill(0);
        const totalData = new Array(12).fill(0);

        for (let i = 0; i < 12; i++) {
          if (usersByMonth[i]) {
            activeData[i] = Math.round(usersByMonth[i].active);
            inactiveData[i] = Math.round(usersByMonth[i].inactive);
            totalData[i] = Math.round(usersByMonth[i].total);
          }
        }

        const option = {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
            },
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
          },
          xAxis: {
            type: "category",
            data: months,
            axisTick: {
              alignWithLabel: true,
            },
            axisLabel: {
              color: textColor
            }
          },
          yAxis: {
            type: "value",
            minInterval: 1,
            axisLabel: {
              color: textColor
            }
          },
          series: [
            {
              name: t("cardsComponent.activeUsers"),
              type: "line",
              data: activeData,
              itemStyle: {
                color: "#31BF71",
              },
            },
            {
              name: t("cardsComponent.inactiveUsers"),
              type: "line",
              data: inactiveData,
              itemStyle: {
                color: "#F45442",
              },
            },
            {
              name: t("cardsComponent.registeredUsers"),
              type: "line",
              data: totalData,
              itemStyle: {
                color: "#FBBF24",
              },
            },
          ],
        };

        myChart.setOption(option);
      };

      updateChart();

      const observer = new MutationObserver(updateChart);

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });

      const handleResize = () => myChart.resize();
      window.addEventListener("resize", handleResize);

      return () => {
        myChart.dispose();
        window.removeEventListener("resize", handleResize);
        observer.disconnect();
      };
    }
  }, [usersData, t]);

  useEffect(() => {
    if (pieChartRef.current) {
      let myChart = echarts.init(pieChartRef.current);

      const updatePieChart = () => {
        myChart.dispose();
        myChart = echarts.init(pieChartRef.current);

        const htmlElement = document.documentElement;
        const isDarkMode = htmlElement.classList.contains('dark');
        const textColor = isDarkMode ? '#ffffff' : '#1E1034';

        const coursesByCategory = courses.reduce((acc, course) => {
          if (!acc[course.category]) {
            acc[course.category] = [];
          }
          acc[course.category].push(course);
          return acc;
        }, {});
        const colors = ['#ff9999', '#66b3ff', '#99ff99', '#ffcc99', '#ff9999', '#66b3ff'];
        
        const data = Object.entries(coursesByCategory).map(([category, courses], index) => ({
          value: Math.round(courses.length),
          name: category,
          itemStyle: {
            color: colors[index % colors.length]
          }
        }));

        const isResponsive = window.innerWidth < 768;

        const option = {
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            textStyle: {
              color: textColor
            },
            show: !isResponsive
          },
          series: [
            {
              name: t("cardsComponent.StatisticsCoures"),
              type: 'pie',
              radius: isResponsive ? ['30%', '70%'] : ['40%', '70%'],
              avoidLabelOverlap: false,
              label: {
                show: isResponsive,
                position: 'inside',
                formatter: isResponsive ? '{b}\n{c}' : '',
                fontSize: 12,
                color: textColor
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: isResponsive ? 14 : 18,
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: data
            }
          ]
        };

        myChart.setOption(option);
      };

      updatePieChart();

      const observer = new MutationObserver(updatePieChart);

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });

      const handleResize = () => {
        myChart.resize();
        updatePieChart();
      };
      window.addEventListener("resize", handleResize);

      return () => {
        myChart.dispose();
        window.removeEventListener("resize", handleResize);
        observer.disconnect();
      };
    }
  }, [courses, t]);

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
    <div className="bg-primaryAdmin overflow-hidden min-h-screen">
      <div className="p-4 md:p-20 space-y-6 md:space-y-12">
        <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-4 mb-16 md:mb-0">
          <h1 className="text-primary text-3xl relative font-bungee mb-0 top-0 md:top-[-4rem] text-left">
            {t("cardsComponent.stadisticTitle")}
          </h1>
          <h1 className="text-[#783CDA] dark:text-secondary text-3xl relative font-bungee mb-0 top-0 md:top-[-4rem] text-left">
            {t("cardsComponent.stadisticTitle1")}
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-16 md:gap-24 mt-16 md:mt-[-2rem]">
          <div className="relative bg-secondaryAdmin text-primary rounded-lg shadow-lg shadow-[#31BF71] hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center w-full mt-12 md:mt-0">
            <div className="absolute top-[-5rem] md:top-[-5.5rem] left-1/2 transform -translate-x-1/2 text-[#31BF71] text-5xl md:text-6xl">
              <FaUserCheck />
            </div>
            <h3 className="text-lg font-bungee mb-3 text-center w-full mt-2 md:mt-0">
              {t("cardsComponent.activeUsers")}
            </h3>
            <div className="w-full flex justify-center my-3">
              <div className="w-20 h-20 bg-[#31BF71] rounded-full flex items-center justify-center">
                <span className="text-5xl font-bold text-white leading-none">
                  {stats.usuariosActivos}
                </span>
              </div>
            </div>
            <p className="text-center w-full text-ls font-medium mt-2">
              {t("cardsComponent.activeUsersDescription")}
            </p>
          </div>
          <div className="relative bg-secondaryAdmin text-primary rounded-lg shadow-lg shadow-[#F45442] hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center w-full mt-12 md:mt-0">
            <div className="absolute top-[-5rem] md:top-[-5.5rem] left-1/2 transform -translate-x-1/2 text-[#F45442] text-5xl md:text-6xl">
              <FaUserSlash />
            </div>
            <h3 className="text-lg font-bungee mb-3 text-center w-full mt-2 md:mt-0">
              {t("cardsComponent.inactiveUsers")}
            </h3>
            <div className="w-full flex justify-center my-3">
              <div className="w-20 h-20 bg-[#F45442] rounded-full flex items-center justify-center">
                <span className="text-5xl font-bold text-white leading-none">
                  {stats.usuariosInactivos}
                </span>
              </div>
            </div>
            <p className="text-center w-full text-ls font-medium mt-2">
              {t("cardsComponent.inactiveUsersDescription")}
            </p>
          </div>
          <div className="relative bg-secondaryAdmin text-primary rounded-lg shadow-lg shadow-[#783CDA] hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center w-full mt-12 md:mt-0">
            <div className="absolute top-[-5rem] md:top-[-5.5rem] left-1/2 transform -translate-x-1/2 text-[#783CDA] text-5xl md:text-6xl">
              <FaGraduationCap />
            </div>
            <h3 className="text-lg font-bungee mb-3 text-center w-full mt-2 md:mt-0">
              {t("cardsComponent.courses")}
            </h3>
            <div className="w-full flex justify-center my-3">
              <div className="w-20 h-20 bg-[#783CDA] rounded-full flex items-center justify-center">
                <span className="text-5xl font-bold text-white leading-none">
                  {stats.cursos}
                </span>
              </div>
            </div>
            <p className="text-center w-full text-ls font-medium mt-2">
              {t("cardsComponent.coursesDescription")}
            </p>
          </div>
          <div className="relative bg-secondaryAdmin text-primary rounded-lg shadow-lg shadow-[#FBBF24] hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center w-full mt-12 md:mt-0">
            <div className="absolute top-[-5rem] md:top-[-5.5rem] left-1/2 transform -translate-x-1/2 text-[#FBBF24] text-5xl md:text-6xl">
              <FaUserPlus />
            </div>
            <h3 className="text-lg font-bungee mb-3 text-center w-full mt-2 md:mt-0">
              {t("cardsComponent.registeredUsers")}
            </h3>
            <div className="w-full flex justify-center my-3">
              <div className="w-20 h-20 bg-[#FBBF24] rounded-full flex items-center justify-center">
                <span className="text-5xl font-bold text-white leading-none">
                  {stats.usuariosRegistrados}
                </span>
              </div>
            </div>
            <p className="text-center w-full text-ls font-medium mt-2">
              {t("cardsComponent.registeredUsersDescription")}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-20 md:mt-8">
          <div className="w-full h-80 bg-secondaryAdmin text-primary rounded-lg shadow-lg p-4 flex flex-col items-start shadow-[#1E1034] hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-black mb-2 text-left w-full">
              {t("cardsComponent.users")}
            </h3>
            <div className="w-full h-full">
              <div
                ref={chartRef}
                style={{ width: "100%", height: "100%" }}
              ></div>
            </div>
          </div>

          <div className="w-full h-80 bg-secondaryAdmin text-primary rounded-lg shadow-lg p-4 flex flex-col items-start shadow-[#1E1034] hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-black mb-2 text-left w-full">
              {t("cardsComponent.stadisticCourse")}
            </h3>
            <div className="w-full h-full">
              <div
                ref={pieChartRef}
                style={{ width: "100%", height: "100%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;