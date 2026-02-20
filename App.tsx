
import React, { useState, useEffect, useCallback } from 'react';
import { Theme, ViewType } from './types';
import { OPERATIONAL_SERVICES, ADMIN_SERVICES, BACKGROUND_URL, DEVELOPER_LOGO_URL, SUB_PAGES_CONTENT } from './constants';
import Navbar from './components/Navbar';
import Ticker from './components/Ticker';
import ServiceCard from './components/ServiceCard';
import AdminCard from './components/AdminCard';
import Footer from './components/Footer';
import FichaUsaForm from './components/FichaUsaForm';
import LoginModal from './components/LoginModal';
import ProfileHeader from './components/ProfileHeader';
import BirthdayModal from './components/BirthdayModal';
import AdminDashboard from './components/AdminDashboard';
import DocumentAlerts from './components/DocumentAlerts';
import UpcomingCelebrationsCard from './components/UpcomingCelebrationsCard';
import DocumentHub from './components/DocumentHub';

const normalizeText = (value: string): string => {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
};
const normalizeCompare = (value: string): string => normalizeText(value).replace(/[^A-Z0-9]/g, '');

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

const isBirthdayToday = (birthDateValue: unknown): boolean => {
  const birthDate = parseDateOnly(birthDateValue);
  if (!birthDate) return false;

  const today = new Date();
  return today.getDate() === birthDate.getDate() && today.getMonth() === birthDate.getMonth();
};

const isSameMonthDay = (dateValue: unknown, today = new Date()): boolean => {
  const date = parseDateOnly(dateValue);
  if (!date) return false;
  return date.getDate() === today.getDate() && date.getMonth() === today.getMonth();
};

const calculateYearsFromDate = (dateValue: unknown, today = new Date()): number | null => {
  const date = parseDateOnly(dateValue);
  if (!date) return null;
  let years = today.getFullYear() - date.getFullYear();
  const hasNotReachedAnniversary =
    today.getMonth() < date.getMonth() ||
    (today.getMonth() === date.getMonth() && today.getDate() < date.getDate());
  if (hasNotReachedAnniversary) years -= 1;
  return years >= 0 ? years : null;
};

type CelebrationItem = {
  id: 'birthday' | 'admission';
  icon: string;
  title: string;
  message: string;
};

const buildCelebrations = (currentUser: any): CelebrationItem[] => {
  if (!currentUser) return [];
  const firstName = String(currentUser?.nome || 'Servidor').split(' ')[0];
  const today = new Date();
  const celebrations: CelebrationItem[] = [];

  if (isSameMonthDay(currentUser?.data_nasc, today)) {
    const years = calculateYearsFromDate(currentUser?.data_nasc, today) ?? 0;
    celebrations.push({
      id: 'birthday',
      icon: 'cake',
      title: 'Feliz aniversário!',
      message: `Parabéns pelos seus ${years} anos de vida, ${firstName}!`
    });
  }

  if (isSameMonthDay(currentUser?.adimissao, today)) {
    const years = calculateYearsFromDate(currentUser?.adimissao, today) ?? 0;
    celebrations.push({
      id: 'admission',
      icon: 'military_tech',
      title: 'Celebração de dedicação',
      message: `Parabéns pelos seus ${years} anos dedicados ao SAMU, ${firstName}!`
    });
  }

  return celebrations;
};

const ROUTE_ROLE_MAP: Record<'enfermeiro' | 'medico' | 'tecnico' | 'condutor', string[]> = {
  enfermeiro: ['ENFERMEIRO'],
  medico: ['MEDICO'],
  tecnico: ['TECNICO'],
  condutor: ['CONDUTOR']
};

const matchProfessionByRoute = (route: ViewType, profession: string): boolean => {
  const prof = normalizeCompare(String(profession || ''));
  if (route === 'enfermeiro') return prof.includes('ENFERMEIRO');
  if (route === 'medico') return prof.includes('MEDICO');
  if (route === 'condutor') return prof.includes('CONDUTOR');
  if (route === 'tecnico') {
    return (
      prof.includes('TECNICO') ||
      prof.includes('TECDEENFERMAGEM') ||
      prof.includes('TECENFERMAGEM')
    );
  }
  return false;
};

const ROUTE_LOGIN_LABEL_MAP: Record<'enfermeiro' | 'medico' | 'tecnico' | 'condutor' | 'admin', string> = {
  enfermeiro: 'Enfermeiro',
  medico: 'Médico',
  tecnico: 'Técnico de Enfermagem',
  condutor: 'Condutor',
  admin: 'ACESSO RESTRITO'
};

