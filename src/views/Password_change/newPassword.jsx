import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { passwordReset } from '../../api/auth';
import { useTranslation } from 'react-i18next';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons
import logo from "../../assets/img/hola.png";
import LoginFond from "../../assets/img/Login.png"

function NewPassword() {
    const { token } = useParams();
    const [error, setError] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation('global');

    const validationSchema = yup.object().shape({
        password: yup.string().required(t('new_password.required')).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/, t('new_password.password_format')),
        confirmPassword: yup.string().oneOf([yup.ref('password'), null], t('new_password.passwords_match')),
    });

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                await passwordReset(values);
                Swal.fire({
                    icon: 'success',
                    title: t('new_password.success'),
                    showConfirmButton: false,
                    timer: 2000,
                });
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: t('new_password.error'),
                    text: t('new_password.try_again'),
                });
                console.error(error);
            }
        },
    });

    useEffect(() => {
        setPasswordsMatch(formik.values.password === formik.values.confirmPassword);
    }, [formik.values.password, formik.values.confirmPassword]);

    return (
        <div className="min-h-screen flex justify-center bg-cover bg-center"
            style={{ backgroundImage: `url(${LoginFond})` }}
        >
            <div className="flex justify-center items-center w-full">   
                <div className="p-8 bg-white rounded-3xl shadow-2xl max-w-2xl w-1/2">
                    <h2 className="text-2xl mx-auto text-center font-black bg-gradient-to-r from-emerald-400 to-purple-800 bg-clip-text text-transparent mb-3 pt-4">
                        {t('new_password.change_password')}
                    </h2>
                    <div className="flex justify-center mb-2">
                        <img src={logo} alt="logo" className="h-48" />
                    </div>
                    <form onSubmit={formik.handleSubmit} className="py-2 flex flex-col space-y-4">
                        <div>
                            <label className="text-lg font-bold text-gray-500 block mb-2">
                                {t('new_password.new_password')}
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-full p-3 border rounded-lg"
                                    placeholder={t('new_password.new_password')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                                >
                                    {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
                                </button>
                            </div>
                            {formik.touched.password && formik.errors.password ? (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                            ) : null}
                        </div>
                        <div>
                            <label className="text-lg font-bold text-gray-500 mb-2">
                                {t('new_password.confirm_password')}
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-full p-3 rounded-lg border"
                                    placeholder={t('new_password.confirm_password')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                                >
                                    {showConfirmPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
                                </button>
                            </div>
                            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</div>
                            ) : null}
                        </div>
                        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
                        
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className={`w-1/2 py-3 font-medium text-white rounded-lg text-lg ${passwordsMatch ? 'bt1' : 'bg-red-500 cursor-default'} disabled:opacity-50 block`}
                                disabled={!formik.isValid || !passwordsMatch}
                            >
                                {t('new_password.change_password')}
                            </button>
                        </div>
                    </form>
                    <div className="mt-4 text-center">
                        <Link
                            to="/"
                            className="text-purple-700 font-semibold inline-flex space-x-1 items-center hover:text-pink-500 transition-all duration-700"
                            style={{ textDecoration: 'none' }}
                        >
                            {t('new_password.return_to_login')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewPassword;
