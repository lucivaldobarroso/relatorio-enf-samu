
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { dataService } from '../services/dataService';
import { languageService } from '../services/languageService';
import { AppState } from '../types';

const UserTransactionsPage: React.FC = () => {
  const [lang, setLang] = useState(languageService.getLang());
  const [state] = useState<AppState>(dataService.getState());
  const navigate = useNavigate();

  useEffect(() => {
    const handleLang = () => setLang(languageService.getLang());
    window.addEventListener('languageChange', handleLang);
    return () => window.removeEventListener('languageChange', handleLang);
  }, []);

  const t = (key: string) => languageService.get(key, lang);

  // Fix: replaced state.currentUser.id with dataService.getCurrentUser().id
  const currentUser = dataService.getCurrentUser();
  const myTransactions = state.transactions.filter(t => t.userId === currentUser.id);

  return (
    <Layout>
      <header className="px-6 py-4 flex items-center gap-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <span className="material-icons-round">arrow_back</span>
        </button>
        <div>
          <h1 className="text-xl font-bold">{t('my_orders')}</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('order_history')}</p>
        </div>
      </header>

      <main className="p-6 space-y-4 pb-32">
        {myTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
            <span className="material-icons-round text-6xl mb-4">history_toggle_off</span>
            <p className="font-medium">{t('no_orders')}</p>
          </div>
        ) : (
          myTransactions.map(tx => (
            <div key={tx.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">PEDIDO #{tx.id}</p>
                  <p className="text-xs text-slate-400 font-medium">{new Date(tx.date).toLocaleDateString()} às {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <span className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full text-[10px] font-black text-slate-500 uppercase">
                  {tx.paymentMethod}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {tx.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">
                      <span className="text-primary font-bold">{item.quantity}x</span> {item.name}
                    </span>
                    <span className="font-bold">R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-50 dark:border-slate-700 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase">Total do Consumo</span>
                <span className="text-lg font-black text-slate-900 dark:text-white">R$ {tx.total.toFixed(2)}</span>
              </div>
            </div>
          ))
        )}
      </main>
    </Layout>
  );
};

export default UserTransactionsPage;
