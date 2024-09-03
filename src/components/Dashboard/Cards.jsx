import React, { useState, useEffect } from 'react';
import { useUserContext } from '../../context/user/user.context.jsx';
import { useCoursesContext } from '../../context/courses/courses.context.jsx';
import { useTranslation } from 'react-i18next';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

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
    const activeUsers = usersData.filter(user => user.state);
    const inactiveUsers = usersData.filter(user => !user.state);

    setStats({
      cursos: courses.length,
      usuariosRegistrados: usersData.length,
      usuariosActivos: activeUsers.length,
      usuariosInactivos: inactiveUsers.length,
    });
  }, [usersData, courses]);

  const data = {
    labels: [
      t('cardsComponent.activeUsers'),
      t('cardsComponent.inactiveUsers'),
      t('cardsComponent.courses'),
      t('cardsComponent.registeredUsers')
    ],
    datasets: [
      {
        label: t('cardsComponent.statistics'),
        data: [stats.usuariosActivos, stats.usuariosInactivos, stats.cursos, stats.usuariosRegistrados],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw}`;
          }
        }
      }
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
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-center">
          <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold">{stats.usuariosActivos}</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">{t('cardsComponent.activeUsers')}</h3>
          <p>{t('cardsComponent.activeUsersDescription')}</p>
        </div>
        <div className="bg-gradient-to-r from-red-400 to-red-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-center">
          <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold">{stats.usuariosInactivos}</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">{t('cardsComponent.inactiveUsers')}</h3>
          <p>{t('cardsComponent.inactiveUsersDescription')}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-center">
          <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold">{stats.cursos}</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">{t('cardsComponent.courses')}</h3>
          <p>{t('cardsComponent.coursesDescription')}</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-center">
          <div className="w-16 h-16 bg-yellow-200 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold">{stats.usuariosRegistrados}</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">{t('cardsComponent.registeredUsers')}</h3>
          <p>{t('cardsComponent.registeredUsersDescription')}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">{t('cardsComponent.statistics')}</h2>
        <div className="w-full h-80">
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Cards;
