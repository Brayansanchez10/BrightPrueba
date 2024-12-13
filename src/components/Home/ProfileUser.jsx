import React, { useState, useEffect } from "react";
import NavigationBar from "../Home/NavigationBar";
import { useUserContext } from "../../context/user/user.context";
import { useAuth } from "../../context/auth.context";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Trash2, CircleUserRound, Edit } from "lucide-react";
import { getEntity } from "../../api/user/entities.request";
import Footer from "../footer";
import background from "../../assets/img/background.png";
import profile_fondo from "../../assets/img/profile_fondo.png";
import user_icon from "../../assets/img/user.png";
import email_icon from "../../assets/img/email.png";
import last_name_icon from "../../assets/img/apellido.png";
import name_icon from "../../assets/img/nombre.png";
import entity_icon from "../../assets/img/entidad.png";

const UserProfileSettings = ({ name: initialName, email: initialEmail }) => {
  const { t } = useTranslation("global");
  const { updateUserPartial, getUserById, deleteUser } = useUserContext();
  const { user } = useAuth();
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
  const [documentNumber, setDocumentNumber] = useState("");
  const [entityId, setEntityId] = useState("");
  const [entities, setEntities] = useState([]);
  const [error, setError] = useState(null);

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
          setDocumentNumber(userData.documentNumber || "");
          setEntityId(userData.entityId);

          if (userData.userImage && userData.userImage !== "null") {
            setPreviewProfileImage(userData.userImage);
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    fetchUserId();
  }, [getUserById, user]);

  useEffect(() => {
    async function loadEntities() {
      try {
        const response = await getEntity(); // Llama a tu API para obtener las entidades
        setEntities(response.data);
        console.log("Entidades obtenidas; ", response);
      } catch (error) {
        console.error("Error loading entities:", error);
        setError("Failed to load entities");
      }
    }
    loadEntities();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { 
        setErrors(prev => ({
          ...prev,
          image: t("userProfileSettings.image_too_large")
        }));
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          image: t("userProfileSettings.invalid_image_format")
        }));
        return;
      }
      setProfileImage(file);
      setPreviewProfileImage(URL.createObjectURL(file));
      setDeleteProfileImage(false);
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };
  const validate = () => {
    const newErrors = {
      name: name.length < 5 || name.length > 30 
        ? t("userProfileSettings.name_length_invalid") 
        : "",
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? t("userProfileSettings.invalid_email")
        : email.length > 30
        ? t("userProfileSettings.email_too_long")
        : "",
      firstNames: firstNames.length < 3 || firstNames.length > 60
        ? t("userProfileSettings.firstNames_length_invalid")
        : "",
      lastNames: lastNames.length < 3 || lastNames.length > 60
        ? t("userProfileSettings.lastNames_length_invalid")
        : "",
      documentNumber: documentNumber && documentNumber.length > 20 
        ? t("userProfileSettings.document_too_long")
        : "",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate() && userId) {
      try {
        const userData = {
          username: name,
          email,
          firstNames,
          lastNames,
          documentNumber,
          userImage: deleteProfileImage
            ? null
            : profileImage || previewProfileImage,
          entityId,
        };

        await updateUserPartial(userId, userData);

        Swal.fire({
          icon: "success",
          title: t("userProfileSettings.changes_saved_successfully"),
          showConfirmButton: false,
          timer: 1500,
        });

        setTimeout(() => {
          window.location.reload();
        }, 1500);

        if (deleteProfileImage) {
          setProfileImage(null);
          setPreviewProfileImage(null);
          setDeleteProfileImage(false);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: t("userProfileSettings.failed_to_save_changes"),
          text: error.message,
          showConfirmButton: true,
        });
      }
    } else {
      console.error("Couldn't get user ID");
    }
  };

  const handleDeleteImage = async () => {
    if (userId) {
      const result = await Swal.fire({
        title: t("userProfileSettings.confirm_image_deletion"),
        text: t("userProfileSettings.are_you_sure"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: t("userProfileSettings.yes_delete_it"),
        cancelButtonText: t("userProfileSettings.cancel"),
      });

      if (result.isConfirmed) {
        try {
          await updateUserPartial(userId, {
            username: name,
            email,
            firstNames,
            lastNames,
            userImage: null,
          });

          Swal.fire({
            icon: "success",
            title: t("userProfileSettings.image_deleted_successfully"),
            showConfirmButton: false,
            timer: 3000,
          });

          setProfileImage(null);
          setPreviewProfileImage(null);
          setDeleteProfileImage(false);
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: t("userProfileSettings.failed_to_delete_image"),
            showConfirmButton: false,
            timer: 3000,
          });
        }
      }
    } else {
      console.error("Couldn't get user ID");
    }
  };

  const handleDeleteAccount = async () => {
    Swal.fire({
      title: t("settingsBar.are_you_sure"),
      text: t("settingsBar.cannot_undo"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("settingsBar.yes_delete_account"),
      cancelButtonText: t("settingsBar.cancel"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(user.data.id);
          navigate("/UserDeleteAccount");
        } catch (error) {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: t("settingsBar.problem_deleting"),
          });
        }
      }
    });
  };

  return (
    <div className="bg-primary min-h-screen"
    style={{ backgroundImage: `url(${background})` }}>
      <NavigationBar />
      <div className="justify-center items-center pt-16 w-full">
        <div className="md:mt-3 mt-5 px-4 pb-3 rounded-lg md:flex md:justify-center">
          <div className="max-w-7xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden md:mr-2">
            <div className="flex flex-col justify-center items-center bg-[#24ff8781] py-5 px-6 sm:px-10 mt-0 rounded-3xl"
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
              <form onSubmit={handleSubmit} className="relative grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-6">
              <div className="flex flex-col space-y-3">
                <div className="flex flex-col items-center">
                  <img src={user_icon} alt="Nombre de usuario" className="w-[70px] h-[70px] mb-1" />
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-700 block mb-1"
                    >
                      {t("userProfileSettings.name")}
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="mt-2 p-2 text-sm w-full border border-gray-300 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 hover:bg-gray-100"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-center">
                    <img src={name_icon} alt="Nombres" className="w-[70px] h-[70px] mb-1" />
                    <label
                      htmlFor="firstNames"
                      className="text-sm font-medium text-gray-700 block mb-1"
                    >
                      {t("userProfileSettings.firstNames")}
                    </label>
                    <input
                      type="text"
                      id="firstNames"
                      className="mt-2 p-2 text-sm w-full border border-gray-300 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 hover:bg-gray-100"
                      value={firstNames}
                      onChange={(e) => setFirstNames(e.target.value)}
                    />
                    {errors.firstNames && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstNames}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-center">
                    <img src={user_icon} alt="Numero de documento" className="w-[70px] h-[70px] mb-1" />
                    <label
                      htmlFor="documentNumber"
                      className="text-sm font-medium text-gray-700 block mb-1"
                    >
                      {t("userProfileSettings.documentNumber")}
                    </label>
                    <input
                      type="text"
                      id="documentNumber"
                      className="mt-2 p-2 text-sm w-full border border-gray-300 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 hover:bg-gray-100"
                      value={documentNumber}
                      onChange={(e) => setDocumentNumber(e.target.value)}
                    />
                    {errors.documentNumber && (
                      <p className="text-red-500 text-sm mt-1">{errors.documentNumber}</p>
                    )}
                  </div>
                </div>

                {/* Línea divisora */}
                <div className="hidden sm:flex justify-center items-center w-36 -mt-1">
                  <div className="h-[480px] w-1 bg-gray-300"></div>
                </div>

                <div className="flex flex-col space-y-3">
                  <div className="flex flex-col items-center">
                    <img src={email_icon} alt="Email" className="w-[70px] h-[70px] mb-1" />
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700 block mb-1"
                    >
                      {t("userProfileSettings.email")}
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="mt-2 p-2 w-full text-sm border border-gray-300 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 hover:bg-gray-100"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-center">
                    <img src={last_name_icon} alt="Apellidos" className="w-[70px] h-[70px] mb-1" />
                    <label
                      htmlFor="lastNames"
                      className="text-sm font-medium text-gray-700 block mb-1"
                    >
                      {t("userProfileSettings.lastNames")}
                    </label>
                    <input
                      type="text"
                      id="lastNames"
                      className="mt-2 p-2 text-sm w-full border border-gray-300 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 hover:bg-gray-100"
                      value={lastNames}
                      onChange={(e) => setLastNames(e.target.value)}
                    />
                    {errors.lastNames && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastNames}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-center">
                    <img src={entity_icon} alt="Entidad" className="w-[70px] h-[70px] mb-1" />
                    <label
                      htmlFor="entityId"
                      className="text-sm font-medium text-gray-700 block mb-1"
                    >
                      {t("userProfileSettings.entities")}
                    </label>
                    <select
                      name="entityId"
                      value={entityId}
                      onChange={(e) => setEntityId(e.target.value)}
                      className={`mt-2 p-2 w-full text-sm border border-gray-300 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 hover:bg-gray-100 ${
                        entityId && errors.entityId ? "border-white" : "border-white-300"
                      }`}
                    >
                      <option value="" label={t("register.choose_entity")} />
                      {entities &&
                        entities.length > 0 &&
                        entities
                          .filter((entity) => entity.id !== 1) // Filtra la entidad con id 1
                          .map((entity) => (
                            <option key={entity.id} value={entity.id}>
                              {entity.name}
                            </option>
                          ))}
                    </select>
                    {entityId && errors.entityId && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.entityId}
                      </p>
                    )}
                  </div>
                </div>
                <div className="sm:col-span-3 flex justify-center items-center gap-4 mt-5">
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
      </div>
      <div className="pt-12">
        <Footer />
      </div>
    </div>
  );
};

export default UserProfileSettings;