const hasAccessToRoute = (route: ViewType, currentUser: any): boolean => {
  if (route === 'home') return true;
  if (!currentUser) return false;

  const normalizedProfession = normalizeText(String(currentUser.profissao || ''));
  const isCoordinator = normalizedProfession.includes('COORDENADOR');
  const accessMode = normalizeText(String(currentUser?.access_mode || 'ASSISTENCIAL'));

  if (route === 'admin') return isCoordinator && accessMode === 'GESTAO';
  if (isCoordinator && accessMode === 'GESTAO') return true;

  const routeRoles = ROUTE_ROLE_MAP[route as keyof typeof ROUTE_ROLE_MAP];
  if (!routeRoles) return false;

  if (matchProfessionByRoute(route, String(currentUser.profissao || ''))) return true;
  return routeRoles.some(role => normalizedProfession.includes(role));
};

const isCoordinatorUser = (currentUser: any): boolean => {
  if (!currentUser) return false;
  const normalizedProfession = normalizeText(String(currentUser.profissao || ''));
  return normalizedProfession.includes('COORDENADOR');
};

const PORTAL_SESSION_KEY = 'samu-user-session';
const CHECKLIST_SESSION_BRIDGE_KEY = 'samu-user-session-bridge';
const BRIDGE_MAX_AGE_MS = 12 * 60 * 60 * 1000;

type SessionBridgePayload = {
  user?: any;
  updatedAt?: number;
};

