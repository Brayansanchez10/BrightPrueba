import React from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/user/user.context";
import { useAuth } from "../../context/auth.context";
import { useTranslation } from "react-i18next";
import { Lock, UserX } from "lucide-react";

const MySwal = withReactContent(Swal);

const SettingsBar = () => {
  const { t } = useTranslation("global");
  const navigate = useNavigate();
  const { deleteUser } = useUserContext();
  const { user } = useAuth();

  const handleDeleteAccount = async () => {
    MySwal.fire({
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
    <div className="mt-8 md:mt-6 bg-white rounded-xl shadow-lg max-w-lg mx-auto overflow-hidden">
      <div className="bg-gradient-to-r from-[#783CDA] to-[#200E3E] py-4 px-6">
        <h2 className="text-center font-black text-white text-xl md:text-2xl">
          {t("settingsBar.account_settings")}
        </h2>
      </div>
      <div className="p-6 space-y-4">
        <Link
          to="/ChangePasswordUser"
          className="flex items-center justify-center w-full py-3 px-4 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 rounded-lg shadow-md hover:shadow-lg"
        >
          <Lock className="mr-2" size={20} />
          {t("settingsBar.change_password")}
        </Link>
        <button
          onClick={handleDeleteAccount}
          className="flex items-center justify-center w-full py-3 px-4 text-base font-semibold text-white bg-red-500 hover:bg-red-600 transition-all duration-300 rounded-lg shadow-md hover:shadow-lg"
        >
          <UserX className="mr-2" size={20} />
          {t("settingsBar.delete_account")}
        </button>
      </div>
    </div>
  );
};

export default SettingsBar;
