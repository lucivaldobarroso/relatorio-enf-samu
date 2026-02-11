import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { CONTACT_INFO } from '../constants';
import { languageService } from '../services/languageService';

const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState(languageService.getLang());

  useEffect(() => {
    const handleLang = () => setLang(languageService.getLang());
    window.addEventListener('languageChange', handleLang);
    return () => window.removeEventListener('languageChange', handleLang);
  }, []);

  const t = (key: string) => languageService.get(key, lang);

  const contacts = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      value: CONTACT_INFO.phone,
      icon: 'chat',
      color: 'bg-emerald-500',
      link: `https://wa.me/${CONTACT_INFO.whatsapp}`
    },
    {
      id: 'instagram',
      name: 'Instagram',
      value: CONTACT_INFO.instagram,
      icon: 'camera_alt',
      color: 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600',
      link: `https://instagram.com/${CONTACT_INFO.instagram.replace('@', '')}`
    },
    {
      id: 'phone',
      name: 'Telefone',
      value: CONTACT_INFO.phone,
      icon: 'call',
      color: 'bg-blue-500',
      link: `tel:${CONTACT_INFO.whatsapp}`
    },
    {
      id: 'email',
      name: 'E-mail',
      value: CONTACT_INFO.email,
      icon: 'alternate_email',
      color: 'bg-slate-800',
      link: `mailto:${CONTACT_INFO.email}`
    },
    {
      id: 'facebook',
      name: 'Facebook',
      value: CONTACT_INFO.facebook,
      icon: 'facebook',
      color: 'bg-blue-600',
      link: `https://facebook.com/${CONTACT_INFO.facebook}`
    }
  ];

  return (
    <Layout>
      <header className="px-6 py-8 flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-8">
          <button onClick={() => navigate(-1)} className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm">
            <span className="material-icons-round">arrow_back</span>
          </button>
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Atendimento</span>
          <div className="w-10"></div>
        </div>

        <div className="w-24 h-24 bg-primary rounded-4xl flex items-center justify-center shadow-2xl shadow-primary/30 mb-6 rotate-3">
          <span className="material-icons-round text-slate-900 text-5xl">support_agent</span>
        </div>
        <h1 className="text-3xl font-black tracking-tighter mb-2 text-center">Fale Comigo</h1>
        <p className="text-xs font-medium text-slate-400 text-center max-w-[250px]">
          Estamos prontos para te ajudar com pedidos, créditos ou sugestões.
        </p>
      </header>

      <main className="px-6 space-y-4 pb-24">
        {contacts.map((contact) => (
          <a
            key={contact.id}
            href={contact.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm active:scale-95 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${contact.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                <span className="material-icons-round">{contact.icon}</span>
              </div>
              <div>
                <p className="font-extrabold text-sm">{contact.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{contact.value}</p>
              </div>
            </div>
            <span className="material-icons-round text-slate-300 group-hover:text-primary transition-colors">open_in_new</span>
          </a>
        ))}

        <div className="mt-8 p-8 bg-slate-900 rounded-4xl text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 opacity-50"></div>
          <p className="relative z-10 text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Empresa</p>
          <h2 className="relative z-10 text-xl font-black mb-1">{CONTACT_INFO.company}</h2>
          <p className="relative z-10 text-[10px] font-bold text-slate-400">© 2025 - Gestão Inteligente de Cantinas</p>
        </div>
      </main>
    </Layout>
  );
};

export default ContactPage;
