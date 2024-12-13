import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Swal from "sweetalert2";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/user/user.context";
import { useAuth } from "../../context/auth.context";
import { useTranslation } from "react-i18next";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Save, ArrowLeft } from 'lucide-react';
import NavigationBar from "./NavigationBar";
import profile_fondo from "../../assets/img/profile_fondo.png";

function NewPassword() {
  const { t } = useTranslation("global");
  const { token } = useParams();
  const [error, setError] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const { getUserById, changePassword } = useUserContext();
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        if (user && user.data && user.data.id) {
          const userData = await getUserById(user.data.id);
          console.log("User data fetched:", userData);
          setEmail(userData.email);
        }
      } catch (error) {
        console.error(t("newPasswordUser.fetch_email_error"), error);
      }
    };

    fetchUserEmail();
  }, [getUserById, user, t]);

  const validationSchema = yup.object().shape({
    password: yup
      .string()
      .required(t("newPasswordUser.password_required"))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/,
        t("newPasswordUser.password_invalid")
      ),
    confirmPassword: yup
      .string()
      .oneOf(
        [yup.ref("password"), null],
        t("newPasswordUser.passwords_must_match")
      ),
  });

  const formik = useFormik({
    initialValues: {
      email: email,
      password: "",
      confirmPassword: "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        console.log("Submitting with:", {
          email,
          newPassword: values.password,
          confirmPassword: values.confirmPassword,
        });

        await changePassword(email, values.password);

        // Mostrar mensaje de éxito con SweetAlert2
        Swal.fire({
          icon: "success",
          title: t("newPasswordUser.password_changed_success"),
          showConfirmButton: false,
          timer: 1500, // Duración del mensaje
        });

        // Configurar redirección después del tiempo de la alerta
        setTimeout(() => {
          navigate("/");
        }, 1500); // La duración debe coincidir con timer
      } catch (error) {
        // Mostrar mensaje de error con SweetAlert2
        Swal.fire({
          icon: "error",
          title: t("newPasswordUser.password_change_error"),
          text: error.message,
          showConfirmButton: true,
        });
        console.error("Error changing password:", error);
      }
    },
  });

  useEffect(() => {
    setPasswordsMatch(formik.values.password === formik.values.confirmPassword);
  }, [formik.values.password, formik.values.confirmPassword]);
  
  return (
    <div className="flex min-h-screen bg-primary">
      <div className="flex justify-center h-full w-full mx-4 mt-8 mb-8">
        <NavigationBar />
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-lg overflow-hidden mt-16">
          <div className="flex flex-col justify-center items-center bg-[#783CDA] py-10 px-6 sm:px-10 mt-0"
          style={{ backgroundImage: `url(${profile_fondo})` }}>
            <h2 className="text-center font-bungee text-white text-2xl md:text-3xl">
              {t("newPasswordUser.change_password")}
            </h2>
          </div>
          <form onSubmit={formik.handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="text-base font-bold text-black block mb-2">
                {t("newPasswordUser.email")}
              </label>
              <input
                type="email"
                name="email"
                value={email}
                readOnly
                disabled
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>
            <div>
              <label className="text-base font-bold text-black block mb-2">
                {t("newPasswordUser.new_password")}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
                  placeholder={t("newPasswordUser.new_password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                >
                  {showPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </div>
              )}
            </div>
            <div>
              <label className="text-base font-bold text-black block mb-2">
                {t("newPasswordUser.confirm_password")}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
                  placeholder={t("newPasswordUser.confirm_password")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                >
                  {showConfirmPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                </button>
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.confirmPassword}
                </div>
              )}
            </div>
            {error && <div className="text-red-500">{error}</div>}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                type="submit"
                className={`inline-flex items-center text-left w-full sm:w-48 py-3 px-4 text-base font-semibold text-white rounded-lg transition-all duration-300 ${
                  passwordsMatch && formik.isValid
                    ? "bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!formik.isValid || !passwordsMatch}
              >
                <Save className="mr-2" size={18} />
                {t("newPasswordUser.change_password_button")}
              </button>
              <Link
                to="/Account"
                className="inline-flex items-center w-full sm:w-48 py-3 px-4 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <ArrowLeft className="mr-2" size={18} />
                {t("newPasswordUser.return_to_settings")}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );  
}

export default NewPassword;
