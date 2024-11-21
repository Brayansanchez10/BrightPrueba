import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUserContext } from '../../context/user/user.context';
import { useCoursesContext } from '../../context/courses/courses.context';
import { FaUser, FaEnvelope, FaGraduationCap, FaBook } from 'react-icons/fa';

export default function PrevUser() {
  const { id } = useParams();
  const { getUserById, getUserCourses } = useUserContext();
  const { getCourse } = useCoursesContext();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!id) {
          throw new Error('ID de usuario faltante');
        }
        const userData = await getUserById(parseInt(id));
        if (!userData) {
          throw new Error('Usuario no encontrado');
        }
        setUser(userData);
        const userCourses = await getUserCourses(parseInt(id));
        const detailedCourses = await Promise.all(
          userCourses.map(async (course) => {
            const fullCourseData = await getCourse(course.id);
            return fullCourseData;
          })
        );
        setCourses(detailedCourses);
      } catch (err) {
        console.error('Error al obtener datos del usuario:', err);
        setError(err.message || 'No se pudieron cargar los datos del usuario. Por favor, intente de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>Usuario no encontrado</div>;
  }

  return (
    <div>
      <div>
        <div>
          <div>
            <div>
              {user.userImage ? (
                <img src={user.userImage} alt={user.username} />
              ) : (
                <div>
                  <FaUser />
                </div>
              )}
            </div>
            <div>
              <h1>{user.username}</h1>
              <p>{user.firstNames} {user.lastNames}</p>
            </div>
          </div>
        </div>
        <div>
          <div>
            <div>
              <FaEnvelope />
              <span>{user.email}</span>
            </div>
            <div>
              <FaGraduationCap />
              <span>{user.role}</span>
            </div>
          </div>
          <div>
            <h2>Cursos Inscritos</h2>
            {courses.length > 0 ? (
              <div>
                {courses.map((course) => (
                  <div key={course.id}>
                    <h3>{course.title}</h3>
                    <div>
                      <FaBook />
                      <span>{course.category}</span>
                    </div>
                    <p>{course.description.substring(0, 100)}...</p>
                    <button>
                      Ver Curso
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No hay cursos inscritos aún.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}