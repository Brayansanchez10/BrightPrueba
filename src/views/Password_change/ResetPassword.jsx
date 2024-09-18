import logo from "../../assets/img/hola.png";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as yup from "yup";
import { resetPasswordRequest } from "../../api/auth";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("global");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email(t("reset_password.invalid_email"))
      .required(t("reset_password.email_required")),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        await resetPasswordRequest(values);
        Swal.fire({
          icon: "success",
          title: t("reset_password.email_sent_success"),
          showConfirmButton: false,
          timer: 3000,
        });
        setTimeout(() => {
          navigate("/code");
        }, 3000);
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: t("reset_password.email_not_registered"),
          text: t("reset_password.try_again"),
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="bg-gradient-to-r from-purple-500 to-emerald-400 min-h-screen flex justify-center">
      <div className="flex justify-center items-center">
        <div className="bg-white rounded-xl shadow-xl shadow-zinc-950 px-10 py-6 mx-4 max-w-lg">
          <h1 className="text-2xl mx-auto text-center font-black bg-gradient-to-r from-emerald-400 to-purple-800 bg-clip-text text-transparent mb-3 pt-4">
            {t("reset_password.forgot_password")}
          </h1>
          <p className="italic mt-6 font-semibold text-center text-lg text-purple-800">
            {t("reset_password.enter_email")}
          </p>
          <div className="w-full flex flex-col items-center">
            <img src={logo} alt="Logo" className="h-48" />
          </div>

          <form onSubmit={formik.handleSubmit} className="my-2">
            <div className="flex flex-col space-y-4">
              <label htmlFor="email">
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="w-full mt-2 py-2 rounded-lg px-3 focus:outline-none border border-black hover:shadow"
                  placeholder={t("reset_password.enter_registered_email")}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </label>
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-600">{formik.errors.email}</div>
              ) : null}

              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className={`py-3 font-medium text-white rounded-lg w-3/4 bg-purple-800 inline-flex space-x-4 items-center justify-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isSubmitting}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                    />
                  </svg>
                  <span>{t("reset_password.send_recovery_code")}</span>
                </button>
              </div>

              <p className="text-center text-slate-400 font-medium">
                {t("reset_password.not_registered_yet")}{" "}
                <Link
                  to="/register"
                  className="text-purple-800 font-medium inline-flex space-x-1 items-center"
                >
                  <span>{t("reset_password.register_now")}</span>
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
