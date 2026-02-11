import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { languageService } from '../services/languageService';

const SuccessPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lang, setLang] = useState(languageService.getLang());

  useEffect(() => {
    const handleLang = () => setLang(languageService.getLang());
    window.addEventListener('languageChange', handleLang);
    return () => window.removeEventListener('languageChange', handleLang);
  }, []);

  const t = (key: string) => languageService.get(key, lang);

  return (
    <Layout hideNav>
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center animate-in fade-in duration-700">
        <div className="w-32 h-32 bg-emerald-500 text-white rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl animate-bounce">
          <span className="material-icons-round text-6xl">favorite</span>
        </div>

        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter">{t('success_thanks')}</h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-[280px] leading-relaxed mb-10">
          {t('menu')} <span className="text-slate-900 dark:text-white font-bold">#CF-{id}</span> {t('success_msg')}
        </p>

        <div className="w-full max-w-[280px] space-y-3">
          <button
            onClick={() => navigate('/pdv')}
            className="w-full py-5 bg-primary text-slate-900 font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 tap-active hover-float transition-all"
          >
            {t('want_more')}
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black text-xs uppercase tracking-widest rounded-2xl tap-active transition-all"
          >
            {t('go_home')}
          </button>
        </div>

        <div className="mt-16 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-60">
          <span className="material-icons-round text-xs">auto_awesome</span>
          Cantina Fácil • Gestão Inteligente
        </div>
      </main>
    </Layout>
  );
};

export default SuccessPage;
