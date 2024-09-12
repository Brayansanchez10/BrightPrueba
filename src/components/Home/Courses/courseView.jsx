import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCoursesContext } from "../../../context/courses/courses.context";
import { useAuth } from "../../../context/auth.context";
import { useUserContext } from "../../../context/user/user.context";
import { Collapse, Button, Rate } from "antd";
import NavigationBar from "../NavigationBar";
import { FaArrowRight } from "react-icons/fa";
import zorro from "../../../assets/img/hola.png";

const { Panel } = Collapse;

const CourseView = () => {
  const { courseId } = useParams();
  const { getCourse } = useCoursesContext();
  const { user } = useAuth();
  const { getUserById } = useUserContext();
  const [username, setUsername] = useState("");
  const [userCourses, setUserCourses] = useState([]);
  const [course, setCourse] = useState(null);
  const [numCursos, setNumCursos] = useState(0);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseData = await getCourse(courseId);
        console.log("Course Data:", courseData);
        setCourse(courseData);
        const instructorData = await getUserById(courseData.instructorId);
        console.log("Instructor Data:", instructorData);
        setUsername(instructorData.username);
      } catch (error) {
        console.error("Error al obtener la información del curso:", error);
      }
    };

    fetchCourse();
  }, [courseId, getCourse, getUserById]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.data && user.data.id) {
        try {
          const userData = await getUserById(user.data.id);
          console.log("User Data:", userData);
          setUserCourses(userData.courses || []);
          setNumCursos(userData.courses ? userData.courses.length : 0);
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error);
        }
      }
    };

    fetchUserData();
  }, [user, getUserById]);

  if (!course) return;

  return (
    <div className="min-h-screen overflow-auto bg-[#242222]">
      <NavigationBar />
      <div className="max-w-screen-xl mx-auto p-6">
        <div className="bg-[#D9D9D9] p-6 rounded-lg shadow-lg mb-8 flex flex-col md:flex-row items-center md:items-start md:justify-between">
          <div className="md:w-2/3 pl-6">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8">
              Curso de {course.title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed max-w-xl">
              En BrightMind, creemos que el aprendizaje nunca termina. Descubre
              el mundo de Python desde lo más básico y construye una sólida base
              de conocimientos. ¡Empieza hoy y abre la puerta a nuevas
              habilidades con BrightMind!
            </p>
            <div className="flex flex-col items-start mb-8 pl-4">
              <span className="text-xl mb-2">Opiniones:</span>
              <Rate disabled defaultValue={4.5} className="text-xl mb-2" />
              <span className="text-lg">4.5/5</span>
            </div>
            <Button className="bg-gradient-to-r from-purple-500 to-emerald-400 text-white rounded-lg px-10 py-5 text-xl font-bold">
              Aprende
            </Button>
          </div>
          <div className="md:w-1/3 text-center">
            <img
              src={zorro}
              alt="Zorro"
              className="w-full h-auto max-w-xl mx-auto"
              style={{
                maxHeight: "350px",
                marginLeft: "0",
                marginBottom: "1rem",
              }}
            />
            <Button className="border-2 border-black text-black font-bold text-2xl px-6 py-4 mt-4">
              Nivel Básico
            </Button>
          </div>
        </div>
        <div className="bg-[#D9D9D9] p-6 rounded-lg shadow-lg flex flex-col md:flex-row">
          <div className="flex-1 md:mr-8">
            <Collapse accordion>
              <Panel
                header={
                  <span className="text-xl font-bold text-black">
                    <FaArrowRight className="inline-block mr-2" />
                    Introducción
                  </span>
                }
                key="1"
                className="bg-white text-black font-bold"
                
              >
                <p>No se que poner:v</p>
              </Panel>
              <Panel
                header={
                  <span className="text-xl font-bold text-black">
                    <FaArrowRight className="inline-block mr-2" />
                    Conceptos Básicos
                  </span>
                }
                key="2"
                className="bg-white text-black font-bold"
                showArrow={false}
              >
                <p>Descripcion del curso</p>
                <div className="flex justify-end mt-8">
                  <Button className="bg-gradient-to-r from-purple-500 to-emerald-400 text-white rounded-lg px-10 py-5 text-xl font-bold">
                    Comienza ahora
                  </Button>
                </div>
              </Panel>
              <Panel
                header={
                  <span className="text-xl font-bold text-black">
                    <FaArrowRight className="inline-block mr-2" />
                    Introducción
                  </span>
                }
                key="3"
                className="bg-white text-black font-bold"
                showArrow={false}
              >
                <p>No se que poner:v</p>
              </Panel>
              <Panel
                header={
                  <span className="text-xl font-bold text-black">
                    <FaArrowRight className="inline-block mr-2" />
                    Introducción
                  </span>
                }
                key="4"
                className="bg-white text-black font-bold"
                showArrow={false}
              >
                <p>No se que poner:v</p>
              </Panel>
              <Panel
                header={
                  <span className="text-xl font-bold text-black">
                    <FaArrowRight className="inline-block mr-2" />
                    Introducción
                  </span>
                }
                key="5"
                className="bg-white text-black font-bold"
                showArrow={false}
              >
                <p>No se que poner:v</p>
              </Panel>
              <Panel
                header={
                  <span className="text-xl font-bold text-black">
                    <FaArrowRight className="inline-block mr-2" />
                    Introducción
                  </span>
                }
                key="6"
                className="bg-white text-black font-bold"
                showArrow={false}
              >
                <p>No se que poner:v</p>
              </Panel>
            </Collapse>
          </div>
          <div className="w-full md:w-64 bg-white p-4 rounded-lg shadow-md mt-8 md:mt-0">
            <img
              src={course.image}
              alt="Imagen del curso"
              className="w-full h-auto rounded mb-4"
            />
            <div className="text-center">
              <p className="text-lg font-bold mt-4">
                Instructor: {user.data.username}
              </p>
              <p className="text-lg font-bold">Cursos: {numCursos}</p>
              {userCourses.length > 0 ? (
                <ul className="">
                  {userCourses.map((userCourse, index) => (
                    <li key={index}>{userCourse.title}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-md mt-2">
                  No estás registrado en ningún curso.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseView;
