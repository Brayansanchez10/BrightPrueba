import React, { useState, useEffect } from "react";
import NavigationBar from "../Home/NavigationBar";
import SettingsBar from "../Home/SettingsUser";
import { useUserContext } from "../../context/user/user.context";
import { useAuth } from "../../context/auth.context";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { Trash2 } from "lucide-react";

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

  // Estado para almacenar errores
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserId = async () => {
      if (user && user.data && user.data.id) {
        try {
          const userData = await getUserById(user.data.id);
          setUserId(userData.id);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewProfileImage(URL.createObjectURL(file));
      setDeleteProfileImage(false); // Reset flag if new image is selected
    }
  };

  // Validación centralizada para los campos del formulario
  const validate = () => {
    const newErrors = {
      name: name.length < 4 ? t("userProfileSettings.name_invalid") : "",
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? t("userProfileSettings.invalid_email")
        : "",
    };
    setErrors(newErrors);
    return !newErrors.name && !newErrors.email;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate() && userId) {
      try {
        const userData = {
          username: name,
          email,
          userImage: deleteProfileImage
            ? null
            : profileImage || previewProfileImage,
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
    <div className="bg-gray-300 min-h-screen">
      <NavigationBar />
      <div className="flex justify-center pt-16">
        <div className="md:mt-3 mt-5 mx-4 mb-2 rounded-lg">
          <div className="max-w-lg w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#783CDA] to-[#200E3E] py-4 px-6 md:px-10">
              <h1 className="text-center font-black text-white md:text-xl lg:text-2xl">
                {t("userProfileSettings.edit_profile")}
              </h1>
            </div>
            <div className="p-6 md:p-10">
              <div className="flex items-center mb-6">
                <div className="relative flex-shrink-0">
                  {previewProfileImage && (
                    <img
                      src={previewProfileImage}
                      alt="Preview"
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-lg"
                    />
                  )}
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                    onClick={handleDeleteImage}
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
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
                  <label
                    htmlFor="name"
                    className="text-base font-bold text-black block mb-2"
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
                    htmlFor="email"
                    className="text-base font-bold text-black block mb-2"
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
