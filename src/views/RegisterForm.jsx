import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Carousel from "../components/Login_components/Carousel";
import { Link, useNavigate } from "react-router-dom";
import { registerRequest } from "../api/auth";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import imagen from "../assets/img/book.png";

function RegisterForm() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation("global");

  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .min(4, t("register.username_min_length"))
      .required(t("register.username_required")),
    email: yup
      .string()
      .email(t("register.invalid_email"))
      .matches(/@/, t("register.email_requires_at"))
      .matches(/\.com$/, t("register.email_requires_com"))
      .required(t("register.email_required")),
    password: yup
      .string()
      .required(t("register.password_required"))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/,
        t("register.password_matches")
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], t("register.passwords_match"))
      .required(t("register.repeat_password")),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        const { confirmPassword, ...userData } = values;
    
        setIsSubmitting(true);
    
        const response = await registerRequest(userData);
    
        if (response.data.msg) {
          switch (response.data.msg) {
            case "Email already exists": //Correo Existente Mensaje error
              toast.error(t("register.email_exists"));
              break;
            case "Username already exists":
              toast.error(t("register.username_exists")); //Username Existente Mensaje error
              break;
            default:
              toast.error(t("register.server_error"));
          }
        } else {
          setSuccess(true);
          toast.success(t("register.user_created"), {
            autoClose: 2500,
            onClose: () => navigate("/"),
          });
        }
      } catch (error) {
        console.error("Caught error:", error);
    
        if (error.response) {
          // Error de respuesta del servidor
          console.error("Server response error:", error.response.data);
    
          const errorMsg = error.response.data.msg || "Unknown error occurred";
    
          switch (errorMsg) {
            case "Email already exists":
              toast.error(t("register.email_exists"));
              break;
            case "Username already exists":
              toast.error(t("register.username_exists"));
              break;
            default:
              toast.error(t("register.server_error"));
          }
        } else if (error.request) {
          // Error de solicitud 
          console.error("Network error:", error.request);
          toast.error(t("register.server_error"));
        } else {
          // Error al configurar la solicitud
          console.error("Error configuring request:", error.message);
          toast.error(t("register.server_error"));
        }
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-emerald-400">
      <div className="flex w-full max-w-7xl sm:rounded-none md:rounded-3xl shadow-xl shadow-slate-800">

        <div className="w-3/4 h-full justify-center items-center hidden md:block">
          <Carousel/>
        </div>
        
        
        <div className="flex flex-col justify-center items-center bg-white w-full md:w-2/2 sm:rounded-none md:rounded-tr-3xl md:rounded-br-3xl p-3">
          <ToastContainer />
          <div className="text-2xl w-full mx-auto text-center font-black bg-gradient-to-r from-emerald-400  to-purple-800 bg-clip-text text-transparent font-impact mb-2">
              <p>{t("register.register_now")}</p>
              <p>{t("register.future")}</p>
          </div>
          <div className="bg-white rounded-3xl w-10/12 px-10 py-3 shadow-lg shadow-slate-500">
            <div className="text-2xl w-full mx-auto text-center font-black bg-gradient-to-r from-emerald-400  to-purple-800 bg-clip-text text-transparent font-impact mb-2">
                <p>{t("register.register")}</p>
            </div>
            <img
              className="h-10 w-15 mx-auto"
              src={imagen}
              alt="book"
            />
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col space-y-1"
            >
              <div>
                <label className="text-base font-bold text-gray-600 block">
                  {t("register.username")}
                </label>
                <input
                  type="text"
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full p-2 border rounded-2xl bg-purple-50 placeholder-purple-200 focus:outline-none ${
                    formik.touched.username && formik.errors.username
                      ? "border-red-500"
                      : "border-purple-300"
                  }`}
                  placeholder={t("register.enter_username")}
                />
                {formik.touched.username && formik.errors.username ? (
                  <div className="text-red-500 mt-1">
                    {formik.errors.username}
                  </div>
                ) : null}
              </div>
              <div>
                <label className="text-base font-bold text-gray-600 block">
                  {t("register.email")}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full p-2 border rounded-2xl bg-purple-50 placeholder-purple-200 focus:outline-none ${
                    formik.touched.email && formik.errors.email
                      ? "border-red-500"
                      : "border-purple-300"
                  }`}
                  placeholder={t("register.enter_email")}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-500 mt-1">{formik.errors.email}</div>
                ) : null}
              </div>
              <div>
                <label className="text-base font-bold text-gray-600 block">
                  {t("register.password")}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full p-2 border rounded-2xl bg-purple-50 placeholder-purple-200 focus:outline-none ${
                      formik.touched.password && formik.errors.password
                        ? "border-red-500"
                        : "border-purple-300"
                    }`}
                    placeholder={t("register.enter_password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
                {formik.touched.password && formik.errors.password ? (
                  <div className="text-red-500 mt-1">
                    {formik.errors.password}
                  </div>
                ) : null}
              </div>
              <div>
                <label className="text-base font-bold text-gray-600 block">
                  {t("register.repeat_password")}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full p-2 border rounded-2xl bg-purple-50 placeholder-purple-200 focus:outline-none ${
                      formik.touched.confirmPassword &&
                      formik.errors.confirmPassword
                        ? "border-red-500"
                        : "border-purple-300"
                    }`}
                    placeholder={t("register.repeat_password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    <FontAwesomeIcon
                      icon={showConfirmPassword ? faEyeSlash : faEye}
                    />
                  </button>
                </div>
                {formik.touched.confirmPassword &&
                formik.errors.confirmPassword ? (
                  <div className="text-red-500 mt-1">
                    {formik.errors.confirmPassword}
                  </div>
                ) : null}
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-48 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-xl font-bold text-xl mt-2"
                  disabled={
                    !formik.isValid ||
                    formik.values.password !== formik.values.confirmPassword ||
                    isSubmitting
                  }
                  onClick={() => {
                    if (!formik.isValid) {
                      toast.error(t("register.complete_all_fields"));
                    }
                  }}
                >
                  {t("register.ready")}
                </button>
              </div>
            </form>
            <div className="mt-3 text-base text-center font-semibold">
              {t("register.already_registered")}
              <Link to="/">
                <button className="text-xl text-pink-500 hover:text-purple-600 font-semibold">
                  {t("register.login")}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
