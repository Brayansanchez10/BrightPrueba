import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/auth.context";
import { useUserContext } from '../../context/user/user.context';
import { FaUser, FaEnvelope, FaGraduationCap, FaBook } from 'react-icons/fa';
import NavigationBar from "../../components/Home/NavigationBar";
import Footer from "../footer";

export default function ViewProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const { getUserById, getUserCourses } = useUserContext();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = id || (authUser && authUser.data && authUser.data.id);
        if (!userId) {
          throw new Error('ID de usuario faltante');
        }
        const userData = await getUserById(parseInt(userId));
        if (!userData) {
          throw new Error('Usuario no encontrado');
        }
        setUser(userData);
        const userCourses = await getUserCourses(parseInt(userId));
        setCourses(userCourses);
      } catch (err) {
        console.error('Error al obtener datos del usuario:', err);
        setError(err.message || 'No se pudieron cargar los datos del usuario. Por favor, intente de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, authUser, getUserById, getUserCourses]);

  useEffect(() => {
    if (error) {
      navigate('/notFound');
    }
  }, [error, navigate]);

  if (loading) {
    return (
      <>
        <NavigationBar />
        <div className="flex justify-center items-center h-screen">Cargando...</div>
      </>
    );
  }

  if (!user) {
    return <NavigationBar />;
  }

  return (
<div>
  <NavigationBar />
  <div className='mt-24'>
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
                    <span>{course.category?.name || 'Sin categoría'}</span>
                  </div>
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
  
  <Footer />
</div>
  );
}