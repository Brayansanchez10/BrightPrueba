import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Swal from 'sweetalert2';
import { Link, useParams, useNavigate } from "react-router-dom";
import LeftBar from "./../../Dashboard/LeftBar";
import Navbar from "./../../Dashboard/NavBar";
import { useUserContext } from "../../../context/user/user.context";
import { useAuth } from "../../../context/auth.context";
import { useTranslation } from "react-i18next";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

function Changepassword() {
  const { t } = useTranslation("global");
  const { token } = useParams();
  const [error, setError] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const { getUserById, changePassword } = useUserContext(); // Usa la función changePassword
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        if (user && user.data && user.data.id) {
          const userData = await getUserById(user.data.id);
          console.log("User data fetched:", userData);
          setEmail(userData.email);
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: t("newPasswordUser.fetch_email_error"),
          text: error.message,
          confirmButtonText: 'OK',
          timer: 3000,
        });
        console.error("Error fetching user email:", error);
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
        await changePassword(email, values.password); // Usa la función changePassword del contexto
        Swal.fire({
          icon: 'success',
          title: t("newPasswordUser.password_changed_success"),
          showConfirmButton: false,
          timer: 2000,
        });
        setTimeout(() => {
          navigate("/ProfileEditor");
        }, 2000);
        console.log(values);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: t("newPasswordUser.password_change_error"),
          text: error.message,
          confirmButtonText: 'OK',
          timer: 3000,
        });
        console.error(error);
      }
    },
  });

  useEffect(() => {
    setPasswordsMatch(formik.values.password === formik.values.confirmPassword);
  }, [formik.values.password, formik.values.confirmPassword]);

  const [isLeftBarVisible, setIsLeftBarVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleLeftBarVisibilityChange = (isVisible) => {
    setIsLeftBarVisible(isVisible);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-blue-200 via-blue-400 to-blue-600">
      <LeftBar onVisibilityChange={handleLeftBarVisibilityChange} />
      <div
        className={`w-full transition-all duration-300 ${
          isLeftBarVisible ? "ml-44" : ""
        }`}
      >
        <Navbar />
        <div className="flex justify-center items-center mx-2 mt-20 sm:mt-10 mb-5">
          <div className="bg-gradient-to-bl border from-purple-500 to-blue-500 p-4 rounded-3xl w-full sm:w-5/6 md:w-7/12 lg:w-5/12 shadow-orange shadow-white">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-center mb-2 text-white">
              {t("newPasswordUser.change_password")}
            </h2>
            <form
              onSubmit={formik.handleSubmit}
              className="py-4 sm:py-6 lg:py-10 flex flex-col space-y-4 sm:space-y-6 lg:space-y-8"
            >
              <div>
                <label className="text-lg font-bold text-white block mx-2 sm:mx-4">
                  {t("newPasswordUser.email")}
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  readOnly
                  disabled
                  className="w-full p-2 sm:p-3 border border-cyan-300 rounded-full bg-pink-100 placeholder-gray-450 focus:outline-none"
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-500">{formik.errors.email}</div>
                ) : null}
              </div>
              <div>
                <label className="text-lg font-bold text-white block  mx-2 sm:mx-4">
                  {t("newPasswordUser.new_password")}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full p-2 sm:p-3 border border-cyan-300 rounded-full bg-pink-100 placeholder-gray-450 focus:outline-sky-600 focus:border-sky-950 focus:bg-slate-200"
                    placeholder={t("newPasswordUser.new_password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2/4 transform -translate-y-2/4 text-gray-600"
                  >
                    {showPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password ? (
                  <div className="text-red-500">{formik.errors.password}</div>
                ) : null}
              </div>
              <div>
                <label className="text-lg font-bold text-white block mx-2 sm:mx-4">
                  {t("newPasswordUser.confirm_password")}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full p-2 sm:p-3 border border-cyan-300 rounded-full mb-2 bg-pink-100 placeholder-gray-450 focus:outline-sky-600 focus:border-sky-950 focus:bg-slate-200"
                    placeholder={t("newPasswordUser.confirm_password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2/4 transform -translate-y-2/4 text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeTwoTone />
                    ) : (
                      <EyeInvisibleOutlined />
                    )}
                  </button>
                </div>
                {formik.touched.confirmPassword &&
                formik.errors.confirmPassword ? (
                  <div className="text-red-500">
                    {formik.errors.confirmPassword}
                  </div>
                ) : null}
              </div>
              {error && <div className="text-red-500">{error}</div>}
              <div className="flex justify-center items-center space-x-4">
                <button
                  className={`w-48 font-bold py-2 text-lg text-white rounded-full ${
                    passwordsMatch
                      ? "bg-green-700 hover:bg-green-600 shadow-green-600 shadow-orange"
                      : "bg-red-500 hover:bg-red-600 shadow-orange shadow-red-400"
                  } disabled:opacity-80`}
                  type="submit"
                  disabled={!formik.isValid || !passwordsMatch}
                >
                  {t("newPasswordUser.change_password_button")}
                </button>
                <Link
                  to="/ProfileEditor"
                  className="text-white text-lg bg-slate-700 hover:bg-slate-600 shadow-orange shadow-neutral-600 rounded-full font-bold w-48 text-center py-2"
                >
                  {t("newPasswordUser.return_to_settings")}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Changepassword;
