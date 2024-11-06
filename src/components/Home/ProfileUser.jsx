import React, { useState, useEffect } from "react";
import NavigationBar from "../Home/NavigationBar";
import SettingsBar from "../Home/SettingsUser";
import { useUserContext } from "../../context/user/user.context";
import { useAuth } from "../../context/auth.context";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { Trash2 } from "lucide-react";
import { getEntity } from "../../api/user/entities.request";

const UserProfileSettings = ({ name: initialName, email: initialEmail }) => {
  const { t } = useTranslation("global");
  const { updateUserPartial, getUserById } = useUserContext();
  const { user } = useAuth();

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

  return (
    <div className="bg-primary min-h-screen">
      <NavigationBar />
      <div className="justify-center items-center pt-16 w-full">
        <div className="md:mt-3 mt-5 px-4 pb-3 rounded-lg">
          <div className="max-w-lg w-full mx-auto bg-secondary rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#783CDA] to-[#200E3E] py-4 px-6 md:px-10">
              <h1 className="text-center font-black text-white md:text-xl lg:text-2xl">
                {t("userProfileSettings.edit_profile")}
              </h1>
            </div>
            <div className="p-6 md:p-10">
              <div className="flex items-center mb-6">
                <div className="relative">
                  {previewProfileImage && (
                    <img
                      src={previewProfileImage}
                      alt="Preview"
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-lg"
                    />
                  )}
                  {previewProfileImage && (
                    <button
                      type="button"
                      className="absolute bottom-0 right-0 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                      onClick={handleDeleteImage}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className={`${!previewProfileImage ? 'flex-grow' : 'ml-4'}`}>
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    className="w-full border text-sm border-gray-300 dark:border-purple-800 rounded-md p-2 dark:text-primary hover:bg-primary transition-colors duration-300"
                    onChange={handleImageChange}
                  />
                  {errors.image && (
                    <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                  )}
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="text-base font-bold text-primary block mb-2"
                  >
                    {t("userProfileSettings.name")}
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="mt-2 p-2 text-sm w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 hover:bg-gray-100"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="documentNumber"
                    className="text-base font-bold text-primary block mb-2"
                  >
                    {t("userProfileSettings.documentNumber")}
                  </label>
                  <input
                    type="text"
                    id="documentNumber"
                    className="mt-2 p-2 text-sm w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 hover:bg-gray-100"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                  />
                  {errors.documentNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.documentNumber}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="firstNames"
                    className="text-base font-bold text-primary block mb-2"
                  >
                    {t("userProfileSettings.firstNames")}
                  </label>
                  <input
                    type="text"
                    id="firstNames"
                    className="mt-2 p-2 text-sm w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 hover:bg-gray-100"
                    value={firstNames}
                    onChange={(e) => setFirstNames(e.target.value)}
                  />
                  {errors.firstNames && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstNames}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="lastNames"
                    className="text-base font-bold text-primary block mb-2"
                  >
                    {t("userProfileSettings.lastNames")}
                  </label>
                  <input
                    type="text"
                    id="lastNames"
                    className="mt-2 p-2 text-sm w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 hover:bg-gray-100"
                    value={lastNames}
                    onChange={(e) => setLastNames(e.target.value)}
                  />
                  {errors.lastNames && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastNames}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="text-base font-bold text-primary block mb-2"
                  >
                    {t("userProfileSettings.email")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="mt-2 p-2 w-full text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 hover:bg-gray-100"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="entityId"
                    className="text-base font-bold text-primary block mb-2"
                  >
                    {t("userProfileSettings.entities")}
                  </label>
                  <select
                    name="entityId"
                    value={entityId}
                    onChange={(e) => setEntityId(e.target.value)}
                    className={`mt-2 p-2 w-full text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 hover:bg-gray-100 ${
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
                <div className="flex justify-between items-center mt-6">
                  <button
                    className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                    type="submit"
                  >
                    {t("userProfileSettings.save")}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <SettingsBar className="" />
        </div>
      </div>
    </div>
  );
};

export default UserProfileSettings;