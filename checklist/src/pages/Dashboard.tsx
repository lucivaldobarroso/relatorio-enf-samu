import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession, carregarItens, salvarChecklist, obterDashboardEstatistico } from '@/hooks/useSession';
import { normalizar } from '@/lib/utils';
import { ChecklistItem, TurnoKey } from '@/types/samu';
import { DashboardEstatisticoData, obterHistoricoRecente } from '@/services/samuService';
import { toast } from 'sonner';
import { Building2, Menu, PartyPopper } from 'lucide-react';
import Sidebar from '@/components/samu/Sidebar';
import ShiftBar from '@/components/samu/ShiftBar';
import ChecklistSection, { ChecklistPayload } from '@/components/samu/ChecklistSection';
import CMEPanel from '@/components/samu/CMEPanel';
import HistoryTable, { HistoryEntry } from '@/components/samu/HistoryTable';
import StatsDashboard from '@/components/samu/StatsDashboard';

type ViewMode = 'checklist' | 'cme' | 'stats' | 'none';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, initialized, logout, setTurno } = useSession();
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('SINCRONIZANDO ITENS...');
  const [bancoItens, setBancoItens] = useState<ChecklistItem[]>([]);
  const [secaoAtual, setSecaoAtual] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('none');
  const [bypassTrava, setBypassTrava] = useState(false);
  const [modoCME, setModoCME] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [historico, setHistorico] = useState<HistoryEntry[]>([]);
  const [statsData, setStatsData] = useState<DashboardEstatisticoData | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [periodoDias, setPeriodoDias] = useState(30);
  const [showParabens, setShowParabens] = useState(false);
  const [showSucesso, setShowSucesso] = useState(false);
  const [parabensExibido, setParabensExibido] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setLoadingText('SINCRONIZANDO ITENS...');
    try {
      const items = await carregarItens(user.vtr, user.turno || '');
      setBancoItens(items);
    } catch {
      toast.error('Falha na conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!initialized) {
      return;
    }
    if (!user) {
      navigate('/');
      return;
    }
    loadData();
  }, [initialized, user, navigate, loadData]);

  const secoes = [...new Set(bancoItens.map(i => i.secao))];

  const loadStats = useCallback(
    async (days: number) => {
      if (!user?.vtr) return;
      setStatsLoading(true);
      try {
        const data = await obterDashboardEstatistico(user.vtr, days);
        setStatsData(data);
      } catch {
        toast.error('Erro ao carregar painel estatístico.');
      } finally {
        setStatsLoading(false);
      }
    },
    [user?.vtr],
  );

  const handleSelectTurno = async (turno: TurnoKey) => {
    if (!user) return;
    setTurno(turno);
    setLoading(true);
    setLoadingText('ABRINDO TURNO E CARREGANDO DADOS...');

    try {
      const items = await carregarItens(user.vtr, turno);
      setBancoItens(items);
      const hist = await obterHistoricoRecente(user.vtr);
      setHistorico(hist);
      setViewMode('none');
      setSecaoAtual('');
    } catch {
      toast.error('Erro ao carregar dados do turno.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSecao = (secao: string) => {
    if (!user?.turno) {
      toast.warning('Selecione seu HORÁRIO DE PLANTÃO primeiro!');
      return;
    }
    if (secaoAtual === secao && viewMode === 'checklist') {
      setViewMode('none');
      setSecaoAtual('');
      return;
    }
    setModoCME(false);
    setSecaoAtual(secao);
    setViewMode('checklist');
    setSidebarOpen(false);
  };

  const handleOpenCME = () => {
    if (!user?.turno) {
      toast.warning('Selecione seu HORÁRIO DE PLANTÃO primeiro!');
      return;
    }
    setModoCME(true);
    setViewMode('cme');
    setSecaoAtual('');
  };

  const handleCMESelectSecao = (secao: string) => {
    setSecaoAtual(secao);
    setViewMode('checklist');
  };

  const handleOpenEstatisticas = () => {
    if (!user?.turno) {
      toast.warning('Selecione seu HORÁRIO DE PLANTÃO primeiro!');
      return;
    }
    setModoCME(false);
    setSecaoAtual('');
    setViewMode('stats');
    setSidebarOpen(false);
  };

  useEffect(() => {
    if (viewMode === 'stats' && user?.turno) {
      loadStats(periodoDias);
    }
  }, [viewMode, periodoDias, user?.turno, loadStats]);

  const handleEnviarSecao = async (itensData: ChecklistPayload[]) => {
    if (!user) return;
    setLoading(true);
    setLoadingText('SALVANDO NO BANCO...');

    try {
      const res = await salvarChecklist({
        servidor: user.nome,
        vtr: user.vtr,
        turno: user.turno,
        profissao: user.profissao,
        bypass_trava: bypassTrava,
        perfil_cme: modoCME,
        itens: itensData,
      });

      if (res.sucesso) {
        setShowSucesso(true);
        setTimeout(() => setShowSucesso(false), 3000);
        await loadData();
        verificarConclusaoGeral();
      } else {
        toast.error('Erro ao salvar: ' + res.msg);
      }
    } catch {
      toast.error('Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnviarItem = async (itemData: ChecklistPayload) => {
    if (!user) return;

    try {
      const res = await salvarChecklist({
        servidor: user.nome,
        vtr: user.vtr,
        turno: user.turno,
        profissao: user.profissao,
        bypass_trava: bypassTrava,
        perfil_cme: modoCME,
        itens: [itemData],
      });

      if (res.sucesso) {
        toast.success('Item salvo com sucesso!');
        await loadData();
        verificarConclusaoGeral();
        return true;
      } else {
        toast.error('Erro ao enviar item: ' + res.msg);
        return false;
      }
    } catch {
      toast.error('Erro de conexão.');
      return false;
    }
  };

  const verificarConclusaoGeral = () => {
    if (parabensExibido) return;
    if (secoes.length === 0) return;
    const todasConcluidas = secoes.every(s => bancoItens.find(i => i.secao === s && i.concluido_turno));
    if (todasConcluidas) {
      setShowParabens(true);
      setParabensExibido(true);
    }
  };

  const handleSair = () => {
    if (confirm('Deseja realmente sair do sistema?')) {
      logout();
    }
  };

  const profNormal = normalizar(user?.profissao);
  const showCME =
    profNormal.includes('ENFERMEIRO') ||
    profNormal.includes('COORDENADOR') ||
    profNormal.includes('CME') ||
    profNormal.includes('COORD');

  const itensSecaoAtual = bancoItens.filter(i => i.secao === secaoAtual);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col justify-center items-center z-50">
        <div className="w-16 h-16 border-[6px] border-border border-t-primary border-r-destructive border-b-accent rounded-full animate-spin mb-5" />
        <div className="font-orbitron text-primary text-sm font-bold text-center px-5">{loadingText}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] md:h-screen overflow-x-hidden md:overflow-hidden">
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-[9] md:hidden" onClick={() => setSidebarOpen(false)} />}

      <Sidebar
        secoes={secoes}
        secaoAtual={secaoAtual}
        bancoItens={bancoItens}
        onSelectSecao={handleSelectSecao}
        onOpenEstatisticas={handleOpenEstatisticas}
        onSair={handleSair}
        isOpen={sidebarOpen}
        turnoSelecionado={!!user?.turno}
      />

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden relative z-10">
        <div className="sticky top-0 z-[8] p-2.5 px-4 md:px-8 glass border-b border-border flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden bg-primary text-primary-foreground p-2 rounded-lg"
              aria-label="Abrir menu lateral"
            >
              <Menu size={18} />
            </button>
            <div>
              <strong className="text-sm">{user?.nome || '---'}</strong>
              <br />
              <small className="text-muted-foreground text-xs">{user?.profissao || '---'}</small>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {showCME && (
              <button
                onClick={handleOpenCME}
                className="bg-accent text-accent-foreground px-3 py-2 rounded-lg font-orbitron text-xs font-bold uppercase shadow hover:scale-105 transition"
              >
                <span className="inline-flex items-center gap-1">
                  <Building2 size={14} />
                  CME
                </span>
              </button>
            )}
            <div className="font-bold text-sm whitespace-nowrap">VTR: {user?.vtr || '---'}</div>
          </div>
        </div>

        <ShiftBar turnoSelecionado={user?.turno as TurnoKey} onSelectTurno={handleSelectTurno} />

        <div className="flex-1 overflow-y-auto p-4 md:p-5">
          {viewMode === 'cme' && <CMEPanel bancoItens={bancoItens} onSelectSecao={handleCMESelectSecao} />}

          {viewMode === 'checklist' && secaoAtual && (
            <ChecklistSection
              secao={secaoAtual}
              itens={itensSecaoAtual}
              profissao={user?.profissao || ''}
              modoCME={modoCME}
              bancoItensPorItem={new Map(bancoItens.map(i => [i.item, i]))}
              onEnviarSecao={handleEnviarSecao}
              onEnviarItem={handleEnviarItem}
              onVoltarCME={() => setViewMode('cme')}
            />
          )}

          {viewMode === 'stats' && (
            <StatsDashboard
              data={statsData}
              loading={statsLoading}
              periodoDias={periodoDias}
              onChangePeriodoDias={setPeriodoDias}
              onAtualizar={() => loadStats(periodoDias)}
            />
          )}

          {viewMode === 'none' && (
            <>
              {!user?.turno ? (
                <h3 className="text-center text-muted-foreground mt-24">
                  Selecione um turno acima e uma seção no menu lateral para iniciar o checklist.
                </h3>
              ) : (
                <HistoryTable historico={historico} secoes={secoes} />
              )}
            </>
          )}
        </div>
      </div>

      {showParabens && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-[10000] backdrop-blur-sm">
          <div className="bg-card p-10 rounded-3xl text-center max-w-md border-4 border-primary">
            <div className="flex justify-center mb-5 text-primary">
              <PartyPopper size={56} />
            </div>
            <h2 className="text-primary font-orbitron font-bold text-xl mb-4">PARABÉNS!</h2>
            <p className="text-lg mb-5">Você completou todo o seu check list com sucesso!</p>
            <button
              onClick={() => setShowParabens(false)}
              className="samu-gradient text-primary-foreground px-8 py-3 rounded-xl font-bold cursor-pointer"
            >
              FECHAR
            </button>
          </div>
        </div>
      )}

      {showSucesso && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-[10000] backdrop-blur-sm">
          <div className="bg-card p-10 rounded-3xl text-center max-w-md border-4 border-primary">
            <div className="text-6xl mb-5">✅</div>
            <h2 className="text-primary font-orbitron font-bold text-xl mb-4">SUCESSO!</h2>
            <p className="text-lg mb-5">Dados salvos com sucesso!</p>
            <button
              onClick={() => setShowSucesso(false)}
              className="samu-gradient text-primary-foreground px-8 py-3 rounded-xl font-bold cursor-pointer"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
