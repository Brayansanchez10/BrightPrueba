import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next"
import i18next from 'i18next';
import LanguageSwitcher from './LanguageSwitcher.jsx';

import global_es from "./translations/es/global.json";
import global_en from "./translations/en/global.json";

i18next.init({
  interpolation: { escapeValue: false },
  lng: "en",
  resources: {
    es: {
      global: global_es,
    },
    en: {
      global: global_en,
    },
  },
});


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <I18nextProvider i18n={i18next}>
      <App />
      <LanguageSwitcher />
    </I18nextProvider>
  </BrowserRouter>,
)
