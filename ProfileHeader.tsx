import React from 'react';

interface ProfileHeaderProps {
  user: any;
}

const parseDateOnly = (value: unknown): Date | null => {
  if (!value) return null;
  const raw = String(value).trim();
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]) - 1;
    const day = Number(match[3]);
    const localDate = new Date(year, month, day);
    if (!Number.isNaN(localDate.getTime())) return localDate;
  }

  const fallback = new Date(raw);
  if (Number.isNaN(fallback.getTime())) return null;
  return fallback;
};

const getDaysUntilBirthday = (birthDateValue: unknown): number | null => {
  const birthDate = parseDateOnly(birthDateValue);
  if (!birthDate) return null;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());

  if (nextBirthday < today) {
    nextBirthday = new Date(today.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
  }

  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((nextBirthday.getTime() - today.getTime()) / msPerDay);
};

const normalizeStatus = (value: unknown): string => String(value || '').trim().toUpperCase();

const isGoodStatus = (value: unknown): boolean => {
  const normalized = normalizeStatus(value);
  return normalized === 'APTO' || normalized === 'EM DIA' || normalized === 'ATIVO';
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  if (!user) return null;

  const daysUntilBirthday = getDaysUntilBirthday(user.data_nasc);
  const showBirthAlert = daysUntilBirthday !== null && daysUntilBirthday >= 0 && daysUntilBirthday <= 15;

  const ultimoAcessoStr = user.ultimo_acesso
    ? new Date(user.ultimo_acesso).toLocaleString('pt-BR', {
        timeZone: 'America/Boa_Vista',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    : 'Primeiro acesso';

  const isCondutor = String(user.profissao || '').toUpperCase().includes('CONDUTOR');
  const docStatus = isCondutor ? user.habilitacao_status : user.conselho_status;
  const docLabel = isCondutor ? 'CNH' : 'CONSELHO';
  const statusOK = isGoodStatus(docStatus);

  const infoItems: Array<{ label: string; value: string; tone?: 'ok' | 'danger' }> = [
    { label: 'Matrícula', value: String(user.matricula || '-') },
    { label: 'CPF', value: String(user.cpf || '-') },
    { label: 'VTR padrão', value: String(user.vtr_padrao || '-') },
    { label: 'Vínculo', value: String(user.vinculo || '-') },
    { label: 'Turno', value: String(user.turno || '-') },
    { label: 'Bota', value: String(user.bota || '-') },
    { label: 'Camisa', value: String(user.camisa || '-') },
    { label: 'Macacão', value: String(user.macacao || '-') }
  ];

  if (isCondutor) {
    infoItems.push(
      { label: 'Nº habilitação', value: String(user.n_habilitacao || '-') },
      { label: 'Status CNH', value: String(user.habilitacao_status || 'NÃO INFORMADO'), tone: isGoodStatus(user.habilitacao_status) ? 'ok' : 'danger' },
      { label: 'Status toxicológico', value: String(user.tox_status || 'NÃO INFORMADO'), tone: isGoodStatus(user.tox_status) ? 'ok' : 'danger' }
    );
  } else {
    infoItems.push(
      { label: 'Nº conselho', value: String(user.n_conselho || '-') },
      { label: 'Status conselho', value: String(user.conselho_status || 'NÃO INFORMADO'), tone: isGoodStatus(user.conselho_status) ? 'ok' : 'danger' }
    );
  }

  return (
    <div className="relative z-10 px-6 md:px-10 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="glass-card p-5 md:p-6 rounded-[2.5rem] border-lb-navy/10">
        <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-lb-navy to-lb-navy/80 flex items-center justify-center text-white shadow-xl">
              <span className="material-symbols-outlined text-3xl">person</span>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-lb-navy dark:text-white uppercase tracking-tight">
                OLÁ, {String(user.nome || '').split(' ')[0]}!
              </h2>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="text-[10px] font-black bg-lb-navy/10 text-lb-navy dark:bg-white/10 dark:text-cyan-400 px-2 py-0.5 rounded uppercase tracking-widest">
                  {user.profissao}
                </span>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-300 uppercase tracking-widest flex items-center">
                  <span className="material-symbols-outlined text-[12px] mr-1">history</span>
                  Último acesso: {ultimoAcessoStr}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="flex items-center bg-slate-50 dark:bg-white/5 px-4 py-2 rounded-xl border border-slate-100 dark:border-white/10">
              <div className="mr-3">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Status {docLabel}</p>
                <p className={`text-[11px] font-black uppercase ${statusOK ? 'text-green-500' : 'text-red-500'}`}>
                  {String(docStatus || 'NÃO INFORMADO')}
                </p>
              </div>
              <span className={`material-symbols-outlined ${statusOK ? 'text-green-500' : 'text-red-500'}`}>
                {statusOK ? 'verified' : 'warning'}
              </span>
            </div>

            {showBirthAlert && (
              <div className="flex items-center bg-pink-50 dark:bg-pink-500/10 px-4 py-2 rounded-xl border border-pink-100 dark:border-pink-500/20 animate-pulse">
                <span className="material-symbols-outlined text-pink-500 mr-2">cake</span>
                <p className="text-[11px] font-black text-pink-600 dark:text-pink-400 uppercase tracking-tight">
                  {daysUntilBirthday === 0 ? 'Feliz aniversário!' : 'Seu aniversário está chegando!'}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {infoItems.map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-2.5 py-1.5">
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">{item.label}</p>
                <p className={`text-[10px] font-black uppercase ${item.tone === 'ok' ? 'text-emerald-600' : item.tone === 'danger' ? 'text-red-600' : 'text-lb-navy dark:text-slate-100'}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;














