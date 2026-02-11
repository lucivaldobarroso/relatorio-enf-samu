
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { dataService } from '../services/dataService';

const ContractPage: React.FC = () => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [signature, setSignature] = useState('');
  // Fix: replaced state.currentUser with dataService.getCurrentUser()
  const user = dataService.getCurrentUser();

  const isSigned = user.hasActiveContract;
  const isSignatureValid = signature.trim().length >= 3;

  const handleSign = () => {
    if (!agreed || !isSignatureValid) return;
    // Fix: method signContract now exists in dataService
    dataService.signContract(signature);
    navigate('/dashboard');
  };

  return (
    <Layout hideNav={!isSigned}>
      <header className="px-6 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
        <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <span className="material-icons-round">dashboard</span>
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-none">
            {isSigned ? 'Visualizar Contrato' : 'Contrato de Serviço'}
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Plano Quinzenal</p>
        </div>
      </header>

      <main className="px-6 py-8 space-y-6 overflow-y-auto max-h-[75vh] scrollbar-hide pb-24">
        {isSigned && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex items-center gap-3">
            <span className="material-icons-round text-emerald-500">verified</span>
            <div>
              <p className="text-sm font-bold text-emerald-600">CONTRATO ATIVO</p>
              <p className="text-[10px] text-emerald-500 font-medium">Assinado em {new Date(user.contractSignedAt!).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm leading-relaxed text-sm text-slate-700 dark:text-slate-300 space-y-4">
          <div className="flex justify-between items-start">
            <h2 className="font-black text-slate-900 dark:text-white uppercase italic">TERMOS E CONDIÇÕES</h2>
            <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-[10px] font-bold">V 1.2</span>
          </div>
          
          <p>
            Eu, <strong>{user.name}</strong>, portador da conta ID <strong>{user.id}</strong>, concordo livremente em aderir ao <strong>Plano Quinzenal da Cantina Fácil</strong> sob as seguintes cláusulas:
          </p>
          
          <h3 className="font-bold text-slate-900 dark:text-white uppercase text-xs">1. Vigência e Renovação</h3>
          <p>
            Este contrato tem validade de <strong>6 (seis) meses</strong> (Expira em: {new Date(user.contractExpiresAt || Date.now() + 15552000000).toLocaleDateString('pt-BR')}). A renovação ocorre mediante interesse mútuo.
          </p>

          <h3 className="font-bold text-slate-900 dark:text-white uppercase text-xs">2. Pagamentos Quinzenais</h3>
          <p>
            O fechamento da fatura ocorre a cada 15 dias corridos. O contratante terá 48 horas úteis para efetuar o pagamento via PIX, Dinheiro ou Cartão.
          </p>

          <h3 className="font-bold text-slate-900 dark:text-white uppercase text-xs">3. Bloqueio de Crédito</h3>
          <p>
            Atrasos superiores a 5 dias resultarão no bloqueio automático da modalidade no PDV até a regularização.
          </p>

          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-4">
            {isSigned ? (
              <div className="text-center py-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Assinatura Digital Confirmada</p>
                <div className="inline-block px-12 py-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-black/20 italic font-serif text-2xl text-slate-500">
                  {user.name}
                </div>
                <p className="text-[10px] mt-4 text-slate-400">Documento autenticado eletronicamente via ID {user.id.substr(0,8)}</p>
              </div>
            ) : (
              <>
                <p className="text-xs text-center font-bold text-slate-400 uppercase tracking-widest">Assine digitando seu nome completo abaixo:</p>
                <div className="relative group">
                  <input 
                    type="text"
                    placeholder="Nome Completo para Assinatura"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-black/20 border-b-2 border-slate-200 dark:border-slate-700 focus:border-primary px-4 py-4 text-xl text-center italic font-serif outline-none transition-all placeholder:not-italic placeholder:font-sans placeholder:text-sm"
                  />
                  <div className="absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300" style={{ width: isSignatureValid ? '100%' : '0%' }} />
                </div>
                <p className="text-[10px] text-center text-slate-400">Ao digitar seu nome, você confirma a validade jurídica desta assinatura digital.</p>
              </>
            )}
          </div>
        </div>

        {!isSigned && (
          <label className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={agreed} 
              onChange={(e) => setAgreed(e.target.checked)}
              className="rounded border-slate-300 text-primary focus:ring-primary h-6 w-6 transition-transform group-active:scale-90"
            />
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
              Confirmo que as informações acima são verdadeiras.
            </span>
          </label>
        )}
      </main>

      {!isSigned && (
        <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 z-50">
          <button 
            onClick={handleSign}
            disabled={!agreed || !isSignatureValid}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${agreed && isSignatureValid ? 'bg-primary text-slate-900 shadow-primary/30' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          >
            <span className="material-icons-round">draw</span>
            Finalizar e Salvar Assinatura
          </button>
        </footer>
      )}
    </Layout>
  );
};

export default ContractPage;
