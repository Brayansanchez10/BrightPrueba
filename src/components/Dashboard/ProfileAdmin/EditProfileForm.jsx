import React, { useState, useEffect } from "react";
import { useUserContext } from "../../../context/user/user.context";
import { useAuth } from "../../../context/auth.context";
import { useTranslation } from "react-i18next";
import Swal from 'sweetalert2';
import { Trash2 } from 'lucide-react';

const ProfileForm = ({ name: initialName, email: initialEmail }) => {
  const { updateUserPartial, getUserById } = useUserContext();
  const { user } = useAuth();
  const { t } = useTranslation("global");

  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [userId, setUserId] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [previewProfileImage, setPreviewProfileImage] = useState(null);
  const [deleteProfileImage, setDeleteProfileImage] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserId = async () => {
      if (user && user.data && user.data.id) {
        try {
          const userData = await getUserById(user.data.id);
          setUserId(userData._id);
          setName(userData.username);
          setEmail(userData.email);

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

  const validateName = (name) => {
    if (name.length < 4) {
      return t('userProfileSettings.name_invalid');
    }
    return "";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return t('userProfileSettings.invalid_email');
    }
    return "";
  };

  const validate = () => {
    const newErrors = {
      name: validateName(name),
      email: validateEmail(email),
    };
    setErrors(newErrors);
    return !newErrors.name && !newErrors.email;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      if (userId) {
        try {
          const userData = {
            username: name,
            email,
            userImage: deleteProfileImage ? null : profileImage,
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

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    if (imageFile) {
      setProfileImage(imageFile);
      setPreviewProfileImage(URL.createObjectURL(imageFile));
      setDeleteProfileImage(false);
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
          await updateUserPartial(userId, { username: name, email, userImage: null });

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
      <div className="max-w-lg w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-[#783CDA] to-[#200E3E] py-4 px-6 md:px-10">
          <h1 className="text-center font-black text-white md:text-xl lg:text-2xl">
            {t('userProfileSettings.edit_profile')}
          </h1>
        </div>
        <div className="p-6 md:p-10">
          <div className="flex items-center mb-6">
            <div className="relative">
              {previewProfileImage && (
                <img
                  src={previewProfileImage}
                  alt="Preview"
                  className="w-20 h-20 rounded-full shadow-lg"
                />
              )}
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                onClick={handleDeleteImage}
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="ml-4 flex-grow">
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                className="w-full border text-sm border-gray-300 rounded-md p-2 hover:bg-gray-100"
                onChange={handleImageChange}
              />
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="text-base font-bold text-black block mb-2">
                {t('userProfileSettings.name')}
              </label>
              <input
                type="text"
                id="name"
                className="mt-2 p-2 text-sm w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 hover:bg-gray-100"
                value={name}
                onChange={handleNameChange}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="text-base font-bold text-black block mb-2">
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