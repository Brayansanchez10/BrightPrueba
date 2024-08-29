import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const { t } = useTranslation('global');

  return (
    <footer className="bg-gradient-to-r from-purple-700 to-pink-600 p-6 text-white text-center">
      <div className="container mx-auto">
        <p className="mb-4">{t('footer.description')}</p>
        <div className="flex justify-center space-x-4 mb-4">
          <a href="https://www.facebook.com/disruptive.devops?checkpoint_src=any" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
            <FaFacebook size="24px" />
          </a>
          <a href="https://x.com/DisruptiveITDev" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
            <FaTwitter size="24px" />
          </a>
          <a href="https://www.instagram.com/disruptive.info/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
            <FaInstagram size="24px" />
          </a>
        </div>
        <p className="text-sm">{t('footer.copy_right')}</p>
      </div>
    </footer>
  );
};

export default Footer;