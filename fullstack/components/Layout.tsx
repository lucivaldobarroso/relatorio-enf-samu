
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { languageService } from '../services/languageService';

import { CONTACT_INFO } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, hideNav }) => {
  const state = dataService.getState();
  const isAdmin = state.auth.role === 'admin';
  const navigate = useNavigate();
  const [lang, setLang] = useState(languageService.getLang());
  const [showLibras, setShowLibras] = useState(false);

  const handleLangChange = (newLang: string) => {
    setLang(newLang);
    languageService.setLang(newLang);
    window.dispatchEvent(new Event('languageChange'));
  };

  const handleLogout = () => {
    dataService.logout();
    navigate('/');
  };

  const t = (key: string) => languageService.get(key, lang);

  return (
    <div className="min-h-screen relative font-display overflow-x-hidden pb-40">
      {/* Background persistente */}
      <div className="fixed inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1920"
          className="w-full h-full object-cover grayscale-[20%]"
          alt="Background"
        />
        <div className="absolute inset-0 bg-black/85 backdrop-blur-[2px]"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10 min-h-screen flex flex-col px-4 md:px-8">
        {/* Top bar: Idioma */}
        <div className="py-6 flex justify-between items-center">
          <Link to="/dashboard" className="bg-white px-5 py-2 rounded-2xl shadow-xl flex items-center gap-2 group transition-all">
            <span className="material-icons-round text-primary group-hover:scale-110 transition-transform">storefront</span>
            <span className="text-sm font-black text-black tracking-tighter">Cantina Fácil</span>
          </Link>
          <div className="flex bg-white shadow-2xl rounded-full p-1 border border-primary/30">
            {['PT', 'EN', 'ES'].map((l) => (
              <button
                key={l}
                onClick={() => handleLangChange(l)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${lang === l ? 'bg-primary text-black shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 animate-fade-in">
          {children}
        </div>

        {/* Footer Consistente Melhorado */}
        <footer className={`py-20 text-center space-y-12 mt-12 border-t border-white/5`}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-left bg-white/5 backdrop-blur-3xl p-10 rounded-[4rem] border border-white/10 shadow-2xl">
            <div className="space-y-6">
              <h4 className="text-primary font-black uppercase text-[10px] tracking-[0.4em] mb-2 text-center md:text-left">Contato</h4>
              <ul className="space-y-6">
                <li className="flex flex-col md:flex-row items-center md:items-start gap-3 text-white/70 hover:text-primary transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <span className="material-icons-round text-primary/50 group-hover:scale-110 transition-transform">whatsapp</span>
                    <span className="text-[14px] font-black">{CONTACT_INFO.phone}</span>
                  </div>
                </li>
                <li className="flex flex-col md:flex-row items-center md:items-start gap-3 text-white/70 hover:text-primary transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <span className="material-icons-round text-primary/50 group-hover:scale-110 transition-transform">mail</span>
                    <span className="text-[12px] font-bold truncate max-w-[150px]">{CONTACT_INFO.email}</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="space-y-5">
              <h4 className="text-primary font-black uppercase text-[10px] tracking-[0.4em]">Social</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-white/70 hover:text-primary transition-colors cursor-pointer group">
                  <span className="material-icons-round text-primary/50 group-hover:scale-110 transition-transform">camera_alt</span>
                  <span className="text-[13px] font-bold tracking-tight">{CONTACT_INFO.instagram}</span>
                </li>
                <li className="flex items-center gap-3 text-white/70 hover:text-primary transition-colors cursor-pointer group">
                  <span className="material-icons-round text-primary/50 group-hover:scale-110 transition-transform">facebook</span>
                  <span className="text-[13px] font-bold tracking-tight">{CONTACT_INFO.facebook}</span>
                </li>
              </ul>
            </div>

            <div className="space-y-5">
              <h4 className="text-primary font-black uppercase text-[10px] tracking-[0.4em]">Institucional</h4>
              <div className="flex flex-col gap-4">
                <Link to="/privacidade" className="text-[13px] font-bold text-white/70 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-primary/30 rounded-full group-hover:bg-primary transition-colors"></span>
                  Privacidade
                </Link>
                <Link to="/contato" className="text-[13px] font-bold text-white/70 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-primary/30 rounded-full group-hover:bg-primary transition-colors"></span>
                  Suporte LB Conexão
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-6">
            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em]">Powered by</p>
            <p className="text-3xl font-black text-primary tracking-tighter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">LB Conexão</p>
          </div>
        </footer>

        {/* Botão de Libras */}
        <button
          className="fixed bottom-28 right-4 md:right-10 z-[70] w-16 h-16 bg-blue-600 text-white rounded-[1.8rem] shadow-[0_20px_40px_rgba(37,99,235,0.4)] transition-all tap-active border-4 border-white/30 flex items-center justify-center group"
          onClick={() => {
            setShowLibras(true);
            setTimeout(() => {
              const accessButton = document.querySelector('[vw-access-button]');
              if (accessButton) (accessButton as HTMLElement).click();
            }, 500);
          }}
        >
          <span className="material-icons-round text-3xl group-hover:rotate-12 transition-transform">front_hand</span>
        </button>

        {showLibras && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center px-6">
            <div className="fixed inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setShowLibras(false)}></div>
            <div className="bg-white rounded-[3.5rem] p-12 w-full max-w-sm relative text-center space-y-8 animate-fade-in shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
              <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2.2rem] flex items-center justify-center mx-auto ring-8 ring-blue-50/50">
                <span className="material-icons-round text-5xl">interpreter_mode</span>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-black leading-none">{t('libras_title')}</h3>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t('libras_desc')}</p>
              </div>
              <button onClick={() => setShowLibras(false)} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">Fechar Suporte</button>
            </div>
          </div>
        )}

        {!hideNav && (
          <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl bg-white/98 backdrop-blur-3xl px-6 md:px-16 py-6 flex justify-between items-center z-[60] rounded-t-[4rem] shadow-[0_-30px_80px_rgba(0,0,0,0.6)] border-t border-slate-100">
            <NavLink to="/dashboard" className={({ isActive }) => `flex flex-col items-center gap-1.5 transition-all tap-active ${isActive ? 'text-black scale-110' : 'text-slate-300'}`}>
              <span className="material-icons-round text-3xl">home</span>
              <span className="text-[9px] font-black uppercase tracking-widest">{t('home')}</span>
            </NavLink>

            <NavLink to="/pdv" className={({ isActive }) => `flex flex-col items-center gap-1.5 transition-all tap-active ${isActive ? 'text-black scale-110' : 'text-slate-300'}`}>
              <span className="material-icons-round text-3xl">restaurant_menu</span>
              <span className="text-[9px] font-black uppercase tracking-widest">{t('menu')}</span>
            </NavLink>

            {isAdmin ? (
              <NavLink to="/estoque" className={({ isActive }) => `flex flex-col items-center gap-1.5 transition-all tap-active ${isActive ? 'text-black scale-110' : 'text-slate-300'}`}>
                <span className="material-icons-round text-3xl">inventory</span>
                <span className="text-[9px] font-black uppercase tracking-widest">{t('stock')}</span>
              </NavLink>
            ) : (
              <NavLink to="/meus-pedidos" className={({ isActive }) => `flex flex-col items-center gap-1.5 transition-all tap-active ${isActive ? 'text-black scale-110' : 'text-slate-300'}`}>
                <span className="material-icons-round text-3xl">history</span>
                <span className="text-[9px] font-black uppercase tracking-widest">{t('history')}</span>
              </NavLink>
            )}

            <button onClick={handleLogout} className="flex flex-col items-center gap-1.5 text-slate-300 tap-active group">
              <span className="material-icons-round text-red-500 text-3xl group-hover:scale-110 transition-transform">power_settings_new</span>
              <span className="text-[9px] font-black uppercase tracking-widest">{t('logout')}</span>
            </button>
          </nav>
        )}
      </div>
    </div>
  );
};

export default Layout;