const readBridgeUser = (): any | null => {
  try {
    const raw = localStorage.getItem(CHECKLIST_SESSION_BRIDGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SessionBridgePayload | any;
    if (!parsed || typeof parsed !== 'object') return null;
    if ('user' in (parsed as SessionBridgePayload)) {
      const payload = parsed as SessionBridgePayload;
      if (!payload.user) return null;
      const age = Date.now() - Number(payload.updatedAt || 0);
      if (!Number.isFinite(age) || age < 0 || age > BRIDGE_MAX_AGE_MS) return null;
      return payload.user;
    }
    return parsed;
  } catch {
    return null;
  }
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [subView, setSubView] = useState<string | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginProfile, setLoginProfile] = useState('');
  const [user, setUser] = useState<any>(null);
  const [isBirthdayOpen, setIsBirthdayOpen] = useState(false);
  const [celebrations, setCelebrations] = useState<CelebrationItem[]>([]);
  const [sessionNotice, setSessionNotice] = useState('');

  useEffect(() => {
    try {
      const cachedUser = sessionStorage.getItem(PORTAL_SESSION_KEY);
      if (cachedUser) {
        setUser(JSON.parse(cachedUser));
      } else {
        const bridged = readBridgeUser();
        if (bridged) {
          setUser(bridged);
          sessionStorage.setItem(PORTAL_SESSION_KEY, JSON.stringify(bridged));
        }
      }
    } catch (err) {
      console.warn('Não foi possível restaurar sessão local.');
    }
  }, []);

  useEffect(() => {
    try {
      if (user) {
        sessionStorage.setItem(PORTAL_SESSION_KEY, JSON.stringify(user));
        localStorage.setItem(
          CHECKLIST_SESSION_BRIDGE_KEY,
          JSON.stringify({ user, updatedAt: Date.now() }),
        );
      } else {
        sessionStorage.removeItem(PORTAL_SESSION_KEY);
        localStorage.removeItem(CHECKLIST_SESSION_BRIDGE_KEY);
      }
    } catch (err) {
      console.warn('Não foi possível persistir sessão local.');
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const pendingCelebrations = buildCelebrations(user);
    setCelebrations(pendingCelebrations);
    if (pendingCelebrations.length === 0) {
      setIsBirthdayOpen(false);
      return;
    }

    const todayKey = new Date().toISOString().slice(0, 10);
    const celebrationHash = pendingCelebrations.map(c => c.id).sort().join('-');
    const modalKey = `celebration-modal-seen-${String(user?.matricula || user?.cpf || 'anon')}-${todayKey}-${celebrationHash}`;

    if (sessionStorage.getItem(modalKey) === '1') return;
    sessionStorage.setItem(modalKey, '1');
    setIsBirthdayOpen(true);
  }, [user]);

  // Escuta o evento de login bem-sucedido
  useEffect(() => {
    const handleLoginSuccess = (e: any) => {
      const userData = e.detail;
      setUser(userData);
    };

    window.addEventListener('samu-login-success', handleLoginSuccess);
    return () => window.removeEventListener('samu-login-success', handleLoginSuccess);
  }, []);

  useEffect(() => {
    const handleUnderConstruction = (e: any) => {
      const message = String(e?.detail || '').trim();
      setSessionNotice(message || 'Este módulo ainda está em construção. Algumas funcionalidades serão liberadas em breve.');
    };
    window.addEventListener('samu-under-construction', handleUnderConstruction as EventListener);
    return () => window.removeEventListener('samu-under-construction', handleUnderConstruction as EventListener);
  }, []);

  /**
   * Abre o Modal de Login com o perfil selecionado
   */
  const handleOpenLogin = useCallback((perfil: string) => {
    setLoginProfile(perfil);
    setIsLoginOpen(true);
  }, []);

  const handleRestrictedAccess = useCallback(() => {
    if (isCoordinatorUser(user)) {
      setUser((prev: any) => prev ? { ...prev, access_mode: 'gestao' } : prev);
      window.location.hash = '#admin';
      return;
    }
    handleOpenLogin('ACESSO RESTRITO');
  }, [user, handleOpenLogin]);

  /**
   * Logout do Sistema
   */
  const handleLogout = useCallback((reason?: string) => {
    setUser(null);
    setIsBirthdayOpen(false);
    setCelebrations([]);
    sessionStorage.removeItem(PORTAL_SESSION_KEY);
    localStorage.removeItem(CHECKLIST_SESSION_BRIDGE_KEY);
    if (reason) {
      setSessionNotice(reason);
    } else {
      setSessionNotice('');
    }
    window.location.hash = '#home';
  }, []);

  useEffect(() => {
    if (!sessionNotice) return;
    const timer = window.setTimeout(() => setSessionNotice(''), 6000);
    return () => window.clearTimeout(timer);
  }, [sessionNotice]);

  useEffect(() => {
    if (!user) return;
    const IDLE_LIMIT_MS = 10 * 60 * 1000;
    let timeoutId: number | null = null;

    const clearIdleTimer = () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };

    const scheduleIdleLogout = () => {
      clearIdleTimer();
      timeoutId = window.setTimeout(() => {
        handleLogout('Sessão encerrada por segurança após 10 minutos sem atividade.');
      }, IDLE_LIMIT_MS);
    };

    const onActivity = () => scheduleIdleLogout();
    const events: Array<keyof WindowEventMap> = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((eventName) => window.addEventListener(eventName, onActivity, { passive: true }));
    scheduleIdleLogout();

    return () => {
      clearIdleTimer();
      events.forEach((eventName) => window.removeEventListener(eventName, onActivity));
    };
  }, [user, handleLogout]);

  /**
   * Navegação Robusta Baseada em Hash
   * Detecta mudanças na URL e atualiza o estado global do portal
   */
  const handleRouting = useCallback(() => {
    const hash = window.location.hash || '#home';
    // Remove o #, limpa barras e converte para minúsculas para evitar erros de digitação
    const cleanPath = hash.replace(/^#\/?/, '').replace(/\/$/, '').toLowerCase();
    const segments = cleanPath.split('/');

    const mainPath = segments[0] as ViewType | 'documentos';
    const specificSub = segments[1] || null;

    const professionalRoutes: ViewType[] = ['enfermeiro', 'medico', 'tecnico', 'condutor', 'admin'];

    if (mainPath === 'documentos') {
      setCurrentView('home');
      setSubView(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.setTimeout(() => {
        document.getElementById('documentos')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
      return;
    }

    if (professionalRoutes.includes(mainPath)) {
      setCurrentView(mainPath);
      setSubView(specificSub);
      // Rola para o topo suavemente ao trocar de página
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentView('home');
      setSubView(null);
    }
  }, []);

  useEffect(() => {
    // Escuta tanto a mudança de hash quanto o botão voltar do navegador
    window.addEventListener('hashchange', handleRouting);
    window.addEventListener('popstate', handleRouting);

    // Executa na inicialização
    handleRouting();

    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      document.documentElement.classList.toggle('light', savedTheme === 'light');
    }

    return () => {
      window.removeEventListener('hashchange', handleRouting);
      window.removeEventListener('popstate', handleRouting);
    };
  }, [handleRouting]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const newTheme = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      document.documentElement.classList.toggle('light', newTheme === 'light');
      return newTheme;
    });
  }, []);

  const isSubPage = currentView !== 'home';
  const subPageData = isSubPage ? SUB_PAGES_CONTENT[currentView] : null;
  const canAccessCurrentView = hasAccessToRoute(currentView, user);
  const isUnauthorizedView = isSubPage && !canAccessCurrentView;
  const loginLabel = currentView === 'home'
    ? ROUTE_LOGIN_LABEL_MAP.admin
    : ROUTE_LOGIN_LABEL_MAP[currentView as keyof typeof ROUTE_LOGIN_LABEL_MAP];
  const routeDisplayName = currentView === 'admin'
    ? 'Admin'
    : ROUTE_LOGIN_LABEL_MAP[currentView as keyof typeof ROUTE_LOGIN_LABEL_MAP] || 'Profissional';

  // Filtros da Página Inicial
  const filteredOperational = OPERATIONAL_SERVICES.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAdmin = ADMIN_SERVICES.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-[100svh] transition-colors duration-500 ${theme === 'dark' ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
      <Ticker />

      {/* Camada de Fundo Estática - Identidade Visual Preservada */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          alt="Ambulance Background"
          className="w-full h-full object-cover"
          src={BACKGROUND_URL}
        />
        <div className="absolute inset-0 hero-overlay"></div>
      </div>

      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenLogin={handleRestrictedAccess}
        onLogout={() => handleLogout()}
        user={user}
      />

      {sessionNotice && (
        <div className="fixed top-20 right-5 z-[260] max-w-md rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800 shadow-xl">
          {sessionNotice}
        </div>
      )}

      {/* Cabeçalho de Perfil Logado */}
      {user && <ProfileHeader user={user} />}

      {/* Cabeçalho Unificado */}
      <header className="relative z-10 px-6 pt-4 pb-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <span className="inline-block mb-6 px-4 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em]">
              {isSubPage ? "Área Restrita Profissional" : "Portal de Excelência Operacional"}
            </span>

            <h2 className="text-4xl md:text-7xl font-extrabold dark:text-white text-lb-navy mb-8 tracking-tight leading-none">
              {isSubPage ? (
                subView ? (
                  <>Sistema de <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-lb-navy dark:from-red-400 dark:to-white">Fichas Digital</span></>
                ) : (
                  <>Portal do <span className="inline-block px-3 py-1 rounded-xl bg-white/60 dark:bg-white/10 text-lb-navy dark:text-white capitalize shadow-sm">{routeDisplayName}</span></>
                )
              ) : (
                <>Gestão <span className="text-transparent bg-clip-text bg-gradient-to-r from-lb-navy to-lb-grey dark:from-white dark:to-slate-500">Unificada</span></>
              )}
            </h2>

            <p className="dark:text-slate-200 text-slate-900 text-base md:text-xl max-w-2xl mx-auto mb-10 font-bold leading-relaxed">
              {isSubPage ? (
                subView ? "Lançamento eletrônico para prontuários de Suporte Avançado (USA)." : subPageData?.subtitle
              ) : (
                <>
                  Acesso unificado aos serviços administrativos do{' '}
                  <span className="dark:text-white text-lb-navy font-black text-xl md:text-2xl inline-block whitespace-nowrap">SAMU 192 Boa Vista</span>.
                  {' '}Tecnologia a serviço da vida.
                </>
              )}
            </p>
          </div>

          {!isSubPage ? (
            <div className="max-w-xl mx-auto relative group animate-in fade-in zoom-in-95 duration-700">
              <div className="absolute -inset-1 bg-gradient-to-r from-lb-navy to-lb-grey rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative dark:bg-slate-900 bg-white rounded-full border border-slate-300 dark:border-white/10 overflow-hidden flex items-center shadow-md">
                <span className="material-symbols-outlined ml-6 text-slate-500 font-bold">search</span>
                <input
                  className="bg-transparent border-none focus:ring-0 dark:text-white text-lb-navy w-full py-5 px-4 text-sm font-bold placeholder:text-slate-400"
                  placeholder="Pesquisar sistemas, profissionais ou escalas..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="flex justify-center animate-in fade-in slide-in-from-bottom-2 duration-300">
              <a
                href={subView ? `#${currentView}` : "#"}
                className="group inline-flex items-center space-x-3 px-8 py-4 rounded-2xl bg-lb-navy/10 dark:bg-white/5 border border-lb-navy/20 dark:border-white/10 text-lb-navy dark:text-white font-black uppercase tracking-widest text-[10px] hover:bg-lb-navy dark:hover:bg-cyan-500 hover:text-white transition-all duration-300 shadow-xl"
              >
                <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
                <span>{subView ? "Voltar ao Painel" : "Retornar ao Início"}</span>
              </a>
            </div>
          )}
        </div>
      </header>

      {/* Conteúdo Principal com ID dinâmico para garantir re-render */}
      <main key={`${currentView}-${subView}`} className="relative z-20 max-w-7xl mx-auto px-6 pb-24">
        {!isSubPage ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Home - Serviços Operacionais */}
            <section className="mb-14" id="celebracoes">
              <UpcomingCelebrationsCard />
            </section>

            <section className="mb-24" id="assistenciais">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="material-symbols-outlined text-cyan-600 dark:text-cyan-400 font-bold">medical_services</span>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">Operacional</h3>
                  </div>
                  <h4 className="text-3xl md:text-4xl font-bold dark:text-white text-lb-navy">Serviços Assistenciais</h4>
                </div>
                <div className="hidden md:block h-[2px] flex-1 mx-10 bg-gradient-to-r from-lb-navy/20 to-transparent"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredOperational.map(item => (
                  <ServiceCard key={item.id} item={item} onOpenLogin={handleOpenLogin} />
                ))}
              </div>
            </section>

            {/* Home - Área Administrativa */}
            <section className="mb-24" id="administrativo">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="material-symbols-outlined text-gold font-bold">corporate_fare</span>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gold">Administrativo</h3>
                  </div>
                  <h4 className="text-3xl md:text-4xl font-bold dark:text-white text-lb-navy">Área Administrativa</h4>
                </div>
                <div className="hidden md:block h-[2px] flex-1 mx-10 bg-gradient-to-r from-gold/30 to-transparent"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredAdmin.map(item => (
                  <AdminCard key={item.id} item={item} />
                ))}
              </div>
            </section>

            <DocumentHub />
          </div>
        ) : isUnauthorizedView ? (
          <section className="mb-24 animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="max-w-2xl mx-auto glass-card p-10 rounded-[2rem] border border-red-200/50 dark:border-red-500/30 text-center">
              <span className="material-symbols-outlined text-red-500 text-5xl mb-4">lock</span>
              <h4 className="text-2xl font-black text-lb-navy dark:text-white uppercase tracking-tight mb-3">Acesso Restrito</h4>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-8">
                Faça login com o perfil correto para acessar esta área.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => handleOpenLogin(loginLabel)}
                  className="px-6 py-3 rounded-xl bg-lb-navy text-white text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
                >
                  Entrar com Perfil
                </button>
                <a
                  href="#home"
                  className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest"
                >
                  Voltar ao Início
                </a>
              </div>
            </div>
          </section>
        ) : currentView === 'admin' ? (
          <AdminDashboard user={user} />
        ) : subView === 'ficha-usa' ? (
          /* Renderiza o Formulário da Página de Enfermeiro */
          <FichaUsaForm onBack={() => window.location.hash = `#${currentView}`} />
        ) : (
          /* Painel Interno do Profissional */
          <section className="mb-24 animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="flex items-end justify-between mb-12">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="material-symbols-outlined text-cyan-600 dark:text-cyan-400 font-bold">verified</span>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">Painel de Controle</h3>
                </div>
                <h4 className="text-3xl md:text-4xl font-bold dark:text-white text-lb-navy capitalize">Serviços do {currentView}</h4>
              </div>
              <div className="hidden md:block h-[2px] flex-1 mx-10 bg-gradient-to-r from-cyan-600/30 to-transparent"></div>
            </div>

            <DocumentAlerts user={user} />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {subPageData?.items.map(item => (
                <ServiceCard key={item.id} item={item} onOpenLogin={handleOpenLogin} />
              ))}
            </div>
          </section>
        )}

        {/* Branding e Créditos */}
        <section className="mt-20 mb-12 text-center">
          <div className="max-w-2xl mx-auto rounded-[2rem] border border-lb-navy/20 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md shadow-xl shadow-lb-navy/10 px-6 py-7 flex flex-col items-center">
            <p className="text-[12px] md:text-[13px] uppercase tracking-[0.28em] dark:text-slate-200 text-lb-navy font-black mb-2">Plataforma Desenvolvida por</p>
            <p className="text-base md:text-lg text-lb-navy dark:text-white font-extrabold mb-3">Lucivaldo Oliveira Barroso</p>
            <div className="flex flex-col items-center group cursor-default">
              <img
                alt="LB Conexão Dev Logo"
                className="h-16 md:h-20 w-auto mb-3 grayscale group-hover:grayscale-0 transition-all duration-700"
                src={DEVELOPER_LOGO_URL}
              />
              <p className="text-[12px] md:text-[14px] text-lb-navy dark:text-cyan-300 uppercase tracking-[0.16em] font-black">Tecnologia e Excelência em Saúde</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        perfil={loginProfile}
      />

      <BirthdayModal
        isOpen={isBirthdayOpen}
        onClose={() => setIsBirthdayOpen(false)}
        userName={user?.nome || ''}
        celebrations={celebrations}
      />
    </div>
  );
};


export default App;







