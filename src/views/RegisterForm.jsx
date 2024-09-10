import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Swal from "sweetalert2";
import Carousel from "../components/Login_components/Carousel";
import { Link, useNavigate } from "react-router-dom";
import { registerRequest } from "../api/auth";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

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
            case "Email already exists":
              Swal.fire("Error", t("register.email_exists"), "error");
              break;
            case "Username already exists":
              Swal.fire("Error", t("register.username_exists"), "error");
              break;
            default:
              Swal.fire("Error", t("register.server_error"), "error");
          }
        } else {
          setSuccess(true);
          Swal.fire({
            title: t("register.user_created"),
            icon: "success",
            timer: 2500,
            showConfirmButton: false,
          }).then(() => navigate("/"));
        }
      } catch (error) {
        console.error("Caught error:", error);

        if (error.response) {
          const errorMsg = error.response.data.msg || "Unknown error occurred";

          switch (errorMsg) {
            case "Email already exists":
              Swal.fire("Error", t("register.email_exists"), "error");
              break;
            case "Username already exists":
              Swal.fire("Error", t("register.username_exists"), "error");
              break;
            default:
              Swal.fire("Error", t("register.server_error"), "error");
          }
        } else if (error.request) {
          Swal.fire("Error", t("register.server_error"), "error");
        } else {
          Swal.fire("Error", t("register.server_error"), "error");
        }
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400">
      <Carousel className="" />
      <div className="flex flex-col justify-center items-center w-full sm:w-1/2 md:w-5/12 mx-auto overflow-auto">
        <div className="bg-white rounded-3xl w-full px-20 py-10 shadow-orange shadow-pink-300">
          <div className="text-xl w-36 mx-auto text-center font-black bg-gradient-to-r from-purple-500 to-emerald-400 py-2 rounded-xl text-white">
            {t("register.register")}
          </div>
          <div className="mt-6 text-base text-center font-semibold">
            {t("register.already_registered")}
            <Link to="/">
              <button className="text-xl text-pink-500 hover:text-pink-600 font-semibold hover:bg-red-100">
                {t("register.login")}
              </button>
            </Link>
          </div>
          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col space-y-6 mt-4"
          >
            <div>
              <label className="text-base font-bold text-gray-600 block mb-2">
                {t("register.username")}
              </label>
              <input
                type="text"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full p-2 border rounded-full bg-purple-50 placeholder-purple-200 focus:outline-none ${
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
              <label className="text-base font-bold text-gray-600 block mb-2">
                {t("register.email")}
              </label>
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full p-2 border rounded-full bg-purple-50 placeholder-purple-200 focus:outline-none ${
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
              <label className="text-base font-bold text-gray-600 block mb-2">
                {t("register.password")}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full p-2 border rounded-full bg-purple-50 placeholder-purple-200 focus:outline-none ${
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
              <label className="text-base font-bold text-gray-600 block mb-2">
                {t("register.repeat_password")}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full p-2 border rounded-full bg-purple-50 placeholder-purple-200 focus:outline-none ${
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
                className="w-48 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-xl font-bold text-xl"
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
                {t("register.register")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
