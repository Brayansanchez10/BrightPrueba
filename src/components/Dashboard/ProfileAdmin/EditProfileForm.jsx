import React, { useState, useEffect } from "react";
import { useUserContext } from "../../../context/user/user.context";
import { useAuth } from "../../../context/auth.context";
import { useTranslation } from "react-i18next";
import Swal from 'sweetalert2';
import { Trash2 } from 'lucide-react';
import { getEntity } from "../../../api/user/entities.request";

const ProfileForm = ({ name: initialName, email: initialEmail }) => {
  const { updateUserPartial, getUserById } = useUserContext();
  const { user } = useAuth();
  const { t } = useTranslation("global");

  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [firstNames, setFirstNames] = useState("");
  const [lastNames, setLastNames] = useState("");
  const [userId, setUserId] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [previewProfileImage, setPreviewProfileImage] = useState(null);
  const [deleteProfileImage, setDeleteProfileImage] = useState(false);
  const [errors, setErrors] = useState({});

  const [entityId, setEntityId] = useState("");
  const [entities, setEntities] = useState([]);
  const [error, setError] = useState(null);

  const [description, setDescription] = useState("");
  const [specialties, setSpecialties] = useState("");

  useEffect(() => {
    const fetchUserId = async () => {
      if (user && user.data && user.data.id) {
        try {
          const userData = await getUserById(user.data.id);
          setUserId(userData.id);
          setName(userData.username);
          setEmail(userData.email);
          setFirstNames(userData.firstNames);
          setLastNames(userData.lastNames);
          setEntityId(userData.entityId);
          setDescription(userData.description || "");
          setSpecialties(userData.specialties || "");

          if (userData.userImage && userData.userImage !== "null") {
            setPreviewProfileImage(userData.userImage);
          }
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error);
        }
      }
    };

    fetchUserId();
  }, [getUserById, user]);

  useEffect(() => {
    async function loadEntities() {
      try {
        const response = await getEntity();
        setEntities(response.data);
      } catch (error) {
        console.error("Error al cargar entidades:", error);
        setError("Error al cargar entidades");
      }
    }
    loadEntities();
  }, []);

  const validateName = (name) => {
    if (name.length < 5 || name.length > 30) {
      return "El nombre debe tener entre 5 y 30 caracteres";
    }
    return "";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Email inválido";
    }
    if (email.length > 30) {
      return "El email no debe exceder los 30 caracteres";
    }
    return "";
  };

  const validateFirstNames = (firstNames) => {
    if (firstNames.length < 3 || firstNames.length > 60) {
      return "Los nombres deben tener entre 3 y 60 caracteres";
    }
    return "";
  };

  const validateLastNames = (lastNames) => {
    if (lastNames.length < 3 || lastNames.length > 60) {
      return "Los apellidos deben tener entre 3 y 60 caracteres";
    }
    return "";
  };

  const validateImage = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      return "La imagen no debe exceder 5MB";
    }
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      return "Formato de imagen inválido. Use JPEG, PNG o GIF";
    }
    return "";
  };

  const validate = () => {
    const newErrors = {
      name: validateName(name),
      email: validateEmail(email),
      firstNames: validateFirstNames(firstNames),
      lastNames: validateLastNames(lastNames),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      if (userId) {
        try {
          const userData = {
            username: name,
            email,
            firstNames,
            lastNames,
            userImage: deleteProfileImage ? null : (profileImage || previewProfileImage),
            entityId,
            description,
            specialties,
          };

          await updateUserPartial(userId, userData);
          
          Swal.fire({
            icon: 'success',
            title: "Cambios guardados exitosamente",
            showConfirmButton: false,
            timer: 750,
          });

          setTimeout(() => {
            window.location.reload();
          }, 750);

          if (deleteProfileImage) {
            setProfileImage(null);
            setPreviewProfileImage(null);
            setDeleteProfileImage(false);
          }
        } catch (error) {
          console.error("Error al actualizar el usuario:", error);
          Swal.fire({
            icon: 'error',
            title: "Error al guardar los cambios",
            text: error.message,
            confirmButtonText: 'OK',
            timer: 3000,
          });
        }
      } else {
        console.error("No se pudo obtener el ID del usuario");
      }
    }
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    setErrors((prevErrors) => ({
      ...prevErrors,
      name: validateName(newName),
    }));
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setErrors((prevErrors) => ({
      ...prevErrors,
      email: validateEmail(newEmail),
    }));
  };

  const handleFirstNamesChange = (e) => {
    const newFirstNames = e.target.value;
    setFirstNames(newFirstNames);
    setErrors((prevErrors) => ({
      ...prevErrors,
      firstNames: validateFirstNames(newFirstNames),
    }));
  };

  const handleLastNamesChange = (e) => {
    const newLastNames = e.target.value;
    setLastNames(newLastNames);
    setErrors((prevErrors) => ({
      ...prevErrors,
      lastNames: validateLastNames(newLastNames),
    }));
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    if (imageFile) {
      const imageError = validateImage(imageFile);
      if (imageError) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          image: imageError,
        }));
      } else {
        setProfileImage(imageFile);
        setPreviewProfileImage(URL.createObjectURL(imageFile));
        setDeleteProfileImage(false);
        setErrors((prevErrors) => ({
          ...prevErrors,
          image: "",
        }));
      }
    }
  };

  const handleDeleteImage = async () => {
    if (userId) {
      const result = await Swal.fire({
        title: "¿Confirmar eliminación de imagen?",
        text: "¿Estás seguro?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      });

      if (result.isConfirmed) {
        try {
          await updateUserPartial(userId, { username: name, email, firstNames, lastNames, userImage: null, description, specialties});

          Swal.fire({
            icon: 'success',
            title: "Imagen eliminada exitosamente",
            showConfirmButton: false,
            timer: 3000,
          });

          setProfileImage(null);
          setPreviewProfileImage(null);
          setDeleteProfileImage(false);

        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: "Error al eliminar la imagen",
            text: error.message,
            showConfirmButton: false,
            timer: 3000,
          });
        }
      }
    } else {
      console.error("No se pudo obtener el ID del usuario");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-6 px-6 sm:px-10 mt-0">
          <h1 className="text-center font-bold text-white text-2xl sm:text-3xl lg:text-4xl">
            Editar Perfil
          </h1>
        </div>
        <div className="p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row items-center mb-8">
            <div className="relative mb-4 sm:mb-0 sm:mr-6">
              {previewProfileImage && (
                <img
                  src={previewProfileImage}
                  alt="Vista previa"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full shadow-lg object-cover"
                />
              )}
              {previewProfileImage && (
                <button
                  type="button"
                  className="absolute bottom-0 right-0 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition duration-300"
                  onClick={handleDeleteImage}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            <div className="flex-grow">
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 transition duration-300"
                onChange={handleImageChange}
              />
              {errors.image && (
                <p className="text-red-500 text-sm mt-2">{errors.image}</p>
              )}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="text-sm font-medium text-gray-700 block mb-2">
                Nombre de usuario
              </label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                          focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                          disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none
                          invalid:border-pink-500 invalid:text-pink-600
                          focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                value={name}
                onChange={handleNameChange}
                maxLength={50}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                          focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                          disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none
                          invalid:border-pink-500 invalid:text-pink-600
                          focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                value={email}
                onChange={handleEmailChange}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="firstNames" className="text-sm font-medium text-gray-700 block mb-2">
                Nombres
              </label>
              <input
                type="text"
                id="firstNames"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                          focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                          disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none
                          invalid:border-pink-500 invalid:text-pink-600
                          focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                value={firstNames}
                onChange={handleFirstNamesChange}
                maxLength={50}
              />
              {errors.firstNames && (
                <p className="text-red-500 text-xs mt-1">{errors.firstNames}</p>
              )}
            </div>
            <div>
              <label htmlFor="lastNames" className="text-sm font-medium text-gray-700 block mb-2">
                Apellidos
              </label>
              <input
                type="text"
                id="lastNames"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                          focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                          disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none
                          invalid:border-pink-500 invalid:text-pink-600
                          focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                value={lastNames}
                onChange={handleLastNamesChange}
                maxLength={50}
              />
              {errors.lastNames && (
                <p className="text-red-500 text-xs mt-1">{errors.lastNames}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="entityId" className="text-sm font-medium text-gray-700 block mb-2">
                Entidad
              </label>
              <select
                name="entityId"
                value={entityId}
                onChange={(e) => setEntityId(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Seleccione una entidad</option>
                {entities &&
                  entities.length > 0 &&
                  entities
                    .filter((entity) => entity.id !== 1)
                    .map((entity) => (
                      <option key={entity.id} value={entity.id}>
                        {entity.name}
                      </option>
                    ))}
              </select>
              {entityId && errors.entityId && (
                <p className="text-red-500 text-xs mt-1">{errors.entityId}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="descripcion" className="text-sm font-medium text-gray-700 block mb-2">
                Descripción
              </label>
              <textarea
                id="descripcion"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                          focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                          disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="especialidades" className="text-sm font-medium text-gray-700 block mb-2">
                Especialidades
              </label>
              <input
                type="text"
                id="especialidades"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                          focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                          disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none"
                value={specialties}
                onChange={(e) => setSpecialties(e.target.value)}
                placeholder="Ingrese especialidades separadas por comas"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end mt-6">
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300"
                type="submit"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;