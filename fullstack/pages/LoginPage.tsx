
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { dataService } from '../services/dataService';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const success = dataService.login(username, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Dados de acesso incorretos.');
      }
    } else {
      if (username && password.length >= 4 && name) {
        dataService.register(name, username, password);
        navigate('/dashboard');
      } else {
        setError('Preencha os campos com atenção.');
      }
    }
  };

  return (
    <div className="min-h-screen relative font-display flex flex-col items-center justify-center px-6 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1920" 
          className="w-full h-full object-cover scale-110 blur-[1px]"
          alt="Background"
        />
        <div className="absolute inset-0 bg-black/85 backdrop-blur-[1px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in py-10">
        <div className="text-center mb-10 space-y-4">
          <div className="w-24 h-24 bg-primary rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl rotate-2 ring-8 ring-primary/10 transition-all">
            <span className="material-icons-round text-slate-900 text-5xl font-bold">storefront</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter drop-shadow-2xl">Cantina Fácil</h1>
          <div className="inline-block bg-primary/20 backdrop-blur px-5 py-1 rounded-full border border-primary/10">
            <p className="text-primary font-black text-[10px] uppercase tracking-[0.4em]">Gestão Inteligente</p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[3.5rem] shadow-2xl border border-white/10 space-y-6">
          <div className="flex bg-black/30 p-1.5 rounded-[1.8rem] border border-white/5">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3.5 px-4 rounded-[1.2rem] font-black text-[10px] uppercase tracking-widest transition-all ${isLogin ? 'bg-primary text-black shadow-xl' : 'text-slate-500'}`}
            >
              Entrar
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3.5 px-4 rounded-[1.2rem] font-black text-[10px] uppercase tracking-widest transition-all ${!isLogin ? 'bg-primary text-black shadow-xl' : 'text-slate-500'}`}
            >
              Registro
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-white/50 tracking-widest px-4">Nome Completo</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: João Silva" className="w-full bg-white border-none rounded-2xl p-5 text-black font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-primary/40 transition-all shadow-inner text-base" required />
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-white/50 tracking-widest px-4">Usuário</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="cliente ou adm" className="w-full bg-white border-none rounded-2xl p-5 text-black font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-primary/40 transition-all shadow-inner text-base" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-white/50 tracking-widest px-4">Senha</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="1234" className="w-full bg-white border-none rounded-2xl p-5 text-black font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-primary/40 transition-all shadow-inner text-base" required />
            </div>

            {error && <p className="text-red-400 text-[10px] font-black uppercase text-center bg-red-900/40 py-3 rounded-xl border border-red-500/30">{error}</p>}

            <button type="submit" className="w-full bg-primary text-black py-5 rounded-[1.8rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 tap-active hover:scale-[1.02] transition-all mt-4">
              {isLogin ? 'Entrar no Sistema' : 'Concluir Registro'}
            </button>
          </form>
        </div>

        <footer className="mt-12 space-y-8 text-center">
          <div className="flex items-center justify-center gap-6">
            <Link to="/privacidade" className="bg-white px-6 py-3 rounded-2xl text-[9px] font-black text-black uppercase tracking-widest shadow-xl">Política de Privacidade</Link>
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <Link to="/contato" className="bg-white px-6 py-3 rounded-2xl text-[9px] font-black text-black uppercase tracking-widest shadow-xl">Fale Comigo</Link>
          </div>
          <div className="bg-white/5 backdrop-blur-md py-6 rounded-[2.5rem] mx-4 space-y-1 border border-white/5 shadow-2xl">
            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Powered by</p>
            <p className="text-xl font-black text-primary tracking-tighter drop-shadow-lg">LB Conexão</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;
