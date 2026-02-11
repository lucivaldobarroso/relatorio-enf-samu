
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout hideNav>
      <div className="min-h-screen bg-white text-black animate-fade-in">
        <header className="px-6 py-8 border-b border-slate-100 flex items-center gap-4 bg-white sticky top-0 z-20">
          <button onClick={() => navigate(-1)} className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center active:scale-90 transition-all">
            <span className="material-icons-round text-black">arrow_back</span>
          </button>
          <h1 className="text-2xl font-black tracking-tighter">Privacidade</h1>
        </header>

        <main className="px-6 py-10 space-y-10 pb-32 text-sm leading-relaxed max-w-2xl mx-auto">
          <section className="space-y-4">
            <h2 className="text-black font-black uppercase text-xs tracking-[0.2em] border-l-4 border-primary pl-3">1. Coleta de Dados</h2>
            <p className="font-medium text-slate-700">
              O Cantina Fácil opera sob o princípio de <strong>Privacidade por Design</strong>. Todos os dados inseridos, incluindo seu nome, avatar e histórico de compras, são armazenados exclusivamente no seu navegador (LocalStorage) do seu dispositivo pessoal.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-black font-black uppercase text-xs tracking-[0.2em] border-l-4 border-primary pl-3">2. Uso de IA Responsável</h2>
            <p className="font-medium text-slate-700">
              Utilizamos a API do Google Gemini para processar insights de estoque e financeiros. Os dados enviados para análise são anonimizados e referem-se apenas a quantidades e valores, garantindo que sua identidade permaneça protegida.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-black font-black uppercase text-xs tracking-[0.2em] border-l-4 border-primary pl-3">3. Seus Direitos e Controle</h2>
            <p className="font-medium text-slate-700">
              Como os dados são locais, você tem controle total. Ao clicar em "Sair" ou limpar o cache do navegador, todas as informações são permanentemente destruídas. Não possuímos bancos de dados externos com suas informações pessoais.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-black font-black uppercase text-xs tracking-[0.2em] border-l-4 border-primary pl-3">4. Cookies e Rastreamento</h2>
            <p className="font-medium text-slate-700">
              Não utilizamos cookies de terceiros para publicidade. Usamos apenas o armazenamento técnico necessário para que o sistema funcione corretamente enquanto você está logado.
            </p>
          </section>

          <div className="p-8 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Versão 2.5 • Última atualização: 2025
            </p>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default PrivacyPage;
