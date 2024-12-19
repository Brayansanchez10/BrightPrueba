import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import Carousel from "./../components/Login_components/Carousel";
import { useAuth } from "../context/auth.context";
import VideoPage from "./VideoPage";
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import imagen from "../assets/img/torch.png";
import LoginFond from "../assets/img/Login.png"
import "../css/animations.css";

import { GoogleLogin } from '@react-oauth/google';

const LoginForm = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const { t } = useTranslation("global");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSuccess = async (credentialResponse) => {
    try {
      const loginResponse = await loginWithGoogle(credentialResponse);
      if (loginResponse.success) {
        // Manejar login exitoso
      } else {
        Swal.fire({
          icon: 'error',
          title: t("login.titleE"),
          text: t("login.messageE")
        });
      }
    } catch (error) {
      console.error("Error en proceso de login con Google:", error);
      Swal.fire({
        icon: 'error',
        title: t("login.titleE"),
        text: t("login.messageE")
      });
    }
  };

  const onFailure = () => {
    Swal.fire({
      icon: 'error',
      title: t("login.titleE"),
      text: 'Error al iniciar sesión con Google'
    });
  };

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email(t("login.invalid_email"))
      .matches(/@/, t("login.email_requires_at"))
      .matches(/\.com$/, t("login.email_requires_com"))
      .required(t("login.email_required")),
    password: yup
      .string()
      .required(t("login.password_required")),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("Valores enviados al hacer inicio de sesión:", values);
      try {
        setLoading(true);
        setIsSubmitting(true); // Desactiva el botón
  
        const response = await login(values);
        const success = response?.success;
        const user = response?.user;
        const message = response?.message;
  
        console.log("Inicio de sesión exitoso:", success);
  
        if (success) {
          const userRole = user?.data?.role || null;
          const userToken = user?.data?.token || null;
          console.log(userRole);
  
          document.cookie = `token=${userToken}; path=/`;
          setUserRole(userRole);
          setIsAuthenticated(true);
        } else {
          setError(message);
          Swal.fire({
            icon: 'error',
            title: t("login.titleE"),
            text: message,
          });
        }
      } catch (error) {
        console.log("Error capturado en el catch:", error);
        const errorMessage =
          error?.response?.data?.message || t("login.messageE");
        setError(errorMessage);
        Swal.fire({
          icon: 'error',
          title: t("login.titleE"),
          text: t("login.messageE"),
        });
      } finally {
        setLoading(false);
        setTimeout(() => {
          setIsSubmitting(false); // Activa el botón después de 3 segundos
        }, 3000);
      }
    },
  });

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (isAuthenticated) {
    return <VideoPage userRole={userRole} />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${LoginFond})` }}
    >
      <div className="flex w-full max-w-7xl sm:rounded-none sm:m-0 md:rounded-3xl shadow-xl shadow-slate-800 md:m-4">
        
        <div className="w-3/4 h-full justify-center items-center hidden lg:block">
          <Carousel />
        </div>

        <div className="flex flex-col justify-center items-center bg-white w-full rounded-3xl lg:rounded-tr-3xl lg:rounded-br-3xl lg:rounded-tl-none lg:rounded-bl-none p-3">
          
          <div className="text-2xl w-full mx-auto text-center font-black bg-gradient-to-r from-emerald-400  to-purple-800 bg-clip-text text-transparent font-impact mb-3">
              <p>{t("login.hello")}</p>
              <p>{t("login.welcome_message")}</p>
          </div>
          <form
            onSubmit={formik.handleSubmit}
            className="p-6 max-w-lg w-full border  rounded-3xl shadow-lg shadow-slate-500 mb-3"
          >
            <div className="text-2xl w-full mx-auto text-center font-black font-impact mb-3">
              <p><span className="text-purple-800">{t("login.login_se")}</span> {t("login.your_account")}</p>
            </div>
            <img
              className="h-20 w-20 mx-auto"
              src={imagen}
              alt="torch"
            />
            <div className="flex flex-col space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <label className="text-lg font-bold text-gray-600 block">
                    {t("login.email")}
                  </label>
                  {formik.touched.email && formik.errors.email && (
                    <div className="relative group">
                      <FontAwesomeIcon
                        icon={faInfoCircle}
                        className="text-red-500 cursor-help"
                      />
                      <div className="absolute hidden group-hover:block bg-red-100 text-red-500 p-2 rounded-lg text-sm w-48 top-0 left-6">
                        {formik.errors.email}
                      </div>
                    </div>
                  )}
                </div>
                <input
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full p-4 border rounded-2xl bg-purple-50 placeholder-purple-200 focus:outline-none ${
                    formik.touched.email && formik.errors.email
                      ? "border-red-500"
                      : "border-purple-300"
                  }`}
                  placeholder={t("login.enter_email")}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <label className="text-lg font-bold text-gray-600 block">
                    {t("login.password")}
                  </label>
                  {formik.touched.password && formik.errors.password && !formik.values.password && (
                    <div className="relative group">
                      <FontAwesomeIcon
                        icon={faInfoCircle}
                        className="text-red-500 cursor-help"
                      />
                      <div className="absolute z-10 hidden group-hover:block bg-red-100 text-red-500 p-2 rounded-lg text-sm w-48 top-0 left-6">
                        {formik.errors.password}
                      </div>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full p-4 border rounded-2xl bg-purple-50 placeholder-purple-200 focus:outline-none ${
                      formik.touched.password && formik.errors.password && !formik.values.password
                        ? "border-red-500"
                        : "border-purple-300"
                    }`}
                    placeholder={t("login.enter_password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>
              <div className="text-end mt-2 mb-2">
                <Link
                  to="/reset"
                  className="text-gray-600 hover:text-blue-400 font-bold text-lg transition-all duration-700"
                  style={{ textDecoration: "none" }}
                >
                  {t("login.forgot_password")}
                </Link>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-56 py-2 cursor-pointer text-white rounded-xl font-bold text-xl bt1"
                  disabled={!formik.isValid || loading || isSubmitting}
                >
                  {loading ? t("login.loading") : t("login.login")}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center my-4">
              <div className="border-t border-gray-300 flex-grow"></div>
              <span className="px-4 text-gray-500">{t("login.or")}</span>
              <div className="border-t border-gray-300 flex-grow"></div>
            </div>
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  onSuccess(credentialResponse);
                }}
                onError={() => {
                  onFailure();
                }}
                useOneTap
              />
            </div>
            <div className="mb-5 mt-5 text-lg text-center font-semibold">
              <Link
                to="/register"
                className="text-xl text-black hover:text-purple-600 font-semibold transition-all duration-700"
              >
                {t("login.register")}
              </Link>
            </div>
            <div className="flex items-center justify-center lg:hidden">
              <p className="text-xs text-gray-300 font-bold text-center">
                {t('footer.description')}
                <p className="text-xs text-center">{t('footer.copy_right')}</p>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;