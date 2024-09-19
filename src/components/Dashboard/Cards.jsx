import React, { useState, useEffect } from "react";
import { useUserContext } from "../../context/user/user.context.jsx";
import { useCoursesContext } from "../../context/courses/courses.context.jsx";
import { useTranslation } from "react-i18next";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from "chart.js";
import { AiFillBook } from "react-icons/ai";
import { FaUsersSlash } from "react-icons/fa";
import { HiMiniUsers } from "react-icons/hi2";
import { HiUserPlus } from "react-icons/hi2";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
);

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

  const userStatsData = {
    labels: [
      t("cardsComponent.activeUsers"),
      t("cardsComponent.inactiveUsers"),
      t("cardsComponent.registeredUsers"),
    ],
    datasets: [
      {
        label: t("cardsComponent.userStatistics"),
        data: [
          stats.usuariosActivos,
          stats.usuariosInactivos,
          stats.usuariosRegistrados,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const coursesData = {
    labels: [t("cardsComponent.courses")],
    datasets: [
      {
        label: t("cardsComponent.courseCount"),
        data: [stats.cursos],
        backgroundColor: ["rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const optionsBar = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
      },
    },
  };

  const optionsDoughnut = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw}`;
          },
        },
      },
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
      },
    },
  };

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
              {/* Gráfico de Usuarios */}
              <div className="w-full h-80 bg-[#F8F2F2] shadow-lg p-4 rounded-lg flex flex-col items-center shadow-lg shadow-[#0080B2] hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-lg font-semibold mb-0 text-left w-full">
                  {t("cardsComponent.users")}
                </h3>
                <div className="w-full h-full">
                  <Bar data={userStatsData} options={optionsBar} />
                </div>
              </div>

              {/* Gráfico de Cursos */}
              <div className="w-full h-80 bg-[#F8F2F2] shadow-lg p-4 rounded-lg flex flex-col items-center shadow-lg shadow-[#0080B2] hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-lg font-semibold mb-0 text-left w-full">
                  {t("cardsComponent.stadisticCourse")}
                </h3>
                <div className="w-full h-full">
                  <Doughnut  data={coursesData} options={optionsDoughnut} />
                </div>
              </div>
            </div>
          </div>
    </div>
    
  );
};

export default Cards;
