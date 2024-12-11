import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Swal from "sweetalert2";
import Carousel from "../components/Login_components/Carousel";
import { Link, useNavigate } from "react-router-dom";
import { registerRequest } from "../api/auth";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import imagen from "../assets/img/book.png";
import LoginFond from "../assets/img/Login.png"
import "../css/animations.css";
import { getEntity } from "../api/user/entities.request.js";

function RegisterForm() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entities, setEntities] = useState([]);

  useEffect(() => {
    async function loadEntities() {
      try {
        const response = await getEntity();
        setEntities(response.data);
        console.log("Entidades obtenidas; ", response);
      } catch (error) {
        console.error("Error loading entities:", error);
        setError("Failed to load entities");
      }
    }
    loadEntities();
  }, []);

  const navigate = useNavigate();
  const { t } = useTranslation("global");

  const validationSchema = yup.object().shape({
    firstNames: yup
      .string()
      .required(t("register.firstNames_required")),
    lastNames: yup
      .string()
      .required(t("register.lastName_required")),
    username: yup
      .string()
      .min(4, t("register.username_min_length"))
      .required(t("register.username_required")),
    documentNumber: yup
      .string()
      .min(6, t("register.document_min_length"))
      .required(t("register.document_required")),
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
      .required(t("register.repeat_password")
    ),
    entityId: yup
    .string()
    .required(t("register.entityId_required")),
  });

  const formik = useFormik({
    initialValues: {
      firstNames: "",
      lastNames: "",
      username: "",
      documentNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      entityId: "",
    },
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        const { confirmPassword, entityId, ...userData } = values;
        userData.entityId = Number(entityId);
        console.log(userData);

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
            case "Document number already exists":
              Swal.fire("Error", t("register.document_exists"), "error");
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
            case "Document number already exists":
              Swal.fire("Error", t("register.document_exists"), "error");
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

  const personaNatural = entities?.find((entity) => entity.name === "Persona Natural");

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${LoginFond})` }}
    >
      <div className="flex w-full max-w-7xl sm:rounded-none md:rounded-3xl shadow-xl shadow-slate-800">

        <div className="w-3/4 h-full justify-center items-center hidden lg:block">
          <Carousel/>
        </div>
        
        
        <div className="flex flex-col justify-center items-center bg-white w-full rounded-3xl lg:rounded-tr-3xl lg:rounded-br-3xl lg:rounded-tl-none lg:rounded-bl-none p-3">

          <div className="text-2xl w-full mx-auto text-center font-black bg-gradient-to-r from-emerald-400  to-purple-800 bg-clip-text text-transparent font-impact mb-2">
              <p>{t("register.register_now")}</p>
              <p>{t("register.future")}</p>
          </div>
          <div className="bg-white rounded-3xl w-[85%] px-10 py-4 shadow-lg shadow-slate-500 border">
            <div className="text-2xl w-full mx-auto text-center font-black bg-gradient-to-r from-emerald-400  to-purple-800 bg-clip-text text-transparent font-impact mb-2 -mt-1.5">
                <p>{t("register.register")}</p>
            </div>
            <img
              className="h-8 w-15 mx-auto"
              src={imagen}
              alt="book"
            />
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col mt-3 space-y-3"
            >
              <div className="flex flex-col space-y-3 md:flex-row md:space-x-3 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <div className="flex items-center gap-2">
                    <label className="text-lg font-bold text-gray-600">
                      {t("register.firstNames")}
                    </label>
                    {formik.touched.firstNames && formik.errors.firstNames && (
                      <div className="relative group">
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="text-red-500 cursor-help"
                        />
                        <div className="absolute hidden group-hover:block bg-red-100 text-red-500 p-2 rounded-lg text-sm w-48 top-0 left-6">
                          {formik.errors.firstNames}
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    name="firstNames"
                    value={formik.values.firstNames}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full p-3 border rounded-2xl bg-purple-50 placeholder-purple-200 focus:outline-none ${
                      formik.touched.firstNames && formik.errors.firstNames
                        ? "border-red-500"
                        : "border-purple-300"
                    }`}
                    placeholder={t("register.enter_firstNames")}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <div className="flex items-center gap-2">
                    <label className="text-lg font-bold text-gray-600">
                      {t("register.lastNames")}
                    </label>
                    {formik.touched.lastNames && formik.errors.lastNames && (
                      <div className="relative group">
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="text-red-500 cursor-help"
                        />
                        <div className="absolute hidden group-hover:block bg-red-100 text-red-500 p-2 rounded-lg text-sm w-48 top-0 left-6">
                          {formik.errors.lastNames}
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    name="lastNames"
                    value={formik.values.lastNames}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full p-3 border rounded-2xl bg-purple-50 placeholder-purple-200 focus:outline-none ${
                      formik.touched.lastNames && formik.errors.lastNames
                        ? "border-red-500"
                        : "border-purple-300"
                    }`}
                    placeholder={t("register.enter_lastNames")}
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-3 md:flex-row md:space-x-3 md:space-y-0">   
                  <div className="w-full md:w-1/2">
                    <div className="flex items-center gap-2">
                      <label className="text-lg font-bold text-gray-600">
                        {t("register.username")}
                      </label>
                      {formik.touched.username && formik.errors.username && (
                        <div className="relative group">
                          <FontAwesomeIcon
                            icon={faInfoCircle}
                            className="text-red-500 cursor-help"
                          />
                          <div className="absolute hidden group-hover:block bg-red-100 text-red-500 p-2 rounded-lg text-sm w-48 top-0 left-6">
                            {formik.errors.username}
                          </div>
                        </div>
                      )}
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={formik.values.username}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full p-3 border rounded-2xl bg-purple-50 placeholder-purple-200 focus:outline-none ${
                        formik.touched.username && formik.errors.username
                          ? "border-red-500"
                          : "border-purple-300"
                      }`}
                      placeholder={t("register.enter_username")}
                    />
                </div>

                  <div className="w-full md:w-1/2">
                    <div className="flex items-center gap-2">
                      <label className="text-lg font-bold text-gray-600">
                        {t("register.documentNumber")}
                      </label>
                      {formik.touched.documentNumber && formik.errors.documentNumber && (
                        <div className="relative group">
                          <FontAwesomeIcon
                            icon={faInfoCircle}
                            className="text-red-500 cursor-help"
                          />
                          <div className="absolute hidden group-hover:block bg-red-100 text-red-500 p-2 rounded-lg text-sm w-48 top-0 left-6">
                            {formik.errors.documentNumber}
                          </div>
                        </div>
                      )}
                    </div>
                    <input
                      type="number"
                      inputMode="numeric" // Asegura el teclado numérico en móviles
                      name="documentNumber"
                      value={formik.values.documentNumber}
                      onChange={(e) => {
                        // Permitir solo números (removiendo caracteres no numéricos)
                        const value = e.target.value.replace(/[^\d]/g, ""); 
                        formik.setFieldValue("documentNumber", value);
                      }}
                      onKeyDown={(e) => {
                        // Prevenir símbolos '+' y '-' y otras teclas no deseadas
                        if (["-", "+", "e", "E"].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onBlur={formik.handleBlur}
                      className={`w-full p-3 border rounded-2xl bg-purple-50 placeholder-purple-200 focus:outline-none ${
                        formik.touched.documentNumber && formik.errors.documentNumber
                          ? "border-red-500"
                          : "border-purple-300"
                      }`}
                      placeholder={t("register.enter_documentNumber")}
                    />
                  </div>
              </div>   
              
              <div>
                <div className="flex items-center gap-2">
                  <label className="text-lg font-bold text-gray-600">
                    {t("register.email")}
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
                  className={`w-full p-3 border rounded-2xl bg-purple-50 placeholder-purple-200 focus:outline-none ${
                    formik.touched.email && formik.errors.email
                      ? "border-red-500"
                      : "border-purple-300"
                  }`}
                  placeholder={t("register.enter_email")}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <label className="text-lg font-bold text-gray-600">
                    {t("register.password")}
                  </label>
                  {formik.touched.password && formik.errors.password && (
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
                    className={`w-full p-3 border rounded-2xl bg-purple-50 placeholder-purple-200 focus:outline-none ${
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
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <label className="text-lg font-bold text-gray-600">
                    {t("register.repeat_password")}
                  </label>
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <div className="relative group">
                      <FontAwesomeIcon
                        icon={faInfoCircle}
                        className="text-red-500 cursor-help"
                      />
                      <div className="absolute z-10 hidden group-hover:block bg-red-100 text-red-500 p-2 rounded-lg text-sm w-48 top-0 left-6">
                        {formik.errors.confirmPassword}
                      </div>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full p-3 border rounded-2xl bg-purple-50 placeholder-purple-200 focus:outline-none ${
                      formik.touched.confirmPassword && formik.errors.confirmPassword
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
                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <label className="text-lg font-bold text-gray-600">
                    {t("register.select_entity")}
                  </label>
                  {formik.touched.entityId && formik.errors.entityId && (
                    <div className="relative group">
                      <FontAwesomeIcon
                        icon={faInfoCircle}
                        className="text-red-500 cursor-help"
                      />
                      <div className="absolute hidden group-hover:block bg-red-100 text-red-500 p-2 rounded-lg text-sm w-48 top-0 left-6">
                        {formik.errors.entityId}
                      </div>
                    </div>
                  )}
                </div>
                <select
                  name="entityId"
                  value={formik.values.entityId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full p-3 border rounded-2xl bg-purple-50 placeholder-purple-200 focus:outline-none ${
                    formik.touched.entityId && formik.errors.entityId
                      ? "border-red-500"
                      : "border-purple-300"
                  }`}
                >
                  <option value="" label={t("register.choose_entity")} />
                  {entities &&
                    entities.length > 0 &&
                    entities
                      .filter((entity) => entity.id !== 1)
                      .map((entity) => (
                        <option key={entity.id} value={entity.id}>
                          {entity.name}
                        </option>
                      ))}
                </select>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-48 py-2 text-white rounded-xl font-bold text-xl mt-3 bt1"
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
            <div className="mt-3 mb-2 text-lg text-center font-semibold">
              {t("register.already_registered")}
              <Link to="/">
                <button className="text-xl text-pink-500 hover:text-purple-600 font-semibold transition-all duration-700">
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
