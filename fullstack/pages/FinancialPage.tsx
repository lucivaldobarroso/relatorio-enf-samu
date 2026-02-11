
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { dataService } from '../services/dataService';
import { languageService } from '../services/languageService';
import { AppState, Transaction } from '../types';

const FinancialPage: React.FC = () => {
  const [state, setState] = useState<AppState>(dataService.getState());
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [lang, setLang] = useState(languageService.getLang());
  const navigate = useNavigate();

  useEffect(() => {
    const handleLang = () => setLang(languageService.getLang());
    window.addEventListener('languageChange', handleLang);
    return () => window.removeEventListener('languageChange', handleLang);
  }, []);

  const t = (key: string) => languageService.get(key, lang);

  const sales = state.transactions.filter(t => t.type === 'sale');
  const expenses = state.transactions.filter(t => t.type === 'expense');
  const payments = state.transactions.filter(t => t.type === 'payment');

  const totalSales = sales.reduce((acc, curr) => acc + curr.total, 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.total, 0);
  const totalPayments = payments.reduce((acc, curr) => acc + curr.total, 0);

  // No financeiro admin, faturamento = vendas totais.
  const balance = totalSales - totalExpenses;

  const handleAddExpense = () => {
    const newExpense: Transaction = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      date: new Date().toISOString(),
      items: [],
      total: 0,
      paymentMethod: 'Dinheiro',
      type: 'expense',
      orderType: 'immediate',
      description: 'Gasto Administrativo'
    };
    setEditingTx(newExpense);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTx) {
      const exists = state.transactions.some(t => t.id === editingTx.id);
      if (exists) {
        dataService.updateTransaction(editingTx);
      } else {
        dataService.addTransaction(editingTx);
      }
      setState(dataService.getState());
      setEditingTx(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Excluir este lançamento financeiro permanentemente?')) {
      dataService.deleteTransaction(id);
      setState(dataService.getState());
    }
  };

  return (
    <Layout>
      <header className="px-6 py-6 flex items-center justify-between bg-white dark:bg-[#121212] border-b border-slate-50 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center active:scale-90 transition-all">
            <span className="material-icons-round">arrow_back</span>
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tight">{t('cash_flow')}</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('profits')}</p>
          </div>
        </div>
        <button onClick={handleAddExpense} className="w-12 h-12 bg-primary text-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 active:scale-90 transition-all">
          <span className="material-icons-round">add</span>
        </button>
      </header>

      <main className="p-6 space-y-8">
        <section className="space-y-4">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -translate-y-20 translate-x-20 transition-transform group-hover:scale-125"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-2">Lucro Líquido</p>
            <p className="text-4xl font-black mb-6">R$ {balance.toFixed(2)}</p>
            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
              <div>
                <p className="text-[8px] font-black uppercase opacity-40 mb-1">Total Vendas</p>
                <p className="text-emerald-400 font-extrabold text-sm">+ R$ {totalSales.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-[8px] font-black uppercase opacity-40 mb-1">Total Despesas</p>
                <p className="text-red-400 font-extrabold text-sm">- R$ {totalExpenses.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6 px-1">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Fluxo Completo</h2>
            <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
              <span className="material-icons-round text-sm text-slate-400">filter_list</span>
            </div>
          </div>

          <div className="space-y-3">
            {state.transactions.map(tx => (
              <div key={tx.id} className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] border border-slate-50 dark:border-slate-700 flex justify-between items-center group active:scale-[0.98] transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === 'expense' ? 'bg-red-50 text-red-500' : tx.type === 'payment' ? 'bg-blue-50 text-blue-500' : 'bg-emerald-50 text-emerald-500'}`}>
                    <span className="material-icons-round">{tx.type === 'expense' ? 'receipt' : tx.type === 'payment' ? 'account_balance_wallet' : 'shopping_bag'}</span>
                  </div>
                  <div className="max-w-[140px]">
                    <p className="font-extrabold text-sm truncate">{tx.description || (tx.type === 'sale' ? `Venda #${tx.id}` : 'Lançamento')}</p>
                    <p className="text-[10px] font-bold text-slate-400">{new Date(tx.date).toLocaleDateString()} • {tx.paymentMethod}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`font-black text-sm ${tx.type === 'expense' ? 'text-red-500' : 'text-emerald-500'}`}>
                    {tx.type === 'expense' ? '-' : '+'} R$ {tx.total.toFixed(2)}
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditingTx(tx)} className="p-2 bg-slate-50 dark:bg-slate-700 rounded-xl">
                      <span className="material-icons-round text-xs">edit</span>
                    </button>
                    <button onClick={() => handleDelete(tx.id)} className="p-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl">
                      <span className="material-icons-round text-xs">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {editingTx && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-6">
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl animate-in fade-in" onClick={() => setEditingTx(null)}></div>
          <div className="relative w-full max-w-sm bg-white dark:bg-[#1A1A1A] rounded-4xl p-8 shadow-2xl animate-slide-up">
            <h2 className="text-2xl font-black mb-6 tracking-tight">{editingTx.type === 'sale' ? 'Ajustar Venda' : 'Lançar Despesa'}</h2>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 px-1">Descrição</label>
                <input
                  type="text"
                  value={editingTx.description || ''}
                  onChange={e => setEditingTx({ ...editingTx, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl p-4 font-bold focus:ring-4 focus:ring-primary/20"
                  placeholder="Título do lançamento"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 px-1">Valor</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingTx.total}
                    onChange={e => setEditingTx({ ...editingTx, total: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl p-4 font-black"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 px-1">Método</label>
                  <select
                    value={editingTx.paymentMethod}
                    onChange={e => setEditingTx({ ...editingTx, paymentMethod: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl p-4 font-bold text-xs"
                  >
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="PIX">PIX</option>
                    <option value="Cartão">Cartão</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-primary py-5 rounded-3xl font-black text-xs text-slate-900 shadow-xl shadow-primary/20 uppercase tracking-widest tap-active">
                Salvar Registro
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default FinancialPage;
