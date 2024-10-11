import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../../../src/context/user/user.context";
import { useAuth } from "../../../src/context/auth.context";
import Swal from 'sweetalert2';
import logo from "../../../src/assets/img/hola.png";
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';

const DeleteAccountConfirmation = () => {
  const navigate = useNavigate();
  const { deleteUserConfirmation } = useUserContext();
  const { user } = useAuth();
  const { t } = useTranslation("global");

  const [confirmationCode, setConfirmationCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const handleConfirmationCodeChange = (index, value) => {
    const newConfirmationCode = [...confirmationCode];
    newConfirmationCode[index] = value;
    setConfirmationCode(newConfirmationCode);

    // Move to next input if current one is filled
    if (value !== "" && index < confirmationCode.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    // Move to previous input if backspace is pressed and current input is empty
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

        // Verifica si la respuesta está definida y contiene el mensaje esperado
        if (response && response.msg === "User deleted successfully") {
          Swal.fire({
            icon: 'success',
            title: t("deleteAccountConfirmation.successMessage"),
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            setTimeout(() => {
              window.location.reload(); 
              navigate("/register"); // Redirige a la página de login
            }, 1500);
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
        });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 via-blue-400 to-blue-600">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-gradient-to-br from-violet-600 to-rose-500 py-6 px-6 rounded-xl shadow-xl shadow-pink-400"
      >
        <h1 className="text-center font-black text-5xl text-slate-100">
          {t("deleteAccountConfirmation.title")}
        </h1>
        <p className="italic font-semibold text-center text-2xl text-slate-300 my-10">
          {t("deleteAccountConfirmation.description")}
        </p>
        <div className="py-4 my-10 w-full flex justify-center">
          <img src={logo} alt="Logo" className="h-40" />
        </div>
        <div className="flex flex-col">
          <div className="flex justify-center items-center space-x-2">
            {confirmationCode.map((code, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                className="block w-10 h-10 bg-white text-center text-3xl rounded-lg border border-black focus:outline-red-500 focus:bg-zinc-200"
                maxLength="1"
                value={code}
                onChange={(e) => handleConfirmationCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                autoFocus={index === 0} // Automatically focus the first input
                required
              />
            ))}
          </div>
        </div>
        <div className="flex justify-center space-x-8 items-center mt-5">
          <button
            type="submit"
            className="w-32 py-3 font-medium text-white bg-red-950 shadow shadow-white hover:bg-red-800 rounded-lg"
          >
            <span>{t("deleteAccountConfirmation.deleteButton")}</span>
          </button>
          <Link to={"/Account"}>
            <button className="w-32 py-3 font-medium text-white bg-slate-950 shadow-white shadow hover:bg-gray-800 rounded-lg">
              <span>{t("deleteAccountConfirmation.cancelButton")}</span>
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default DeleteAccountConfirmation;
