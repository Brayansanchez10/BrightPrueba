import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobeAmericas, FaGlobeEurope } from 'react-icons/fa';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isEnglish, setIsEnglish] = useState(i18n.language === 'en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
      setIsEnglish(savedLanguage === 'en');
    }
  }, [i18n]);

  const handleToggle = () => {
    const newLang = isEnglish ? 'es' : 'en';
    i18n.changeLanguage(newLang);
    setIsEnglish(!isEnglish);
    localStorage.setItem('language', newLang);
  };

  return (
    <div className="fixed bottom-2 right-4 flex items-center bg-white p-1 rounded-full shadow-lg border border-gray-300">
      <div className="flex items-center space-x-1">
        <span className="text-gray-700 font-medium text-sm">{isEnglish ? 'EN' : 'ES'}</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isEnglish}
            onChange={handleToggle}
            className="sr-only"
          />
          <div className="block bg-gray-200 w-10 h-5 rounded-full shadow-inner">
            <div
              className={`dot absolute left-1 top-0.5 bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                isEnglish ? 'translate-x-5' : ''
              }`}
            ></div>
            <div
              className={`absolute top-0.5 left-1 text-blue-500 transform transition-opacity duration-300 ${
                isEnglish ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <FaGlobeEurope size={16} />
            </div>
            <div
              className={`absolute top-0.5 right-1 text-green-500 transform transition-opacity duration-300 ${
                isEnglish ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <FaGlobeAmericas size={16} />
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default LanguageSwitcher;