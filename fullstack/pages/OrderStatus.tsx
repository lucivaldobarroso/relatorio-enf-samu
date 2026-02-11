
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { languageService } from '../services/languageService';

const OrderStatus: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lang, setLang] = useState(languageService.getLang());
  const [step, setStep] = useState(2); // 1: Recebido, 2: Preparando, 3: Retirada

  useEffect(() => {
    const handleLang = () => setLang(languageService.getLang());
    window.addEventListener('languageChange', handleLang);
    return () => window.removeEventListener('languageChange', handleLang);
  }, []);

  const t = (key: string) => languageService.get(key, lang);

  return (
    <Layout hideNav>
      <header className="px-6 pt-6 pb-2">
        <div className="bg-white px-6 py-4 rounded-[2.5rem] shadow-xl flex items-center justify-between">
          <button onClick={() => navigate('/dashboard')} className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center active:scale-90 transition-all group">
            <span className="material-icons-round text-black group-hover:-translate-x-1 transition-transform">arrow_back</span>
          </button>
          <h1 className="text-xl font-black tracking-tight text-black uppercase">{t('status_title') || 'Status do Pedido'}</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="px-6 py-8 flex flex-col items-center max-w-md mx-auto">
        {/* Stepper Premium */}
        <div className="relative w-full flex items-center justify-between mb-16 px-4">
          <div className="absolute top-5 left-0 w-full h-1.5 bg-slate-100 rounded-full z-0"></div>
          <div
            className="absolute top-5 left-0 h-1.5 bg-primary rounded-full z-0 transition-all duration-1000 shadow-[0_0_15px_rgba(238,238,43,0.5)]"
            style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
          ></div>

          {[
            { s: 1, icon: 'receipt_long', label: t('order_received') || 'Recebido' },
            { s: 2, icon: 'restaurant', label: t('order_preparing') || 'Preparando' },
            { s: 3, icon: 'shopping_bag', label: t('order_pickup') || 'Retirada' }
          ].map((item) => (
            <div key={item.s} className="relative z-10 flex flex-col items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-500 border-4 border-white ${step >= item.s ? 'bg-primary text-black scale-110 shadow-primary/30' : 'bg-white text-slate-200 shadow-slate-100'}`}>
                <span className="material-icons-round text-xl font-bold">{step > item.s ? 'check' : item.icon}</span>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${step >= item.s ? 'text-black' : 'text-slate-300'}`}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Hero Section: Chef Image */}
        <div className="relative w-full mb-12 flex flex-col items-center">
          <div className="relative w-72 h-72">
            <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-white to-transparent z-10"></div>
            <div className="absolute -inset-4 bg-primary/5 rounded-full animate-pulse blur-2xl"></div>
            <div className="w-full h-full rounded-[4rem] overflow-hidden border-8 border-white bg-white shadow-2xl relative z-0 ring-1 ring-slate-100">
              <img
                src="https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&q=80&w=800"
                alt="Chef"
                className="w-full h-full object-cover scale-110"
              />
            </div>
          </div>

          <div className="text-center mt-8 space-y-3">
            <h2 className="text-4xl font-black text-black tracking-tighter italic">Quase lá!</h2>
            <p className="text-slate-400 font-bold text-sm max-w-[280px] leading-relaxed uppercase tracking-tighter">
              Seu pedido #{id} está sendo preparado com todo carinho pela nossa equipe.
            </p>
          </div>
        </div>

        {/* Order Info Card */}
        <div className="w-full bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-50 space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full rotate-45 translate-x-12 -translate-y-12"></div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
            <div className="space-y-1">
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em]">{t('order_number') || 'Número do Pedido'}</p>
              <p className="text-2xl font-black text-black tracking-tighter">#CF-{id || '8824'}</p>
            </div>
            <div className="sm:text-right space-y-1">
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em]">{t('estimate') || 'Estimativa'}</p>
              <div className="flex items-center sm:justify-end gap-2">
                <span className="material-icons-round text-emerald-500 text-sm animate-pulse">timer</span>
                <p className="text-2xl font-black text-emerald-600 tracking-tighter">8 min</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/90 to-transparent flex flex-col items-center gap-4">
        <button
          onClick={() => navigate('/pdv')}
          className="w-full max-w-md h-20 bg-primary text-black font-black text-sm uppercase tracking-[0.2em] rounded-[2rem] shadow-[0_20px_50px_rgba(238,238,43,0.4)] active:scale-95 transition-all flex items-center justify-center gap-4 border-4 border-white/20 group"
        >
          {t('order_details') || 'Ver detalhes do pedido'}
          <span className="material-icons-round text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Algum problema? <span className="text-primary underline cursor-pointer">Falar com a cantina</span></p>
      </footer>
    </Layout>
  );
};

export default OrderStatus;
