import React, { lazy, Suspense, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';

import { GlobalFacade, setupStore } from '@store';
import { reportWebVitals, lang } from '@utils';
import Router from './router';

const fallbackLng = localStorage.getItem('i18nextLng');
if (!fallbackLng) {
  localStorage.setItem('i18nextLng', 'en');
}
i18n
  .use(XHR)
  // .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    fallbackLng: fallbackLng || 'en',
    interpolation: {
      escapeValue: false,
    },
  });
const store = setupStore();
let container: HTMLElement;
const Styling = lazy(() => import('./utils/init/styling'));

const Context = () => {
  const { locale, setLanguage } = GlobalFacade();
  useEffect(() => {
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i)?.indexOf('temp-') === 0) {
        localStorage.removeItem(localStorage.key(i) || '');
      }
    }
    setLanguage(lang);
  }, []);

  return (
    <Styling>
      <ConfigProvider locale={locale}>
        <Router />
      </ConfigProvider>
    </Styling>
  );
};

document.addEventListener(
  'DOMContentLoaded',
  () => {
    if (!container) {
      container = document.getElementById('root') as HTMLElement;
      const root = createRoot(container);
      root.render(
        <Suspense
          fallback={
            <div id="handle-preloader">
              <div className="animation-preloader">
                <div className="spinner"></div>
                <div className="txt-loading">
                  <span data-text-preloader="L" className="letters-loading">
                    L
                  </span>
                  <span data-text-preloader="o" className="letters-loading">
                    o
                  </span>
                  <span data-text-preloader="a" className="letters-loading">
                    a
                  </span>
                  <span data-text-preloader="d" className="letters-loading">
                    d
                  </span>
                  <span data-text-preloader="i" className="letters-loading">
                    i
                  </span>
                  <span data-text-preloader="n" className="letters-loading">
                    n
                  </span>
                  <span data-text-preloader="g" className="letters-loading">
                    g
                  </span>
                  <span data-text-preloader="." className="letters-loading">
                    .
                  </span>
                  <span data-text-preloader="." className="letters-loading">
                    .
                  </span>
                </div>
              </div>
            </div>
          }
        >
          <Provider store={store}>
            <Context />
          </Provider>
        </Suspense>,
      );
    }
  },
  { passive: true },
);
reportWebVitals();
