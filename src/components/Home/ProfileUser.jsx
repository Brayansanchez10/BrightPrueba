import React, { useState, useEffect } from "react";
import NavigationBar from "../Home/NavigationBar";
import SettingsBar from "../Home/SettingsUser";
import { useUserContext } from "../../context/user/user.context";
import { useAuth } from "../../context/auth.context";
import { useTranslation } from "react-i18next";
import Swal from 'sweetalert2';

const UserProfileSettings = ({ name: initialName, email: initialEmail }) => {
  const { t } = useTranslation("global");
  const { updateUserPartial, getUserById } = useUserContext();
  const { user } = useAuth();

  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [userId, setUserId] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [previewProfileImage, setPreviewProfileImage] = useState(null);
  const [deleteProfileImage, setDeleteProfileImage] = useState(false);

  // Validation states
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    const fetchUserId = async () => {
      if (user && user.data && user.data.id) {
        try {
          const userData = await getUserById(user.data.id);
          setUserId(userData.id);
          setName(userData.username);
          setEmail(userData.email);

          // Handle userImage correctly
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewProfileImage(URL.createObjectURL(file));
      setDeleteProfileImage(false); // Reset delete flag if new image is selected
    }
  };

  const validateForm = () => {
    let isValid = true;
    if (name.length < 4) {
      setNameError(t("userProfileSettings.name_invalid"));
      isValid = false;
    } else {
      setNameError("");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError(t("userProfileSettings.invalid_email"));
      isValid = false;
    } else {
      setEmailError("");
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm() && userId) {
      try {
        const userData = {
          username: name,
          email,
          userImage: deleteProfileImage ? null : (profileImage || previewProfileImage),
        };
  
        await updateUserPartial(userId, userData);
  
        // Mostrar mensaje de éxito con SweetAlert2
        Swal.fire({
          icon: 'success',
          title: t("userProfileSettings.changes_saved_successfully"),
          showConfirmButton: false,
          timer: 1500, // Duración del mensaje
        });
  
        // Configurar recarga de la página después del tiempo de la alerta
        setTimeout(() => {
          window.location.reload();
        }, 1500); // La duración debe coincidir con timer
  
        if (deleteProfileImage) {
          setProfileImage(null);
          setPreviewProfileImage(null);
          setDeleteProfileImage(false); // Restablecer el indicador después de guardar los cambios
        }
  
      } catch (error) {
        // Mostrar mensaje de error con SweetAlert2
        Swal.fire({
          icon: 'error',
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
      // Mostrar diálogo de confirmación antes de eliminar la imagen
      const result = await Swal.fire({
        title: t('userProfileSettings.confirm_image_deletion'), // Mensaje de confirmación
        text: t('userProfileSettings.are_you_sure'), // Mensaje de advertencia
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: t('userProfileSettings.yes_delete_it'), // Texto del botón de confirmación
        cancelButtonText: t('userProfileSettings.cancel'), // Texto del botón de cancelación
      });
  
      if (result.isConfirmed) {
        try {
          await updateUserPartial(userId, { username: name, email, userImage: null });
  
          Swal.fire({
            icon: 'success',
            title: t('userProfileSettings.image_deleted_successfully'), // Mensaje de éxito
            showConfirmButton: false,
            timer: 3000,
          });
  
          setProfileImage(null);
          setPreviewProfileImage(null);
          setDeleteProfileImage(false); // Reset flag after deletion
  
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: t('userProfileSettings.failed_to_delete_image'), // Mensaje de error
            showConfirmButton: false,
            timer: 3000,
          });
        }
      }
    } else {
      console.error("Couldn't get user ID");
    }
  };

  const transformCloudinaryURL = (imageUrl) => {
    return imageUrl;
  };

  return (
    <div className="bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 min-h-screen ">
      <NavigationBar />
      <div className="flex justify-center 2xl:mt-20">
        <div className="grid grid-cols-1 lg:w-4/12">
          <SettingsBar className="" />
          <form
            onSubmit={handleSubmit}
            className="bg-gradient-to-b from-purple-500 to-violet-800 shadow-lg rounded-lg px-6 mt-2 text-white"
          >
            <div className="mb-4 text-center mt-4">
              <h1 className="font-bold text-white  text-2xl mb-6">
                {t("userProfileSettings.edit_profile")}
              </h1>
              {previewProfileImage && (
                <div className="mb-4">
                  <img
                    src={previewProfileImage}
                    alt="Preview"
                    className="w-20 h-20 rounded-full mx-auto mb-4 shadow-lg"
                  />
                  <button
                    type="button"
                    className="bg-red-500 text-white rounded-lg w-28 hover:bg-red-600 h-6 font-semibold"
                    onClick={handleDeleteImage}
                  >
                    {t("userProfileSettings.deleteImage")}
                  </button>
                </div>
              )}
            </div>
            <div className="mt-2">
              <label
                className="block text-white text-lg font-semibold "
                htmlFor="name"
              >
                {t("userProfileSettings.name")}
              </label>
              <input
                className={`border rounded w-full py-1 text-gray-800 text-sm ${
                  nameError ? "border-red-500" : ""
                }`}
                id="name"
                type="text"
                name="name"
                placeholder={t("userProfileSettings.name")}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (e.target.value.length >= 4) {
                    setNameError("");
                  } else {
                    setNameError(t("userProfileSettings.name_invalid"));
                  }
                }}
              />
              {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
            </div>
            <div className="mt-2">
              <label
                className="block text-white text-lg font-semibold "
                htmlFor="email"
              >
                {t("userProfileSettings.email")}
              </label>
              <input
                className={`rounded w-full text-gray-800 py-1 text-sm ${
                  emailError ? "border-red-500" : ""
                }`}
                id="email"
                type="email"
                name="email"
                placeholder={t("userProfileSettings.email")}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (emailRegex.test(e.target.value)) {
                    setEmailError("");
                  } else {
                    setEmailError(t("userProfileSettings.invalid_email"));
                  }
                }}
                required
              />
              {emailError && (
                <p className="text-red-500 text-sm">{emailError}</p>
              )}
            </div>
            <div className="mt-2">
              <label
                htmlFor="profileImage"
                className="block text-lg font-semibold text-white"
              >
                {t("userProfileSettings.profile_image")}
              </label>
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                className=" p-1 block w-full border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 hover:bg-gray-100"
                onChange={handleImageChange}
              />
            </div>
            <div className="flex items-center justify-center mt-2 mb-2">
              <button
                className="bg-blue-600 px-4 py-2 hover:bg-blue-700 text-white font-medium rounded-lg"
                type="submit"
              >
                {t("userProfileSettings.save")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSettings;
