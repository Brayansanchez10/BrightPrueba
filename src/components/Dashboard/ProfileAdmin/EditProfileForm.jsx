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

  const validateName = (name) => {
    if (name.length < 5 || name.length > 30) {
      return t('userProfileSettings.name_length_invalid');
    }
    return "";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return t('userProfileSettings.invalid_email');
    }
    if (email.length > 30) {
      return t('userProfileSettings.email_too_long');
    }
    return "";
  };

  const validateFirstNames = (firstNames) => {
    if (firstNames.length < 3 || firstNames.length > 60) {
      return t('userProfileSettings.firstNames_length_invalid');
    }
    return "";
  };

  const validateLastNames = (lastNames) => {
    if (lastNames.length < 3 || lastNames.length > 60) {
      return t('userProfileSettings.lastNames_length_invalid');
    }
    return "";
  };

  const validateImage = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      return t('userProfileSettings.image_too_large');
    }
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      return t('userProfileSettings.invalid_image_format');
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
          };

          await updateUserPartial(userId, userData);

          Swal.fire({
            icon: 'success',
            title: t("userProfileSettings.changes_saved_successfully"),
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
          Swal.fire({
            icon: 'error',
            title: t('userProfileSettings.failed_to_save_changes'),
            text: error.message,
            confirmButtonText: 'OK',
            timer: 3000,
          });
        }
      } else {
        console.error("Couldn't get user ID");
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
        title: t('userProfileSettings.confirm_image_deletion'),
        text: t('userProfileSettings.are_you_sure'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: t('userProfileSettings.yes_delete_it'),
        cancelButtonText: t('userProfileSettings.cancel'),
      });

      if (result.isConfirmed) {
        try {
          await updateUserPartial(userId, { username: name, email, firstNames, lastNames, userImage: null });

          Swal.fire({
            icon: 'success',
            title: t('userProfileSettings.image_deleted_successfully'),
            showConfirmButton: false,
            timer: 3000,
          });

          setProfileImage(null);
          setPreviewProfileImage(null);
          setDeleteProfileImage(false);

        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: t('userProfileSettings.failed_to_delete_image'),
            text: error.message,
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
    <div className="md:mt-3 mt-5 mx-4 mb-2 flex rounded-lg">
      <div className="max-w-lg w-full mx-auto bg-secondaryAdmin rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-[#783CDA] to-[#200E3E] py-4 px-6 md:px-10">
          <h1 className="text-center font-black text-white md:text-xl lg:text-2xl">
            {t('userProfileSettings.edit_profile')}
          </h1>
        </div>
        <div className="p-6 md:p-10">
          <div className="flex items-center mb-6">
            <div className="relative flex-shrink-0">
              {previewProfileImage && (
                <img
                  src={previewProfileImage}
                  alt="Preview"
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full shadow-lg"
                />
              )}
              {previewProfileImage && (
                <button
                  type="button"
                  className="absolute bottom-0 right-0 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                  onClick={handleDeleteImage}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            <div className={`${!previewProfileImage ? 'flex-grow' : 'ml-4'}`}>
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                className="w-full border text-sm border-gray-300 dark:border-gray-500 rounded-md p-2 dark:text-primary hover:bg-primaryAdmin transition-colors duration-300"
                onChange={handleImageChange}
              />
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">{errors.image}</p>
              )}
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="text-base font-bold text-primary block mb-2">
                {t('userProfileSettings.name')}
              </label>
              <input
                type="text"
                id="name"
                className="mt-2 p-2 text-sm w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 hover:bg-gray-100"
                value={name}
                onChange={handleNameChange}
                maxLength={50}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="firstNames" className="text-base font-bold text-primary block mb-2">
                {t('userProfileSettings.firstNames')}
              </label>
              <input
                type="text"
                id="firstNames"
                className="mt-2 p-2 text-sm w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 hover:bg-gray-100"
                value={firstNames}
                onChange={handleFirstNamesChange}
                maxLength={50}
              />
              {errors.firstNames && (
                <p className="text-red-500 text-sm mt-1">{errors.firstNames}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="lastNames" className="text-base font-bold text-primary block mb-2">
                {t('userProfileSettings.lastNames')}
              </label>
              <input
                type="text"
                id="lastNames"
                className="mt-2 p-2 text-sm w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 hover:bg-gray-100"
                value={lastNames}
                onChange={handleLastNamesChange}
                maxLength={50}
              />
              {errors.lastNames && (
                <p className="text-red-500 text-sm mt-1">{errors.lastNames}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="text-base font-bold text-primary block mb-2">
                {t('userProfileSettings.email')}
              </label>
              <input
                type="email"
                id="email"
                className="mt-2 p-2 w-full text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 hover:bg-gray-100"
                value={email}
                onChange={handleEmailChange}
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
                {t('userProfileSettings.save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;