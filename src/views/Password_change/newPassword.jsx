import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { passwordReset } from '../../api/auth';
import { useTranslation } from 'react-i18next';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons

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
                toast.success(t('new_password.success'));
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } catch (error) {
                toast.error(t('new_password.error'));
                console.error(error);
            }
        },
    });

    useEffect(() => {
        setPasswordsMatch(formik.values.password === formik.values.confirmPassword);
    }, [formik.values.password, formik.values.confirmPassword]);

    return (
        <div className="flex min-h-screen bg-gradient-to-r from-blue-200 via-blue-400 to-blue-600 justify-center items-center">
            <ToastContainer />
            <div className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 p-8">
                <div className="p-8 bg-white rounded-3xl shadow-2xl bg-gradient-to-tl from-purple-700 to-blue-600">
                    <h2 className="text-3xl md:text-4xl lg:text-4xl font-black text-center mb-6 text-white">{t('new_password.change_password')}</h2>
                    <form onSubmit={formik.handleSubmit} className="py-6 flex flex-col space-y-4">
                        <div>
                            <label className="text-lg font-bold text-white block mb-2">{t('new_password.new_password')}</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-full p-3 border border-cyan-300 rounded-full bg-pink-100 placeholder-gray-450 focus:outline-sky-600 focus:border-sky-950 focus:bg-slate-200"
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
                            <label className="text-lg font-bold text-white block mb-2">{t('new_password.confirm_password')}</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-full p-3 border border-cyan-300 rounded-full bg-pink-100 placeholder-gray-450 focus:outline-sky-600 focus:border-sky-950 focus:bg-slate-200"
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
                        <button
                            type="submit"
                            className={`w-full py-3 px-6 font-medium text-white rounded-full text-lg ${passwordsMatch ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} disabled:opacity-50`}
                            disabled={!formik.isValid || !passwordsMatch}
                        >
                            {t('new_password.change_password')}
                        </button>
                    </form>
                    <div className="mt-4 text-center">
                        <Link
                            to="/"
                            className="text-white hover:bg-gradient-to-r from-green-600 to-green-500 shadow-lg shadow-blue-300 font-semibold inline-flex space-x-1 items-center"
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
