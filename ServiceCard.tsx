
import React from 'react';
import { ServiceItem } from '../types';

interface ServiceCardProps {
  item: ServiceItem;
  onOpenLogin?: (perfil: string) => void;
}

const PORTAL_SESSION_KEY = 'samu-user-session';

const toBase64Url = (value: string): string => {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

const isChecklistHref = (href: string): boolean => {
  if (!href || href === '#') return false;
  try {
    const url = new URL(href, window.location.origin);
    return (url.hostname === 'localhost' || url.hostname === '127.0.0.1') && url.port === '8080';
  } catch {
    return false;
  }
};

const buildChecklistHref = (href: string): string => {
  if (!import.meta.env.DEV || !isChecklistHref(href)) return href;

  const rawSession = sessionStorage.getItem(PORTAL_SESSION_KEY);
  if (!rawSession) return href;

  try {
    const parsed = JSON.parse(rawSession) as Record<string, unknown>;
    if (!parsed || typeof parsed !== 'object') return href;

    const payload = {
      nome: parsed.nome,
      profissao: parsed.profissao,
      matricula: parsed.matricula,
      cpf: parsed.cpf,
      codigo_servidor: parsed.codigo_servidor,
      vtr_padrao: parsed.vtr_padrao,
      vtr: parsed.vtr,
      status: parsed.status,
    };

    if (!payload.nome || !payload.profissao) return href;

    const url = new URL(href, window.location.origin);
    url.searchParams.set('bridge', toBase64Url(JSON.stringify(payload)));
    return url.toString();
  } catch {
    return href;
  }
};

const ServiceCard: React.FC<ServiceCardProps> = ({ item, onOpenLogin }) => {
  const hasMultipleLinks = Array.isArray(item.links) && item.links.length > 0;

  const handleClick = (e: React.MouseEvent) => {
    if (hasMultipleLinks) return;
    if (item.href === '#') {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('samu-under-construction', {
        detail: 'Este módulo ainda está em construção. Algumas funcionalidades estão em desenvolvimento e serão liberadas em breve.'
      }));
      return;
    }
    if (item.category === 'assistencial' && onOpenLogin) {
      e.preventDefault();
      onOpenLogin(item.title);
    }
  };

  const cardBody = (
    <>
      <div className="mb-8">
        <div className="relative w-[64px] h-[64px] rounded-2xl flex items-center justify-center transition-all duration-500 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 group-hover:bg-lb-navy/10 group-hover:border-lb-navy">
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_center,rgba(27,54,93,0.2)_0%,transparent_70%)]"></div>
          <span className="material-symbols-outlined text-3xl dark:text-white text-lb-navy group-hover:text-cyan-500 transition-colors">
            {item.icon}
          </span>
        </div>
      </div>
      <h5 className="text-2xl font-extrabold dark:text-white text-lb-navy mb-3">{item.title}</h5>
      <p className="text-base dark:text-slate-300 text-slate-700 font-medium leading-relaxed mb-6 flex-grow">
        {item.description}
      </p>

      {hasMultipleLinks ? (
        <div className="mt-auto space-y-2">
          {item.links!.map((link) => (
            <a
              key={`${item.id}-${link.label}`}
              href={buildChecklistHref(link.href)}
              target="_blank"
              rel="noreferrer"
              className="block rounded-xl border border-lb-navy/20 bg-white/70 dark:bg-white/5 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-lb-navy dark:text-cyan-300 hover:border-lb-navy hover:bg-lb-navy/10 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      ) : (
        <div className="opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all flex items-center text-[10px] font-bold text-lb-navy dark:text-cyan-400 uppercase tracking-widest mt-auto">
          <span>Abrir Painel</span>
          <span className="material-symbols-outlined ml-2 text-sm">arrow_forward</span>
        </div>
      )}
    </>
  );

  if (hasMultipleLinks) {
    return (
      <article
        id={item.id}
        className="glass-card group relative p-8 rounded-3xl overflow-hidden flex flex-col h-full"
      >
        {cardBody}
      </article>
    );
  }

  return (
    <a
      href={buildChecklistHref(item.href)}
      id={item.id}
      onClick={handleClick}
      target={item.category === 'sublink' && item.href.startsWith('http') ? '_blank' : undefined}
      rel={item.category === 'sublink' && item.href.startsWith('http') ? 'noreferrer' : undefined}
      className="glass-card group relative p-8 rounded-3xl overflow-hidden flex flex-col h-full cursor-pointer"
    >
      {cardBody}
    </a>
  );
};

export default ServiceCard;

