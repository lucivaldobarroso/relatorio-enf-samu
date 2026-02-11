
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { dataService } from '../services/dataService';
import { languageService } from '../services/languageService';
import { CartItem, Transaction, AppState } from '../types';

const Checkout: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<Transaction['paymentMethod']>('Dinheiro');
  const [orderType, setOrderType] = useState<'immediate' | 'pickup'>('immediate');
  const [lang, setLang] = useState(languageService.getLang());
  const navigate = useNavigate();

  useEffect(() => {
    const handleLang = () => setLang(languageService.getLang());
    window.addEventListener('languageChange', handleLang);
    return () => window.removeEventListener('languageChange', handleLang);
  }, []);

  useEffect(() => {
    const pending = sessionStorage.getItem('pending_cart');
    if (pending) {
      setCart(JSON.parse(pending));
    } else {
      navigate('/pdv');
    }
  }, [navigate]);

  const t = (key: string) => languageService.get(key, lang);
  const total = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

  const handleConfirm = () => {
    const currentUser = dataService.getCurrentUser();
    if (paymentMethod === 'Plano Quinzenal' && !currentUser.hasActiveContract) {
      navigate('/contrato');
      return;
    }

    const tx: Transaction = {
      id: Math.floor(Math.random() * 9000 + 1000).toString(),
      date: new Date().toISOString(),
      items: cart,
      total: total,
      paymentMethod: paymentMethod,
      type: 'sale',
      orderType: orderType,
      userId: currentUser.id,
      description: `Pedido ${cart.length} itens`
    };

    dataService.addTransaction(tx);
    sessionStorage.removeItem('pending_cart');

    if (orderType === 'pickup') {
      navigate('/status/' + tx.id);
    } else {
      navigate('/sucesso/' + tx.id);
    }
  };

  const paymentOptions: { label: Transaction['paymentMethod'], icon: string }[] = [
    { label: 'Dinheiro', icon: 'payments' },
    { label: 'PIX', icon: 'qr_code_2' },
    { label: 'Cartão', icon: 'credit_card' },
    { label: 'Plano Quinzenal', icon: 'stars' }
  ];

  return (
    <Layout hideNav>
      <header className="px-6 pt-6 pb-2">
        <div className="bg-white px-6 py-4 rounded-[2.5rem] shadow-xl flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center active:scale-90 transition-all">
            <span className="material-icons-round text-black">arrow_back</span>
          </button>
          <h1 className="text-xl font-black tracking-tight text-black uppercase">Finalizar</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="px-6 py-4 space-y-6 pb-40">
        {/* Balão de Valor - Alto Contraste */}
        <section className="bg-white rounded-[3rem] p-10 shadow-2xl border-4 border-primary/10 flex flex-col items-center text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Valor do Pedido</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold opacity-30 text-black">R$</span>
            <span className="text-6xl font-black text-black tracking-tighter">{total.toFixed(2)}</span>
          </div>
        </section>

        <section className="bg-white/95 backdrop-blur-md p-8 rounded-[3rem] shadow-xl border border-white/20 space-y-6">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400 border-l-4 border-primary pl-3">{t('payment_method')}</h2>
          <div className="grid grid-cols-2 gap-4">
            {paymentOptions.map(opt => (
              <button
                key={opt.label}
                onClick={() => setPaymentMethod(opt.label)}
                className={`p-6 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all border-2 h-32 ${paymentMethod === opt.label
                  ? 'bg-primary/20 border-primary scale-105 shadow-lg'
                  : 'bg-white border-slate-100'
                  }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${paymentMethod === opt.label ? 'bg-primary text-black' : 'bg-slate-50 text-slate-300'}`}>
                  <span className="material-icons-round text-2xl font-bold">{opt.icon}</span>
                </div>
                <span className={`text-[9px] font-black uppercase text-center leading-tight ${paymentMethod === opt.label ? 'text-black' : 'text-slate-400'}`}>
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="bg-white/95 backdrop-blur-md p-8 rounded-[3rem] shadow-xl border border-white/20 space-y-4">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400 border-l-4 border-primary pl-3">Logística</h2>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setOrderType('immediate')}
              className={`flex-1 py-4 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${orderType === 'immediate' ? 'bg-white text-black shadow-md' : 'text-slate-400'}`}
            >
              Comer Agora
            </button>
            <button
              onClick={() => setOrderType('pickup')}
              className={`flex-1 py-4 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${orderType === 'pickup' ? 'bg-white text-black shadow-md' : 'text-slate-400'}`}
            >
              Retirar Depois
            </button>
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-white/95 backdrop-blur-md border-t border-slate-100 z-50">
        <button
          onClick={handleConfirm}
          className="w-full h-20 bg-primary text-black font-black text-lg uppercase tracking-widest rounded-[2rem] shadow-[0_20px_50px_rgba(238,238,43,0.4)] active:scale-95 transition-all flex items-center justify-center gap-3 border-4 border-white/20"
        >
          {t('confirm_payment')}
        </button>
      </footer>
    </Layout>
  );
};

export default Checkout;
