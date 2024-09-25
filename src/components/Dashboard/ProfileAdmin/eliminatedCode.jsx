import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../../../context/user/user.context";
import { useAuth } from "../../../context/auth.context";
import Swal from "sweetalert2";
import logo from "../../../assets/img/hola.png";
import { useTranslation } from 'react-i18next';
import { Trash2, X } from 'lucide-react';

const DeleteAccountConfirmation = () => {
  const navigate = useNavigate();
  const { deleteUserConfirmation } = useUserContext();
  const { user } = useAuth();
  const { t } = useTranslation("global");

  const [confirmationCode, setConfirmationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const inputRefs = useRef([]);

  const handleConfirmationCodeChange = (index, value) => {
    const newConfirmationCode = [...confirmationCode];
    newConfirmationCode[index] = value;
    setConfirmationCode(newConfirmationCode);

    if (value !== "" && index < confirmationCode.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (value === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (index < confirmationCode.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = confirmationCode.join("");
    try {
      console.log("Confirmation code to send:", code);
      
      const response = await deleteUserConfirmation(user.data.id, code);
      if (response && response.msg === "User deleted successfully") {
        Swal.fire({
          icon: 'success',
          title: t("deleteAccountConfirmation.successMessage"),
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          window.location.reload(); 
          navigate("/");
        });
      } else {
         throw new Error(response?.msg || "Failed to delete user");
      }   
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: t("deleteAccountConfirmation.errorMessage"),
        text: error.message,
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 via-blue-400 to-blue-600 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-[#783CDA] to-[#200E3E] py-6 px-6">
          <h1 className="text-center font-black text-3xl md:text-4xl text-white">
            {t("deleteAccountConfirmation.title")}
          </h1>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-center text-lg text-gray-700">
            {t("deleteAccountConfirmation.description")}
          </p>
          <div className="flex justify-center">
            <img src={logo} alt="Logo" className="h-32 w-auto" />
          </div>
          <div className="flex justify-center items-center space-x-2">
            {confirmationCode.map((code, index) => (
              <input
                key={index}
                ref={(el) => inputRefs.current[index] = el}
                type="text"
                className="w-12 h-12 text-center text-2xl font-bold rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                maxLength="1"
                value={code}
                onChange={(e) =>
                  handleConfirmationCodeChange(index, e.target.value)
                }
                onKeyDown={(e) => handleKeyDown(e, index)}
                autoFocus={index === 0}
                required
              />
            ))}
          </div>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
            <button
              type="submit"
              className="flex items-center justify-center w-full sm:w-auto px-6 py-3 font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              <Trash2 className="mr-2" size={18} />
              <span>{t("deleteAccountConfirmation.deleteButton")}</span>
            </button>
            <Link to="/ProfileEditor" className="w-full sm:w-auto">
              <button className="flex items-center justify-center w-full px-6 py-3 font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg">
                <X className="mr-2" size={18} />
                <span>{t("deleteAccountConfirmation.cancelButton")}</span>
              </button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DeleteAccountConfirmation;