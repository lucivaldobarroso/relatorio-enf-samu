
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { dataService } from '../services/dataService';
import { languageService } from '../services/languageService';
import { AppState, User, Product } from '../types';

const Dashboard: React.FC = () => {
  const [state, setState] = useState<AppState>(dataService.getState());
  const [user, setUser] = useState<User>(dataService.getCurrentUser());
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState(languageService.getLang());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    const handleLang = () => setLang(languageService.getLang());
    window.addEventListener('languageChange', handleLang);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('languageChange', handleLang);
    };
  }, []);

  const t = (key: string) => languageService.get(key, lang);
  const isAdmin = user.role === 'admin';
  const today = new Date().toISOString().split('T')[0];
  const totalSalesToday = state.transactions
    .filter(t => t.type === 'sale' && t.date.startsWith(today))
    .reduce((acc, curr) => acc + curr.total, 0);

  const lowStockCount = state.products.filter(p => p.stock <= p.minStock).length;
  const favoriteProducts = state.products.filter(p => user.favorites.includes(p.id));

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('greeting_morning');
    if (hour < 18) return t('greeting_afternoon');
    return t('greeting_night');
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-8 space-y-6">
          <div className="h-16 w-1/2 bg-white/10 animate-shimmer rounded-2xl opacity-20"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-40 animate-shimmer rounded-[3rem] opacity-10"></div>
            <div className="h-40 animate-shimmer rounded-[3rem] opacity-10"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <header className="py-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6 mb-6">
        <div className="text-center md:text-left space-y-1">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white leading-none">
            {isAdmin ? 'Gestão' : t('welcome') + ', ' + user.name.split(' ')[0]}
          </h1>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">{getTimeGreeting()}!</p>
        </div>
        <button
          onClick={() => setIsEditingProfile(true)}
          className="w-20 h-20 rounded-[2rem] overflow-hidden border-4 border-white/10 shadow-2xl hover-float transition-all group"
        >
          <img className="w-full h-full object-cover group-hover:scale-110 transition-transform" src={user.avatar} alt="Profile" />
        </button>
      </header>

      <main className="space-y-10">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div onClick={() => navigate(isAdmin ? '/financas' : '/pdv')} className="bg-white p-8 rounded-[3rem] shadow-xl tap-active hover-float flex flex-col justify-between h-44">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{isAdmin ? 'Faturamento' : t('balance')}</p>
            <p className="text-4xl font-black text-black tracking-tighter">R$ {(isAdmin ? totalSalesToday : user.balance).toFixed(2)}</p>
          </div>
          <div onClick={() => navigate(isAdmin ? '/estoque' : '/meus-pedidos')} className="bg-white p-8 rounded-[3rem] shadow-xl tap-active hover-float flex flex-col justify-between h-44">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{isAdmin ? 'Alertas' : t('history')}</p>
            <p className={`text-4xl font-black tracking-tighter ${isAdmin && lowStockCount > 0 ? 'text-red-500 animate-pulse' : 'text-slate-900'}`}>
              {isAdmin ? lowStockCount : state.transactions.filter(t => t.userId === user.id).length}
              <span className="text-sm font-bold ml-2 opacity-30 uppercase">{isAdmin ? 'Estoque' : 'Pedidos'}</span>
            </p>
          </div>
        </section>

        {/* Seção de Favoritos */}
        {!isAdmin && favoriteProducts.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-2">Seus Favoritos</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2 px-1">
              {favoriteProducts.map(p => (
                <div
                  key={p.id}
                  onClick={() => navigate('/pdv')}
                  className="w-40 flex-shrink-0 bg-white p-4 rounded-[2.2rem] shadow-lg border border-white hover-float tap-active"
                >
                  <div className="w-full aspect-square bg-slate-50 rounded-2xl mb-3 overflow-hidden">
                    <img src={p.image} className="w-full h-full object-cover" alt={p.name} />
                  </div>
                  <h3 className="font-black text-[11px] text-black leading-tight line-clamp-1">{p.name}</h3>
                  <p className="text-[9px] font-bold text-primary mt-1">R$ {p.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <button
          onClick={() => navigate('/pdv')}
          className="w-full bg-primary p-10 rounded-[3.5rem] shadow-2xl flex items-center justify-between group tap-active hover-float transition-all border-4 border-white/20"
        >
          <div className="flex items-center gap-6 text-black">
            <div className="w-16 h-16 bg-white/50 rounded-2xl flex items-center justify-center">
              <span className="material-icons-round text-3xl font-bold">restaurant_menu</span>
            </div>
            <div className="text-left">
              <p className="font-black text-2xl leading-none tracking-tighter">{t('menu')}</p>
              <p className="text-[9px] font-bold opacity-60 uppercase tracking-widest mt-1">Cantina Fácil • Pedir agora</p>
            </div>
          </div>
          <span className="material-icons-round text-4xl text-black group-hover:translate-x-3 transition-transform">arrow_forward</span>
        </button>
      </main>

      {isEditingProfile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsEditingProfile(false)}></div>
          <div className="relative w-full max-w-sm bg-white rounded-[3.5rem] p-10 shadow-2xl animate-fade-in">
            <h3 className="text-2xl font-black mb-6 tracking-tighter text-black text-center">Editar Nome</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const nameInput = (e.target as any).userName.value;
              if (nameInput) { dataService.updateCurrentUser(nameInput); setUser(dataService.getCurrentUser()); setIsEditingProfile(false); }
            }} className="space-y-6">
              <input name="userName" type="text" defaultValue={user.name} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-center text-xl font-black text-black focus:ring-4 focus:ring-primary shadow-inner" />
              <div className="grid grid-cols-2 gap-4">
                <button type="button" onClick={() => setIsEditingProfile(false)} className="py-4 bg-slate-100 rounded-xl font-black text-[10px] uppercase text-slate-500">Voltar</button>
                <button type="submit" className="py-4 bg-primary rounded-xl font-black text-[10px] uppercase text-black shadow-lg shadow-primary/20">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
