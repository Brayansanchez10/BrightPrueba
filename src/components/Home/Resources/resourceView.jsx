import React, { useEffect, useState } from "react";
import "./resourceView.css";
import NavigationBar from "../NavigationBar";
import { useResourceContext } from "../../../context/courses/resource.contex";
import { useAuth } from "../../../context/auth.context";
import { useUserContext } from "../../../context/user/user.context";

const ResourceView = () => {
  const { getResourceUser } = useResourceContext();
  const { user } = useAuth();
  const { getUserById } = useUserContext();
  const [username, setUsername] = useState("");
  const [resource, setResource] = useState(null);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        // Usar el ID fijo en lugar de courseId
        const fixedCourseId = "66e1eff8a6e6e46e6911ba78";
        const resourceData = await getResourceUser(fixedCourseId);
        setResource(resourceData);
      } catch (error) {
        console.error("Error al obtener la información del curso:", error);
      }
    };

    fetchResource();
  }, [getResourceUser]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.data && user.data.id) {
        try {
          const userData = await getUserById(user.data.id);
          setUsername(userData.username);
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error);
        }
      }
    };

    fetchUserData();
  }, [user, getUserById]);

  if (!resource) return <div>Loading...</div>;

  return (
    <div className="bg-gray-950 min-h-screen flex flex-col">
      <NavigationBar />

      <div className="flex flex-grow flex-col lg:flex-row overflow-hidden">
        {/* Left */}
        <div className="w-full lg:w-1/12 h-36 lg:h-screen bg-gray-300 p-4 lg:p-6 flex lg:flex-col items-center rounded-2xl overflow-x-scroll lg:overflow-y-scroll custom-scrollbar space-x-4 lg:space-x-0 lg:space-y-4">
          {Array(12)
            .fill()
            .map((_, index) => (
              <div
                key={index}
                className="w-16 h-16 bg-white rounded-full flex-shrink-0"
              ></div>
            ))}
        </div>

        {/* Middle */}
        <div className="w-full lg:w-7/12 p-4 lg:p-6 flex flex-col">
          <div
            className="h-60 lg:h-[70%] flex-grow bg-cover bg-center mb-4 flex-shrink-0 rounded-2xl"
            style={{
              backgroundImage:
                "url(https://blog.jumboprinters.com/wp-content/uploads/2021/09/consejos-imagenes.jpg)",
            }}
          ></div>

          <div className="h-auto lg:h-[30%] flex-grow bg-gray-300 p-4 rounded-2xl">
            <div className="bg-white flex p-2 rounded-xl mb-4">
              <div className="bg-gray-300 w-10 h-10 rounded-full mr-2"></div>
              <h2 className="text-lg lg:text-2xl font-bold">
                {resource.title || "Título del Recurso"}
              </h2>
            </div>
            <div className="bg-white rounded-xl p-2">
              <p className="break-words">{resource.description || "Descripción del Recurso"}</p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="w-full lg:w-4/12 p-4 lg:p-6 flex flex-col space-y-4">
          <div className="h-48 lg:h-[65%] bg-gray-300 p-4 rounded-2xl flex-grow">
            <h2 className="font-bold mb-2">Comentarios</h2>
            <textarea
              className="w-full p-2 bg-white rounded-xl mb-4"
              rows="3"
              lg:rows="6"
              placeholder="Escribe tu comentario"
            ></textarea>

            <div className="space-y-6">
              <p className="font-bold text-center">Próximamente</p>
            </div>
          </div>

          <div className="h-32 lg:h-[35%] bg-gray-300 p-4 rounded-2xl flex-grow">
            <div className="font-bold">Notas</div>
            <p className="font-bold text-center mt-10">Próximamente</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceView;
