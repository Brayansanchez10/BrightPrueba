import React, { useState, useEffect } from "react";
import { useUserContext } from "../../../context/user/user.context";
import { useAuth } from "../../../context/auth.context";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { Trash2, Edit, CircleUserRound } from 'lucide-react';
import { getEntity } from "../../../api/user/entities.request";
import profile_fondo from "../../../assets/img/profile_fondo.png";
import user_icon from "../../../assets/img/user.png";
import email_icon from "../../../assets/img/email.png";
import last_name_icon from "../../../assets/img/apellido.png";
import name_icon from "../../../assets/img/nombre.png";
import entity_icon from "../../../assets/img/entidad.png";
import description_icon from "../../../assets/img/descripcion.png";
import specialties_icon from "../../../assets/img/especialidad.png";

const ProfileForm = ({ name: initialName, email: initialEmail }) => {
  const { updateUserPartial, getUserById, deleteUser } = useUserContext();
  const { user } = useAuth();
  const { t } = useTranslation("global");
  const navigate = useNavigate();

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
    if (email.length > 50) {
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

  const handleDeleteAccount = async () => {
    Swal.fire({
      title: t('settingsBar.are_you_sure'),
      text: t('settingsBar.cannot_undo'),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t('settingsBar.yes_delete_account'),
      cancelButtonText: t('settingsBar.cancel'),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(user.data.id);
          console.log("este es el usuario", user);
          console.log("ID del usuario:", user.data.id);

          navigate("/eliminatedCode");
        } catch (error) {
          console.error(error);

          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: t('settingsBar.problem_deleting'),
          });
        }
      }
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-3xl overflow-hidden">
        <div className="flex flex-col justify-center items-center bg-[#24ff8781] py-[15px] px-6 sm:px-10 mt-0 rounded-3xl"
        style={{ backgroundImage: `url(${profile_fondo})` }}>
          <div className="flex flex-col items-center">
            {previewProfileImage ? (
              <img
                src={previewProfileImage}
                alt="Vista previa"
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full shadow-lg object-cover"
              />
            ) : (
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full shadow-lg object-cover">
                  <CircleUserRound className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-white" />
                </div>
              )}
            <div className="flex justify-center items-center space-x-24 sm:space-x-40 -mt-10">
              <div className="relative">
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="profileImage"
                  className="flex items-center justify-center text-white w-10 h-10 bg-blue-400 rounded-full cursor-pointer hover:bg-blue-500 transition duration-300"
                >
                  <Edit size={20} />
                </label>
              </div>
              {previewProfileImage && (
                <button
                  type="button"
                  className="flex w-10 h-10 items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300"
                  onClick={handleDeleteImage}
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 px-6 sm:px-16">
          <form onSubmit={handleSubmit} className="relative grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-6 -mt-2">
            <div className="flex flex-col space-y-3">
              <div className="flex flex-col items-center">
                <img src={user_icon} alt="Nombre de usuario" className="w-[70px] h-[70px] mb-1" />
                <label htmlFor="name" className="text-center text-sm font-medium text-gray-700 block">
                  Nombre de usuario
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm shadow-md placeholder-gray-400
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
              <div className="flex flex-col items-center">
                <img src={name_icon} alt="Nombres" className="w-[70px] h-[70px] mb-1" />
                <label htmlFor="firstNames" className="text-center text-sm font-medium text-gray-700 block">
                  Nombres
                </label>
                <input
                  type="text"
                  id="firstNames"
                  className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm shadow-md placeholder-gray-400
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
              <div className="flex flex-col items-center z-10">
                <img src={specialties_icon} alt="Especialidades" className="w-[70px] h-[70px] mb-1" />
                <label htmlFor="especialidades" className="text-center text-sm font-medium text-gray-700 block">
                  Especialidades
                </label>
                <input
                  type="text"
                  id="especialidades"
                  className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm shadow-md placeholder-gray-400
                            focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                            disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none"
                  value={specialties}
                  onChange={(e) => setSpecialties(e.target.value)}
                  placeholder="Ingrese especialidades separadas por comas"
                />
              </div>
            </div>

            {/* Línea divisora */}
            <div className="hidden sm:flex justify-center items-center w-36 -mt-12">
              <div className="h-[380px] w-1 bg-gray-300"></div>
            </div>

            <div className="flex flex-col space-y-3">
              <div className="flex flex-col items-center">
                <img src={email_icon} alt="Email" className="w-[70px] h-[70px] mb-1" />
                <label htmlFor="email" className="text-center text-sm font-medium text-gray-700 block">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm shadow-md placeholder-gray-400
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
              <div className="flex flex-col items-center">
                <img src={last_name_icon} alt="Apellidos" className="w-[70px] h-[70px] mb-1" />
                <label htmlFor="lastNames" className="text-center text-sm font-medium text-gray-700 block">
                  Apellidos
                </label>
                <input
                  type="text"
                  id="lastNames"
                  className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm shadow-md placeholder-gray-400
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
              <div className="flex flex-col items-center z-10">
                <img src={entity_icon} alt="Entidad" className="w-[70px] h-[70px] mb-1" />
                <label htmlFor="entityId" className="text-center text-sm font-medium text-gray-700 block">
                  Entidad
                </label>
                <select
                  name="entityId"
                  value={entityId}
                  onChange={(e) => setEntityId(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-xl shadow-md
                  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm "
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
            </div>
    
            <div className="sm:col-span-3 -mt-16 flex flex-col items-center">
              <img src={description_icon} alt="Descripción" className="w-[70px] h-[70px] mb-1" />
              <label htmlFor="descripcion" className="text-center text-sm font-medium text-gray-700 block">
                Descripción
              </label>
              <textarea
                id="descripcion"
                className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm shadow-md placeholder-gray-400
                          focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                          disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
            <div className="sm:col-span-3 flex justify-center items-center gap-4">
              <button
                className="bg-[#2dc572] hover:bg-[#24ff87] text-white font-bungee text-sm py-2 w-[200px] rounded-xl transition duration-300"
                type="submit"
              >
                Guardar
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bungee text-sm py-2 w-[200px] rounded-xl transition duration-300"
                type="button"
                onClick={handleDeleteAccount}
              >
                Eliminar cuenta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;