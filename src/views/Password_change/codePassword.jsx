import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import React from 'react';

import { resetPasswordVerify } from '../../api/auth'; 
import Swal from 'sweetalert2';
import logo from '../../assets/img/hola.png';
import { useTranslation } from 'react-i18next';
import LoginFond from "../../assets/img/Login.png"
import "../../css/animations.css";

const ResetPasswordVerifyForm = () => {
    const navigate = useNavigate();
    const [codes, setCodes] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);
    const { t } = useTranslation('global');

    // Helper function to handle input changes and focus management
    const handleCodeChange = (index, value) => {
        const newCodes = [...codes];
        newCodes[index] = value;
        setCodes(newCodes);

        // Move to next input if current one is filled
        if (value !== '' && index < codes.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
        // Move to previous input if backspace is pressed and current input is empty
        if (value === '' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            if (index < codes.length - 1) {
                inputRefs.current[index + 1]?.focus();
            }
        }
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            if (index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const resetCode = codes.join('');
        try {
            const response = await resetPasswordVerify({ resetCode });
            Swal.fire({
                icon: 'success',
                title: t('reset_password_verify.valid_code'),
                showConfirmButton: false,
                timer: 3000,
            });
            setTimeout(() => {
                navigate(`/newPassword?resetCode=${resetCode}`);
            }, 3000);
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: t('reset_password_verify.invalid_code'),
                text: t('reset_password_verify.try_again'),
            });
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-cover bg-center"
            style={{ backgroundImage: `url(${LoginFond})` }}
        >
            <div className="bg-white rounded-xl shadow-xl shadow-zinc-950 py-10 px-6 mx-4 max-w-md w-full">
                <h1 className="text-2xl mx-auto text-center font-black bg-gradient-to-r from-emerald-400 to-purple-800 bg-clip-text text-transparent mb-3 pt-4">
                {t('reset_password_verify.sent_code')}
                </h1>
                <p className="italic mt-6 font-semibold text-center text-lg text-purple-800">
                {t('reset_password_verify.enter_code')}
                </p>
                <div className="w-full flex flex-col items-center">
                <img src={logo} alt="Logo" className="h-40" />
                </div>
                <form onSubmit={handleSubmit} className="my-4">
                <div className="flex flex-col space-y-6">
                    <div className="flex justify-center items-center space-x-3">
                    {codes.map((code, index) => (
                        <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        className="block w-12 h-12 bg-white text-center text-2xl rounded-lg focus:outline-none border border-black hover:shadow transition-all"
                        maxLength="1"
                        value={code}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        autoFocus={index === 0}
                        />
                    ))}
                    </div>
                    <button
                    type="submit"
                    className="py-3 font-medium text-white rounded-lg w-3/4 mx-auto flex justify-center items-center bt1"
                    >
                    <span>{t('reset_password_verify.confirm_code')}</span>
                    </button>
                    <p className="text-center text-slate-400 font-medium">
                    {t('reset_password_verify.not_received')}{' '}
                    <Link to="/reset" className="text-purple-800 px-2 rounded-lg hover:text-pink-500 transition-all duration-700">
                        {t('reset_password_verify.request_new')}
                    </Link>
                    </p>
                </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordVerifyForm;
