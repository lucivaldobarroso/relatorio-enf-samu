import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AdminDocumentsManager from './AdminDocumentsManager';
import AdminChecklistConfigManager from './AdminChecklistConfigManager';
import {
  DEFAULT_TICKER_MESSAGES,
  generateTickerId,
  loadTickerMessages,
  saveTickerMessages,
  TickerMessage,
  TickerTone
} from './tickerConfig';

interface AdminDashboardProps {
  user: any;
}

type AdminTab =
  | 'servidores'
  | 'auditoria'
  | 'alertas'
  | 'comunicados'
  | 'documentos'
  | 'checklist_config'
  | 'efetivo'
  | 'referencias'
  | 'novo'
  | 'aniversarios';

type RefMap = {
  ref_profissoes: any[];
  ref_vtrs: any[];
  ref_turnos: any[];
  ref_vinculos: any[];
  ref_tamanhos: any[];
};

type EfetivoKey =
  | 'enfermeiro'
  | 'medico'
  | 'condutor'
  | 'tec_enfermagem'
  | 'farmaceutico'
  | 'estatistica'
  | 'coordenador'
  | 'diretor'
  | 'tec_cme'
  | 'adm';

type EfetivoTarget = Record<EfetivoKey, number>;

const HIDDEN_COLUMNS = new Set(['senha', 'conf_senha']);
const CRITICAL_WIDTH: Record<string, number> = { nome: 320, matricula: 140, cpf: 170 };
const DEFAULT_COL_WIDTH = 180;
const STICKY_COLUMNS = ['nome', 'matricula'];
const ICON_OPTIONS = ['campaign', 'info', 'warning', 'verified_user', 'construction', 'medical_services', 'priority_high', 'event_available', 'notifications_active'];

const REF_TABLES: Array<{ key: keyof RefMap; label: string }> = [
  { key: 'ref_profissoes', label: 'Profissões' },
  { key: 'ref_vtrs', label: 'VTRs' },
  { key: 'ref_turnos', label: 'Turnos' },
  { key: 'ref_vinculos', label: 'Vínculos' }
];

const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const normalizeText = (value: string): string => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();

const toLabel = (field: string): string => {
  const normalizeFieldKey = (value: string): string =>
    normalizeText(String(value || ''))
      .replace(/[^A-Z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');

  const normalizedField = normalizeFieldKey(field);

  const map: Record<string, string> = {
    matricula: 'Matrícula', nome: 'Nome', cpf: 'CPF', profissao: 'Profissão', vinculo: 'Vínculo', vtr_padrao: 'VTR padrão', turno: 'Turno',
    n_conselho: 'Nº conselho', conselho_val: 'Validade do conselho', conselho_status: 'Status do conselho', n_habilitacao: 'Nº da CNH',
    habilitacao_val: 'Validade da CNH', habilitacao_status: 'Status da CNH', tox_val: 'Validade do toxicológico', tox_status: 'Status do toxicológico',
    data_nasc: 'Nascimento', ultimo_acesso: 'Último acesso', adimissao: 'Admissão', codigo_servidor: 'Cód. servidor', n_ponto: 'Nº ponto',
    bota: 'Bota'
  };

  if (map[field]) return map[field];

  const normalizedMap: Record<string, string> = {
    MATRICULA: 'Matrícula',
    NOME: 'Nome',
    CPF: 'CPF',
    PROFISSAO: 'Profissão',
    VINCULO: 'Vínculo',
    VTR_PADRAO: 'VTR padrão',
    TURNO: 'Turno',
    BOTA: 'Bota',
    CAMISA: 'Camisa',
    MACACAO: 'Macacão',
    N_CONSELHO: 'Nº conselho',
    CONSELHO_EMISSAO: 'Emissão do conselho',
    CONSELHO_VAL: 'Validade do conselho',
    CONSELHO_STATUS: 'Status do conselho',
    N_HABILITACAO: 'Nº da CNH',
    HABILITACAO_1_EMISSAO: '1ª emissão da habilitação',
    HABILITACAO_VAL: 'Validade da CNH',
    HABILITACAO_STATUS: 'Status da CNH',
    TOX_VAL: 'Validade do toxicológico',
    TOX_STATUS: 'Status do toxicológico',
    DATA_NASC: 'Nascimento',
    ULTIMO_ACESSO: 'Último acesso',
    ADIMISSAO: 'Admissão',
    CODIGO_SERVIDOR: 'Cód. servidor',
    N_PONTO: 'Nº ponto',
    STATUS: 'Status'
  };

  if (normalizedMap[normalizedField]) return normalizedMap[normalizedField];
  return field.replace(/_/g, ' ');
};

const isDateField = (field: string): boolean => {
  const normalizedField = normalizeText(String(field || '')).replace(/[^A-Z0-9]/g, '_');
  return normalizedField.includes('DATA') || normalizedField.includes('_VAL') || normalizedField === 'ADIMISSAO';
};
const parseDateInput = (value: unknown): string => String(value || '').match(/^(\d{4}-\d{2}-\d{2})/)?.[1] || '';
const parseLocalDate = (value: unknown): Date | null => {
  if (!value) return null;
  const raw = String(value).trim();
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]) - 1;
    const day = Number(match[3]);
    const localDate = new Date(year, month, day);
    return Number.isNaN(localDate.getTime()) ? null : localDate;
  }
  const fallback = new Date(raw);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
};

const statusBadgeClass = (value: string): string | null => {
  const normalized = normalizeText(value);
  if (['EM DIA', 'APTO', 'ATIVO'].includes(normalized)) return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300';
  if (normalized === 'PENDENTE') return 'bg-amber-500/15 text-amber-700 dark:text-amber-300';
  if (['VENCIDO', 'DESATIVADO'].includes(normalized)) return 'bg-red-500/15 text-red-700 dark:text-red-300';
  return null;
};

const toneBadgeClass = (tone: TickerTone): string => {
  if (tone === 'warning') return 'bg-amber-500/15 text-amber-700 dark:text-amber-300';
  if (tone === 'success') return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300';
  return 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300';
};

const DEFAULT_TARGETS: EfetivoTarget = {
  enfermeiro: 13,
  medico: 16,
  condutor: 36,
  tec_enfermagem: 28,
  farmaceutico: 1,
  estatistica: 2,
  coordenador: 5,
  diretor: 1,
  tec_cme: 6,
  adm: 2
};

const EFETIVO_LABELS: Record<EfetivoKey, string> = {
  enfermeiro: 'Enfermeiro', medico: 'Médico', condutor: 'Condutor', tec_enfermagem: 'Tec. Enfermagem', farmaceutico: 'Farmacêutico',
  estatistica: 'Estatística', coordenador: 'Coordenador', diretor: 'Diretor', tec_cme: 'Tec. CME', adm: 'ADM'
};

const parseBirthMonth = (dateValue: unknown): number | null => {
  if (!dateValue) return null;
  const raw = String(dateValue);
  const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return Number(m[2]) - 1;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d.getMonth();
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [servidores, setServidores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>('servidores');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterProfissao, setFilterProfissao] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [logs, setLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [alertas, setAlertas] = useState<any[]>([]);

  const [editingServer, setEditingServer] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [deactivateLoading, setDeactivateLoading] = useState(false);

  const [refs, setRefs] = useState<RefMap>({ ref_profissoes: [], ref_vtrs: [], ref_turnos: [], ref_vinculos: [], ref_tamanhos: [] });
  const [refDraft, setRefDraft] = useState<Record<string, string>>({});
  const [refSaving, setRefSaving] = useState(false);

  const [newServer, setNewServer] = useState<any>({});
  const [newServerSaving, setNewServerSaving] = useState(false);

  const [tickerMessages, setTickerMessages] = useState<TickerMessage[]>([]);
  const [tickerLoading, setTickerLoading] = useState(false);
  const [tickerSaving, setTickerSaving] = useState(false);
  const [tickerError, setTickerError] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [tickerDraft, setTickerDraft] = useState<TickerMessage>({ id: generateTickerId(), icon: 'campaign', tone: 'warning', text: '', order: 0, active: true });

  const [targets, setTargets] = useState<EfetivoTarget>(() => {
    try {
      const stored = localStorage.getItem('samu.efetivo.targets');
      return stored ? { ...DEFAULT_TARGETS, ...JSON.parse(stored) } : DEFAULT_TARGETS;
    } catch {
      return DEFAULT_TARGETS;
    }
  });

  const [showColumnPrefs, setShowColumnPrefs] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const editModalContentRef = useRef<HTMLDivElement | null>(null);

  const SUPABASE_URL = (import.meta as any).env.VITE_SUPABASE_URL;
  const SUPABASE_KEY = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;
  const headers = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };

  const columnPrefKey = `samu.visibleColumns.${String(user?.matricula || 'coordenacao')}`;

  const orderedColumns = useMemo(() => {
    if (servidores.length === 0) return [] as string[];
    const cols = Object.keys(servidores[0] || {}).filter((c) => !HIDDEN_COLUMNS.has(c));
    const known = new Set(cols);
    servidores.forEach((item) => {
      Object.keys(item || {}).forEach((key) => {
        if (!HIDDEN_COLUMNS.has(key) && !known.has(key)) {
          cols.push(key);
          known.add(key);
        }
      });
    });
    return cols;
  }, [servidores]);
  useEffect(() => {
    localStorage.setItem('samu.efetivo.targets', JSON.stringify(targets));
  }, [targets]);

  useEffect(() => {
    if (orderedColumns.length === 0) return;
    try {
      const stored = localStorage.getItem(columnPrefKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const valid = parsed.filter((c) => orderedColumns.includes(c));
          setVisibleColumns(valid.length > 0 ? valid : orderedColumns);
          return;
        }
      }
    } catch {
      // ignore
    }
    setVisibleColumns(orderedColumns);
  }, [orderedColumns, columnPrefKey]);

  useEffect(() => {
    if (visibleColumns.length > 0) {
      localStorage.setItem(columnPrefKey, JSON.stringify(visibleColumns));
    }
  }, [visibleColumns, columnPrefKey]);

  useEffect(() => {
    if (!feedback) return;
    const timeout = window.setTimeout(() => setFeedback(null), 6500);
    return () => window.clearTimeout(timeout);
  }, [feedback]);

  useEffect(() => {
    if (!isEditModalOpen) return;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isEditModalOpen]);

  useEffect(() => {
    if (!isEditModalOpen) return;

    const preventBackgroundScroll = (event: WheelEvent | TouchEvent) => {
      const modalEl = editModalContentRef.current;
      if (!modalEl) {
        event.preventDefault();
        return;
      }
      const target = event.target as Node | null;
      if (target && modalEl.contains(target)) return;
      event.preventDefault();
    };

    document.addEventListener('wheel', preventBackgroundScroll, { passive: false });
    document.addEventListener('touchmove', preventBackgroundScroll, { passive: false });
    return () => {
      document.removeEventListener('wheel', preventBackgroundScroll);
      document.removeEventListener('touchmove', preventBackgroundScroll);
    };
  }, [isEditModalOpen]);

  const getFieldOptions = (field: string): string[] | null => {
    const normalizedField = normalizeText(String(field || '')).replace(/[^A-Z0-9]/g, '_');

    if (normalizedField === 'PROFISSAO') return refs.ref_profissoes.map((i) => i.nome).filter(Boolean);
    if (normalizedField === 'VTR_PADRAO') return refs.ref_vtrs.map((i) => i.nome).filter(Boolean);
    if (normalizedField === 'TURNO') return refs.ref_turnos.map((i) => i.nome).filter(Boolean);
    if (normalizedField === 'VINCULO') return refs.ref_vinculos.map((i) => i.nome).filter(Boolean);
    if (normalizedField === 'CAMISA' || normalizedField === 'MACACAO') return refs.ref_tamanhos.map((i) => i.nome).filter(Boolean);
    if (normalizedField === 'STATUS') return ['ATIVO', 'DESATIVADO'];
    if (normalizedField === 'CONSELHO_STATUS' || normalizedField === 'HABILITACAO_STATUS' || normalizedField === 'TOX_STATUS') return ['EM DIA', 'PENDENTE', 'VENCIDO'];
    return null;
  };

  const formatDataHora = (iso?: string) =>
    iso
      ? new Date(iso).toLocaleString('pt-BR', {
          timeZone: 'America/Boa_Vista',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      : '-';
  const formatDateOnly = (value?: string) => {
    const d = parseLocalDate(value);
    return d ? d.toLocaleDateString('pt-BR') : '-';
  };

  const summarizeDetalhes = (detalhes: any): string => {
    if (detalhes === null || detalhes === undefined) return '-';
    if (typeof detalhes === 'string') return detalhes;
    if (typeof detalhes !== 'object') return String(detalhes);

    const before = (detalhes as any).antes;
    const after = (detalhes as any).depois;
    if (before && after && typeof before === 'object' && typeof after === 'object') {
      const keys = Array.from(new Set([...Object.keys(before), ...Object.keys(after)]));
      const changed = keys.filter((k) => JSON.stringify(before[k]) !== JSON.stringify(after[k]));
      if (changed.length > 0) {
        return `Campos alterados: ${changed.join(', ')}`;
      }
    }

    try {
      return JSON.stringify(detalhes);
    } catch {
      return String(detalhes);
    }
  };

  const formatValue = (field: string, value: unknown): string => {
    if (value === null || value === undefined || value === '') return '-';
    if (isDateField(field)) {
      const d = parseLocalDate(value);
      if (d && !Number.isNaN(d.getTime())) return d.toLocaleDateString('pt-BR');
    }
    if (typeof value === 'boolean') return value ? 'SIM' : 'NÃO';
    return String(value);
  };

  const getColumnWidth = (column: string): number => CRITICAL_WIDTH[column] || DEFAULT_COL_WIDTH;

  const stickyLeftMap = useMemo(() => {
    const result: Record<string, number> = {};
    let left = 0;
    visibleColumns.forEach((col) => {
      if (STICKY_COLUMNS.includes(col)) {
        result[col] = left;
        left += getColumnWidth(col);
      }
    });
    return result;
  }, [visibleColumns]);

  const tableMinWidth = useMemo(() => {
    return visibleColumns.reduce((sum, col) => sum + getColumnWidth(col), 0) + 120;
  }, [visibleColumns]);

  const allProfissoes = useMemo(() => Array.from(new Set([
    ...refs.ref_profissoes.map((p) => p.nome),
    ...servidores.flatMap((s) => String(s.profissao || '').split(',').map((p: string) => p.trim().toUpperCase()))
  ])).filter(Boolean).sort(), [refs.ref_profissoes, servidores]);

  const executorNameByMatricula = useMemo(() => {
    const map: Record<string, string> = {};
    servidores.forEach((s) => {
      const mat = String(s?.matricula || '').trim();
      const nome = String(s?.nome || '').trim();
      if (mat && nome) map[mat] = nome;
    });
    return map;
  }, [servidores]);

  const formatExecutorLabel = (raw: unknown): string => {
    const value = String(raw || '').trim();
    if (!value) return 'SISTEMA';
    if (executorNameByMatricula[value]) return executorNameByMatricula[value];
    if (/^\d+$/.test(value)) return `#${value}`;
    return value;
  };

  const filteredServidores = useMemo(() => {
    return servidores.filter((s) => {
      const matchSearch = String(s.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) || String(s.cpf || '').includes(searchTerm) || String(s.matricula || '').includes(searchTerm);
      const matchProf = filterProfissao ? String(s.profissao || '').toUpperCase().includes(filterProfissao.toUpperCase()) : true;
      const matchStatus = filterStatus ? String(s.status || '') === filterStatus : true;
      return matchSearch && matchProf && matchStatus;
    });
  }, [servidores, searchTerm, filterProfissao, filterStatus]);

  const efetivoAtual = useMemo(() => {
    const active = servidores.filter((s) => normalizeText(String(s.status || '')) === 'ATIVO');
    const countBy = (predicate: (prof: string) => boolean) => active.filter((s) => predicate(normalizeText(String(s.profissao || '')))).length;

    return {
      enfermeiro: countBy((p) => p.includes('ENFERMEIRO')),
      medico: countBy((p) => p.includes('MEDICO')),
      condutor: countBy((p) => p.includes('CONDUTOR')),
      tec_enfermagem: countBy((p) => p.includes('TECNICO DE ENFERMAGEM') || p.includes('TEC DE ENFERMAGEM') || p.includes('TECNICO')),
      farmaceutico: countBy((p) => p.includes('FARMACEUTICO')),
      estatistica: countBy((p) => p.includes('ESTATISTICA')),
      coordenador: countBy((p) => p.includes('COORDENADOR')),
      diretor: countBy((p) => p.includes('DIRETOR')),
      tec_cme: countBy((p) => p.includes('TEC CME') || p.includes('CME')),
      adm: countBy((p) => p === 'ADM' || p.includes('ADMINISTRATIVO') || p.includes('ASSISTENTE ADMINISTRATIVO'))
    } as Record<EfetivoKey, number>;
  }, [servidores]);

  const monthlyBirthdays = useMemo(() => {
    const groups: Array<{ month: number; people: any[] }> = MONTHS.map((_, month) => ({ month, people: [] }));
    servidores.forEach((s) => {
      const m = parseBirthMonth(s.data_nasc);
      if (m !== null && m >= 0 && m < 12) groups[m].people.push(s);
    });
    groups.forEach((g) => g.people.sort((a, b) => String(a.nome || '').localeCompare(String(b.nome || ''), 'pt-BR')));
    return groups;
  }, [servidores]);

  const activeComunicados = useMemo(() => tickerMessages.filter((m) => m.active), [tickerMessages]);
  const pausedComunicados = useMemo(() => tickerMessages.filter((m) => !m.active), [tickerMessages]);

  const logComunicado = useCallback(async (acao: string, detalhes: string) => {
    try {
      const h = { ...headers, 'Content-Type': 'application/json', 'x-matricula-executor': String(user?.matricula || ''), 'x-executor-nome': String(user?.nome || '') };
      await fetch(`${SUPABASE_URL}/rest/v1/logs_comunicados_topo`, {
        method: 'POST',
        headers: h,
        body: JSON.stringify({
          matricula_executor: user?.matricula || null,
          acao,
          detalhes,
          data_hora: new Date().toISOString()
        })
      });
    } catch {
      // opcional
    }
  }, [SUPABASE_URL, SUPABASE_KEY, user?.matricula]);

  const fetchComunicados = useCallback(async () => {
    setTickerLoading(true);
    setTickerError('');
    try {
      const loaded = await loadTickerMessages({ includeInactive: true });
      setTickerMessages(loaded);
    } catch (error: any) {
      setTickerError(error?.message || 'Erro ao carregar comunicados.');
      setTickerMessages(DEFAULT_TICKER_MESSAGES);
    } finally {
      setTickerLoading(false);
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const servRes = await fetch(`${SUPABASE_URL}/rest/v1/servidores_v2?select=*&order=nome.asc`, { headers });
      const data = await servRes.json();
      const list = Array.isArray(data) ? data : [];
      setServidores(list);

      if (list.length > 0) {
        const base: any = {};
        Object.keys(list[0]).forEach((key) => {
          if (HIDDEN_COLUMNS.has(key)) return;
          base[key] = key === 'status' ? 'ATIVO' : '';
        });
        setNewServer(base);
      }

      const loadRef = async (table: keyof RefMap) => {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&order=nome.asc`, { headers });
        const d = await res.json();
        return Array.isArray(d) ? d : [];
      };

      const [profissoes, vtrs, turnos, vinculos, tamanhos] = await Promise.all([
        loadRef('ref_profissoes'),
        loadRef('ref_vtrs'),
        loadRef('ref_turnos'),
        loadRef('ref_vinculos'),
        loadRef('ref_tamanhos')
      ]);

      setRefs({ ref_profissoes: profissoes, ref_vtrs: vtrs, ref_turnos: turnos, ref_vinculos: vinculos, ref_tamanhos: tamanhos });

      const hoje = new Date();
      const limite = new Date();
      limite.setDate(hoje.getDate() + 30);
      const novosAlertas: any[] = [];

      list.forEach((s: any) => {
        const checkVenc = (dataStr: string, tipo: string, statusCol: string) => {
          if (!dataStr) return;
          const d = parseLocalDate(dataStr);
          if (d && d <= limite) {
            novosAlertas.push({ nome: s.nome, matricula: s.matricula, tipo, data: dataStr, vencido: d < hoje, profissao: s.profissao, status: s[statusCol] });
          }
        };
        if (['TÉCNICO DE ENFERMAGEM', 'ENFERMEIRO', 'MÉDICO', 'TECNICO'].includes(String(s.profissao || '').toUpperCase())) checkVenc(s.conselho_val, 'Conselho profissional', 'conselho_status');
        if (String(s.profissao || '').toUpperCase().includes('CONDUTOR')) {
          checkVenc(s.habilitacao_val, 'CNH (habilitação)', 'habilitacao_status');
          checkVenc(s.tox_val, 'Exame toxicológico', 'tox_status');
        }
      });

      setAlertas(novosAlertas);
    } catch {
      setServidores([]);
      setAlertas([]);
    } finally {
      setLoading(false);
    }
  }, [SUPABASE_URL, SUPABASE_KEY]);
  const fetchLogs = useCallback(async () => {
    setLogsLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/logs_auditoria_servidores?select=id_log,data_hora,matricula_executor,matricula_alvo,acao,detalhes&order=data_hora.desc&limit=100`, { headers });
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch {
      setLogs([]);
    } finally {
      setLogsLoading(false);
    }
  }, [SUPABASE_URL, SUPABASE_KEY]);

  useEffect(() => {
    fetchData();
    fetchComunicados();
  }, [fetchData, fetchComunicados]);

  useEffect(() => {
    if (activeTab === 'auditoria') fetchLogs();
    if (activeTab === 'comunicados') fetchComunicados();
  }, [activeTab, fetchLogs, fetchComunicados]);

  const persistComunicados = async (nextMessages: TickerMessage[], action: string): Promise<boolean> => {
    setTickerSaving(true);
    setTickerError('');
    try {
      const ordered = nextMessages.map((m, idx) => ({ ...m, order: idx }));
      const saved = await saveTickerMessages(ordered);
      setTickerMessages(saved);
      await logComunicado(action, `${action} em ${saved.length} comunicados`);
      const successText: Record<string, string> = {
        CRIOU: 'Comunicado criado em pausa.',
        'CRIOU E ATIVOU': 'Comunicado criado e ativado no topo.',
        ATIVOU: 'Comunicado ativado no topo.',
        PAUSOU: 'Comunicado pausado com sucesso.',
        REMOVEU: 'Comunicado removido com sucesso.',
        RESTAUROU_PADRAO: 'Comunicados padrão restaurados com sucesso.'
      };
      setFeedback({ type: 'success', text: successText[action] || 'Comunicados atualizados com sucesso.' });
      return true;
    } catch (error: any) {
      const msg = error?.message || 'Não foi possível salvar comunicados.';
      setTickerError(msg);
      setFeedback({ type: 'error', text: msg });
      return false;
    } finally {
      setTickerSaving(false);
    }
  };

  const submitTickerDraft = async (activateNow: boolean) => {
    const text = tickerDraft.text.trim();
    if (!text) {
      setFeedback({ type: 'error', text: 'Informe o texto do comunicado.' });
      return;
    }

    const msg: TickerMessage = {
      ...tickerDraft,
      id: generateTickerId(),
      text,
      active: activateNow
    };

    const next = [...tickerMessages, msg];
    const ok = await persistComunicados(next, activateNow ? 'CRIOU E ATIVOU' : 'CRIOU');
    if (!ok) return;

    setTickerDraft({
      id: generateTickerId(),
      icon: 'campaign',
      tone: 'warning',
      text: '',
      order: next.length,
      active: true
    });
  };

  const restoreDefaultMessages = async () => {
    await persistComunicados(
      DEFAULT_TICKER_MESSAGES.map((item, index) => ({ ...item, order: index })),
      'RESTAUROU_PADRAO'
    );
  };

  const toggleColumn = (column: string) => {
    setVisibleColumns((prev) => {
      if (prev.includes(column)) {
        if (prev.length === 1) return prev;
        return prev.filter((c) => c !== column);
      }
      const ordered = orderedColumns.filter((c) => c === column || prev.includes(c));
      return ordered;
    });
  };

  const parseRequestError = async (res: Response): Promise<string> => {
    const raw = await res.text();
    if (!raw) return `Falha HTTP ${res.status}`;
    try {
      const parsed = JSON.parse(raw);
      return parsed?.message || parsed?.hint || parsed?.details || raw;
    } catch {
      return raw;
    }
  };

  const addReferenceItem = async (tableKey: keyof RefMap, tableLabel: string) => {
    const nome = String(refDraft[tableKey] || '').trim();
    if (!nome) {
      setFeedback({ type: 'error', text: `Informe um valor para ${tableLabel}.` });
      return;
    }

    setRefSaving(true);
    try {
      const h = {
        ...headers,
        'Content-Type': 'application/json',
        'x-matricula-executor': String(user?.matricula || ''),
        'x-executor-nome': String(user?.nome || '')
      };
      let res = await fetch(`${SUPABASE_URL}/rest/v1/${tableKey}`, {
        method: 'POST',
        headers: { ...h, Prefer: 'return=representation' },
        body: JSON.stringify({ nome, ativo: true })
      });
      if (!res.ok) {
        const firstErr = await parseRequestError(res);
        const activeColumnMissing =
          firstErr.toLowerCase().includes("'ativo' column") ||
          firstErr.toLowerCase().includes("coluna 'ativo'") ||
          firstErr.toLowerCase().includes('schema cache');
        if (!activeColumnMissing) throw new Error(firstErr);

        // Fallback para tabelas de referência sem coluna "ativo"
        res = await fetch(`${SUPABASE_URL}/rest/v1/${tableKey}`, {
          method: 'POST',
          headers: { ...h, Prefer: 'return=representation' },
          body: JSON.stringify({ nome })
        });
        if (!res.ok) throw new Error(await parseRequestError(res));
      }

      setRefDraft((prev) => ({ ...prev, [tableKey]: '' }));
      await fetchData();
      setFeedback({ type: 'success', text: `${tableLabel} adicionado com sucesso.` });
    } catch (err: any) {
      setFeedback({ type: 'error', text: `Erro ao adicionar ${tableLabel.toLowerCase()}: ${String(err?.message || 'falha na operação')}` });
    } finally {
      setRefSaving(false);
    }
  };

  const getReferenceRowIdentifier = (row: Record<string, any>): { field: string; value: string | number } | null => {
    if (row?.id !== undefined && row?.id !== null) {
      return { field: 'id', value: row.id as string | number };
    }
    const key = Object.keys(row || {}).find((k) => /^id(_|$)/i.test(k));
    if (key && row[key] !== undefined && row[key] !== null) {
      return { field: key, value: row[key] as string | number };
    }
    return null;
  };

  const removeReferenceItem = async (
    tableKey: keyof RefMap,
    tableLabel: string,
    idField: string,
    itemId: string | number
  ) => {
    setRefSaving(true);
    try {
      const encodedId = encodeURIComponent(String(itemId));
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${tableKey}?${idField}=eq.${encodedId}`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error(await parseRequestError(res));

      await fetchData();
      setFeedback({ type: 'success', text: `${tableLabel} removido com sucesso.` });
    } catch (err: any) {
      setFeedback({ type: 'error', text: `Erro ao remover ${tableLabel.toLowerCase()}: ${String(err?.message || 'falha na operação')}` });
    } finally {
      setRefSaving(false);
    }
  };

  const renderInputForField = (model: any, setModel: (next: any) => void, field: string) => {
    const options = getFieldOptions(field);
    const value = model?.[field] ?? '';
    const normalizedField = normalizeText(String(field || '')).replace(/[^A-Z0-9]/g, '_');

    if (normalizedField === 'BOTA') {
      return (
        <div className="input-group" key={field}>
          <label>{toLabel(field)}</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={String(value || '')}
            onChange={(e) => {
              const onlyDigits = e.target.value.replace(/\D/g, '');
              setModel({ ...model, [field]: onlyDigits });
            }}
          />
        </div>
      );
    }

    if (options) {
      return <div className="input-group" key={field}><label>{toLabel(field)}</label><select value={String(value)} onChange={(e) => setModel({ ...model, [field]: e.target.value })}><option value="">Selecionar...</option>{options.map((o) => <option key={`${field}-${o}`} value={o}>{o}</option>)}</select></div>;
    }

    if (isDateField(field)) {
      return <div className="input-group" key={field}><label>{toLabel(field)}</label><input type="date" value={parseDateInput(value)} onChange={(e) => setModel({ ...model, [field]: e.target.value || null })} /></div>;
    }

    return <div className="input-group" key={field}><label>{toLabel(field)}</label><input type="text" value={String(value || '')} onChange={(e) => setModel({ ...model, [field]: e.target.value })} /></div>;
  };

  return (
    <div className="animate-in fade-in duration-700 pb-20">
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        <button onClick={() => setActiveTab('servidores')} className={`shrink-0 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.16em] border ${activeTab === 'servidores' ? 'bg-lb-navy text-white border-lb-navy shadow-xl shadow-lb-navy/30' : 'bg-white/80 border-slate-200 text-slate-500'}`}>Servidores</button>
        <button onClick={() => setActiveTab('auditoria')} className={`shrink-0 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.16em] border ${activeTab === 'auditoria' ? 'bg-lb-navy text-white border-lb-navy shadow-xl shadow-lb-navy/30' : 'bg-white/80 border-slate-200 text-slate-500'}`}>Auditoria</button>
        <button onClick={() => setActiveTab('alertas')} className={`shrink-0 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.16em] border ${activeTab === 'alertas' ? 'bg-red-600 text-white border-red-600 shadow-xl shadow-red-600/25' : 'bg-white/80 border-slate-200 text-slate-500'}`}>Alertas</button>
        <button onClick={() => setActiveTab('comunicados')} className={`shrink-0 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.16em] border ${activeTab === 'comunicados' ? 'bg-cyan-600 text-white border-cyan-600 shadow-xl shadow-cyan-600/25' : 'bg-white/80 border-slate-200 text-slate-500'}`}>Comunicados</button>
        <button onClick={() => setActiveTab('documentos')} className={`shrink-0 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.16em] border ${activeTab === 'documentos' ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-600/25' : 'bg-white/80 border-slate-200 text-slate-500'}`}>Documentos</button>
        <button onClick={() => setActiveTab('checklist_config')} className={`shrink-0 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.16em] border ${activeTab === 'checklist_config' ? 'bg-violet-600 text-white border-violet-600 shadow-xl shadow-violet-600/25' : 'bg-white/80 border-slate-200 text-slate-500'}`}>Checklist Config</button>
        <button onClick={() => setActiveTab('efetivo')} className={`shrink-0 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.16em] border ${activeTab === 'efetivo' ? 'bg-emerald-600 text-white border-emerald-600 shadow-xl shadow-emerald-600/25' : 'bg-white/80 border-slate-200 text-slate-500'}`}>Efetivo</button>
        <button onClick={() => setActiveTab('aniversarios')} className={`shrink-0 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.16em] border ${activeTab === 'aniversarios' ? 'bg-fuchsia-600 text-white border-fuchsia-600 shadow-xl shadow-fuchsia-600/25' : 'bg-white/80 border-slate-200 text-slate-500'}`}>Aniversários</button>
        <button onClick={() => setActiveTab('referencias')} className={`shrink-0 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.16em] border ${activeTab === 'referencias' ? 'bg-emerald-600 text-white border-emerald-600 shadow-xl shadow-emerald-600/25' : 'bg-white/80 border-slate-200 text-slate-500'}`}>Referências</button>
        <button onClick={() => setActiveTab('novo')} className={`shrink-0 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.16em] border ${activeTab === 'novo' ? 'bg-gold text-lb-navy border-gold shadow-xl shadow-gold/25' : 'bg-white/80 border-slate-200 text-slate-500'}`}>Criar servidor</button>
      </div>
      {feedback && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[260] w-[min(92vw,560px)] rounded-2xl border px-5 py-4 text-sm font-black shadow-2xl backdrop-blur ${feedback.type === 'success' ? 'border-emerald-300 bg-emerald-50/95 text-emerald-800' : 'border-red-300 bg-red-50/95 text-red-800'}`}>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base">{feedback.type === 'success' ? 'check_circle' : 'error'}</span>
            <span>{feedback.text}</span>
          </div>
        </div>
      )}

      {activeTab === 'servidores' && (
        <>
          <div className="flex flex-col xl:flex-row gap-4 mb-6">
            <div className="flex-1 bg-white/90 border border-slate-200 rounded-3xl p-5 flex items-center shadow-lg shadow-lb-navy/5"><span className="material-symbols-outlined text-slate-400 mr-3">search</span><input type="text" placeholder="Pesquisar nome, CPF ou matrícula..." className="bg-transparent border-none outline-none w-full text-base font-semibold placeholder:text-slate-400" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
            <select className="w-full xl:w-auto bg-white/90 border border-slate-200 rounded-3xl p-4 text-sm font-black uppercase outline-none xl:min-w-[230px]" value={filterProfissao} onChange={(e) => setFilterProfissao(e.target.value)}><option value="">Todas profissões</option>{allProfissoes.map((p) => <option key={p} value={p}>{p}</option>)}</select>
            <select className="w-full xl:w-auto bg-white/90 border border-slate-200 rounded-3xl p-4 text-sm font-black uppercase outline-none xl:min-w-[170px]" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}><option value="">Status</option><option value="ATIVO">ATIVO</option><option value="DESATIVADO">DESATIVADO</option></select>
            <button type="button" onClick={() => setShowColumnPrefs((prev) => !prev)} className="w-full xl:w-auto px-4 py-3 rounded-2xl border border-lb-navy/20 bg-white text-lb-navy text-[11px] font-black uppercase">Colunas</button>
          </div>
          {showColumnPrefs && <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-2">{orderedColumns.map((col) => <label key={col} className="flex items-center gap-2 text-[11px] font-bold text-slate-700"><input type="checkbox" checked={visibleColumns.includes(col)} onChange={() => toggleColumn(col)} />{toLabel(col)}</label>)}</div>}

          <div className="rounded-[2rem] border border-lb-navy/15 bg-white shadow-2xl shadow-lb-navy/10 overflow-hidden relative z-30">
            <div className="overflow-x-auto overflow-y-auto max-h-[74vh] scrollbar-thin">
              <table className="text-left text-[13px] leading-5" style={{ minWidth: `${Math.max(3200, tableMinWidth)}px` }}>
                <thead className="sticky top-0 z-30 bg-white">
                  <tr className="border-b border-slate-200 text-[10px] font-black uppercase tracking-[0.12em] text-slate-700">{visibleColumns.map((column) => <th key={column} className="px-4 py-4 whitespace-nowrap" style={{ minWidth: getColumnWidth(column), width: getColumnWidth(column), position: STICKY_COLUMNS.includes(column) ? 'sticky' : 'static', left: STICKY_COLUMNS.includes(column) ? stickyLeftMap[column] : undefined, zIndex: STICKY_COLUMNS.includes(column) ? 35 : 30, background: '#f8fafc', boxShadow: STICKY_COLUMNS.includes(column) ? '1px 0 0 0 #e2e8f0' : undefined }}>{toLabel(column)}</th>)}<th className="px-4 py-4 text-center bg-slate-50 sticky top-0 z-30">Ações</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80">{loading ? <tr><td colSpan={visibleColumns.length + 1} className="py-20 text-center uppercase font-black text-slate-400 animate-pulse">Consultando registros...</td></tr> : filteredServidores.length === 0 ? <tr><td colSpan={visibleColumns.length + 1} className="py-16 text-center font-semibold text-slate-500">Nenhum servidor encontrado.</td></tr> : filteredServidores.map((server, rowIndex) => <tr key={server.matricula} className={`${rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'} hover:bg-cyan-50/70 transition-colors`}>{visibleColumns.map((column) => {const raw = formatValue(column, server[column]); const badge = statusBadgeClass(raw); const sticky = STICKY_COLUMNS.includes(column); return <td key={`${server.matricula}-${column}`} className="px-4 py-3.5 whitespace-nowrap align-top font-medium text-slate-700" style={{ minWidth: getColumnWidth(column), width: getColumnWidth(column), position: sticky ? 'sticky' : 'static', left: sticky ? stickyLeftMap[column] : undefined, zIndex: sticky ? 25 : 1, background: sticky ? (rowIndex % 2 === 0 ? '#ffffff' : '#f8fafc') : undefined, boxShadow: sticky ? '1px 0 0 0 #e2e8f0' : undefined }}>{badge ? <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${badge}`}>{raw}</span> : raw}</td>;})}<td className="px-4 py-3 text-center"><button onClick={() => { setEditingServer(server); setIsEditModalOpen(true); }} className="p-2.5 border border-lb-navy/20 hover:bg-lb-navy hover:text-white rounded-xl transition-all text-lb-navy/80"><span className="material-symbols-outlined text-sm">edit_note</span></button></td></tr>)}</tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'alertas' && (
        <div className="rounded-[2rem] border border-red-200 bg-white p-6">
          <h3 className="text-xl font-black text-lb-navy uppercase mb-4">Alertas de vencimento (30 dias)</h3>
          {alertas.length === 0 ? (
            <p className="text-sm font-semibold text-slate-500">Nenhum alerta encontrado no período.</p>
          ) : (
            <div className="space-y-3 max-h-[68vh] overflow-auto pr-1">
              {alertas
                .sort((a, b) => {
                  const da = parseLocalDate(a.data)?.getTime() || 0;
                  const db = parseLocalDate(b.data)?.getTime() || 0;
                  return da - db;
                })
                .map((item, idx) => (
                  <article key={`${item.matricula}-${item.tipo}-${idx}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-lb-navy">{item.nome} <span className="text-slate-500 font-bold">#{item.matricula}</span></p>
                      <p className="text-xs font-semibold text-slate-600 mt-1">{item.profissao} • {item.tipo}</p>
                      <p className="text-xs font-semibold text-slate-600">Vencimento: {formatDateOnly(item.data)}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${item.vencido ? 'bg-red-500/15 text-red-700' : 'bg-amber-500/15 text-amber-700'}`}>
                      {item.vencido ? 'Vencido' : 'A vencer'}
                    </span>
                  </article>
                ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'auditoria' && <div className="rounded-[2rem] border border-slate-200 bg-white overflow-auto"><table className="w-full text-left text-[10px]"><thead><tr className="bg-slate-100 border-b border-slate-200 font-black uppercase text-slate-600"><th className="px-6 py-4">Data/Hora</th><th className="px-6 py-4">Executor</th><th className="px-6 py-4">Alvo</th><th className="px-6 py-4">Ação</th><th className="px-6 py-4">Detalhes</th></tr></thead><tbody>{logsLoading ? <tr><td colSpan={5} className="py-20 text-center uppercase font-black text-slate-400">Processando logs...</td></tr> : logs.map((l) => <tr key={l.id_log || l.id} className="border-b border-slate-200"><td className="px-6 py-3 font-bold">{formatDataHora(l.data_hora)}</td><td className="px-6 py-3 font-black uppercase text-lb-navy">{formatExecutorLabel(l.matricula_executor)}</td><td className="px-6 py-3 font-bold text-slate-700">#{l.matricula_alvo || '-'}</td><td className="px-6 py-3">{l.acao}</td><td className="px-6 py-3 text-slate-500">{summarizeDetalhes(l.detalhes)}</td></tr>)}</tbody></table></div>}
      {activeTab === 'comunicados' && (
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-cyan-200/60 bg-white p-6"><h3 className="text-xl font-black text-lb-navy uppercase tracking-tight">Gestão de comunicados do topo</h3><p className="text-sm font-semibold text-slate-500 mt-2">Ativar no topo coloca o comunicado em produção para todos. Pausar remove do topo, mas mantém salvo.</p>{tickerError && <p className="text-xs font-bold text-red-500 mt-3">{tickerError}</p>}</div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 rounded-[2rem] border border-slate-200 bg-white p-6 space-y-4">{tickerLoading ? <div className="py-8 text-center text-slate-500 font-bold">Carregando comunicados...</div> : <><p className="text-[11px] font-black uppercase tracking-widest text-slate-500">Ativos</p>{activeComunicados.length === 0 ? <p className="text-sm text-slate-500">Nenhum comunicado ativo.</p> : activeComunicados.map((msg) => <article key={msg.id} className="rounded-2xl border border-slate-200 bg-white p-4 flex items-start justify-between gap-4"><div><div className="flex items-center gap-2 mb-2"><span className="material-symbols-outlined text-sm text-lb-navy">{msg.icon}</span><span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${toneBadgeClass(msg.tone)}`}>{msg.tone}</span><span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/15 text-emerald-700">No topo</span></div><p className="text-sm font-semibold text-slate-700">{msg.text}</p></div><div className="flex gap-2"><button type="button" onClick={() => persistComunicados(tickerMessages.map((m) => m.id === msg.id ? { ...m, active: false } : m), 'PAUSOU')} className="px-3 py-2 rounded-xl border border-amber-300 text-amber-700 text-[10px] font-black uppercase">Pausar</button><button type="button" onClick={() => persistComunicados(tickerMessages.filter((m) => m.id !== msg.id), 'REMOVEU')} className="px-3 py-2 rounded-xl border border-red-200 text-red-600 text-[10px] font-black uppercase">Remover</button></div></article>)}<p className="text-[11px] font-black uppercase tracking-widest text-slate-500 pt-2">Em pausa</p>{pausedComunicados.length === 0 ? <p className="text-sm text-slate-500">Nenhum comunicado em pausa.</p> : pausedComunicados.map((msg) => <article key={msg.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-start justify-between gap-4"><div><div className="flex items-center gap-2 mb-2"><span className="material-symbols-outlined text-sm text-slate-500">{msg.icon}</span><span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${toneBadgeClass(msg.tone)}`}>{msg.tone}</span><span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-300/70 text-slate-700">Pausado</span></div><p className="text-sm font-semibold text-slate-700">{msg.text}</p></div><div className="flex gap-2"><button type="button" onClick={() => persistComunicados(tickerMessages.map((m) => m.id === msg.id ? { ...m, active: true } : m), 'ATIVOU')} className="px-3 py-2 rounded-xl border border-emerald-300 text-emerald-700 text-[10px] font-black uppercase">Ativar no topo</button><button type="button" onClick={() => persistComunicados(tickerMessages.filter((m) => m.id !== msg.id), 'REMOVEU')} className="px-3 py-2 rounded-xl border border-red-200 text-red-600 text-[10px] font-black uppercase">Remover</button></div></article>)}</>}</div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 space-y-4"><div className="input-group"><label>Texto</label><input type="text" placeholder="Ex.: Sistema em manutenção às 02:00" value={tickerDraft.text} onChange={(e) => setTickerDraft({ ...tickerDraft, text: e.target.value })} /></div><div className="grid grid-cols-2 gap-3"><div className="input-group"><label>Ícone</label><select value={tickerDraft.icon} onChange={(e) => setTickerDraft({ ...tickerDraft, icon: e.target.value })}>{ICON_OPTIONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}</select></div><div className="input-group"><label>Tipo</label><select value={tickerDraft.tone} onChange={(e) => setTickerDraft({ ...tickerDraft, tone: e.target.value as TickerTone })}><option value="warning">Aviso</option><option value="info">Informação</option><option value="success">Confirmação</option></select></div></div><button type="button" onClick={() => submitTickerDraft(false)} disabled={tickerSaving} className="w-full py-3 rounded-xl bg-cyan-600 text-white text-[11px] font-black uppercase tracking-widest disabled:opacity-60">{tickerSaving ? 'Salvando...' : 'Adicionar em pausa'}</button><button type="button" onClick={() => submitTickerDraft(true)} disabled={tickerSaving} className="w-full py-3 rounded-xl border border-emerald-300 text-emerald-700 text-[11px] font-black uppercase tracking-widest disabled:opacity-60">Ativar no topo agora</button><button type="button" onClick={restoreDefaultMessages} disabled={tickerSaving} className="w-full py-3 rounded-xl border border-slate-300 text-slate-600 text-[11px] font-black uppercase tracking-widest">Restaurar padrão</button></div>
          </div>
        </div>
      )}

      {activeTab === 'documentos' && <AdminDocumentsManager user={user} />}
      {activeTab === 'checklist_config' && <AdminChecklistConfigManager user={user} />}
      {activeTab === 'efetivo' && <div className="rounded-[2rem] border border-slate-200 bg-white p-6"><h3 className="text-xl font-black text-lb-navy uppercase mb-6">Dimensionamento de efetivo</h3><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">{(Object.keys(DEFAULT_TARGETS) as EfetivoKey[]).map((key) => {const atual = efetivoAtual[key] || 0; const meta = targets[key] || 0; const falta = Math.max(meta - atual, 0); return <article key={key} className="rounded-2xl border border-slate-200 p-4 bg-white"><p className="text-[11px] font-black uppercase tracking-widest text-slate-500">{EFETIVO_LABELS[key]}</p><div className="mt-2"><p className="text-sm font-bold text-slate-500">Atual: <span className="text-lb-navy">{atual}</span></p><p className="text-sm font-bold text-slate-500">Meta: <input type="number" min={0} value={meta} onChange={(e) => setTargets((prev) => ({ ...prev, [key]: Number(e.target.value || 0) }))} className="w-20 ml-2 px-2 py-1 rounded border border-slate-300" /></p><p className={`text-sm font-black mt-1 ${falta > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{falta > 0 ? `Faltam ${falta}` : 'Completo'}</p></div></article>;})}</div></div>}

      {activeTab === 'aniversarios' && <div className="rounded-[2rem] border border-slate-200 bg-white p-6"><h3 className="text-xl font-black text-lb-navy uppercase mb-6">Aniversários do ano inteiro</h3><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{monthlyBirthdays.map((group) => <section key={group.month} className="rounded-2xl border border-slate-200 p-4 bg-slate-50"><div className="flex items-center justify-between mb-2"><h4 className="text-sm font-black uppercase text-lb-navy">{MONTHS[group.month]}</h4><span className="text-xs font-black px-2 py-1 rounded-full bg-cyan-500/15 text-cyan-700">{group.people.length}</span></div><div className="space-y-1 max-h-56 overflow-auto">{group.people.length === 0 ? <p className="text-xs text-slate-400">Sem aniversariantes</p> : group.people.map((p) => <p key={`${group.month}-${p.matricula}`} className="text-xs font-semibold text-slate-700">{p.nome} • {String(p.data_nasc || '').slice(8, 10)}/{String(p.data_nasc || '').slice(5, 7)}</p>)}</div></section>)}</div></div>}

      {activeTab === 'referencias' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REF_TABLES.map((table) => (
            <section key={table.key} className="rounded-[2rem] border border-slate-200 bg-white p-6">
              <h4 className="text-lg font-black text-lb-navy uppercase mb-4">{table.label}</h4>
              <div className="flex gap-2 mb-4">
                <input
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  placeholder={`Adicionar ${table.label.toLowerCase().slice(0, -1)}`}
                  value={refDraft[table.key] || ''}
                  onChange={(e) => setRefDraft((prev) => ({ ...prev, [table.key]: e.target.value }))}
                />
                <button
                  type="button"
                  onClick={() => addReferenceItem(table.key, table.label)}
                  disabled={refSaving}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-[11px] font-black uppercase"
                >
                  Adicionar
                </button>
              </div>
              <div className="space-y-2 max-h-[260px] overflow-auto">
                {refs[table.key].map((item, idx) => (
                  <div key={`${table.key}-${String(getReferenceRowIdentifier(item)?.value ?? idx)}`} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2">
                    <span className="text-sm font-semibold text-slate-700">{item.nome}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const rowId = getReferenceRowIdentifier(item);
                        if (rowId === null) {
                          setFeedback({ type: 'error', text: `Não foi possível identificar o ID em ${table.label}.` });
                          return;
                        }
                        removeReferenceItem(table.key, table.label, rowId.field, rowId.value);
                      }}
                      disabled={refSaving}
                      className="px-3 py-1 rounded-lg border border-red-200 text-red-600 text-[10px] font-black uppercase"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {activeTab === 'novo' && <div className="rounded-[2rem] border border-slate-200 bg-white p-6"><h4 className="text-xl font-black text-lb-navy uppercase mb-6">Criar novo servidor</h4><form onSubmit={async (e) => {e.preventDefault(); setNewServerSaving(true); try {const payload = { ...newServer }; delete payload.ultimo_acesso; if (!payload.matricula || !payload.nome || !payload.cpf) throw new Error('Preencha matrícula, nome e CPF.'); const res = await fetch(`${SUPABASE_URL}/rest/v1/servidores_v2`, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json', Prefer: 'return=representation' }, body: JSON.stringify(payload) }); if (!res.ok) throw new Error(await parseRequestError(res)); setFeedback({ type: 'success', text: 'Servidor criado com sucesso.' }); fetchData(); setActiveTab('servidores'); } catch (err: any) { setFeedback({ type: 'error', text: `Erro ao criar servidor: ${String(err?.message || 'falha na operação')}` }); } finally { setNewServerSaving(false); }}} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{orderedColumns.filter((field) => !HIDDEN_COLUMNS.has(field) && field !== 'ultimo_acesso').map((field) => renderInputForField(newServer, setNewServer, field))}<div className="md:col-span-2 xl:col-span-3 mt-3"><button type="submit" disabled={newServerSaving} className="px-6 py-3 rounded-xl bg-lb-navy text-white text-[11px] font-black uppercase tracking-widest disabled:opacity-60">{newServerSaving ? 'Criando...' : 'Criar servidor'}</button></div></form></div>}

      {isEditModalOpen && editingServer && <div className="modal-overlay fixed inset-0 z-[210] backdrop-blur-sm bg-slate-950/80 overscroll-none"><div ref={editModalContentRef} className="modal-content max-w-7xl w-[97%] max-h-[94vh] overflow-y-auto overscroll-contain rounded-[2.5rem] p-9 shadow-2xl scale-in-center border border-lb-navy/20"><span className="close-btn material-symbols-outlined text-3xl p-4 hover:text-red-500" onClick={() => setIsEditModalOpen(false)}>close</span><div className="mb-10 text-center bg-lb-navy/5 border border-lb-navy/10 rounded-3xl py-6 px-4"><h2 className="text-4xl font-black text-lb-navy uppercase tracking-tight">Dossiê completo do servidor</h2><p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2">Matrícula #{editingServer.matricula} • Último acesso: {formatDataHora(editingServer.ultimo_acesso)}</p></div><form onSubmit={async (e) => {e.preventDefault(); setSaveLoading(true); try {const payload = { ...editingServer }; delete payload.senha; delete payload.conf_senha; const res = await fetch(`${SUPABASE_URL}/rest/v1/servidores_v2?matricula=eq.${editingServer.matricula}`, { method: 'PATCH', headers: { ...headers, 'Content-Type': 'application/json', 'x-matricula-executor': String(user?.matricula || ''), 'x-executor-nome': String(user?.nome || '') }, body: JSON.stringify(payload) }); if (!res.ok) throw new Error(await parseRequestError(res)); setFeedback({ type: 'success', text: 'Servidor atualizado com sucesso.' }); setIsEditModalOpen(false); fetchData();} catch (err: any) {setFeedback({ type: 'error', text: `Erro ao atualizar servidor: ${String(err?.message || 'falha na operação')}` });} finally {setSaveLoading(false);}}} className="space-y-8"><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{orderedColumns.filter((f) => !HIDDEN_COLUMNS.has(f)).map((field) => renderInputForField(editingServer, setEditingServer, field))}</div><div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-3"><button type="button" onClick={() => setIsEditModalOpen(false)} className="py-4 bg-slate-100 text-slate-600 rounded-2xl text-[11px] font-black uppercase border border-slate-200">Cancelar</button><button type="button" onClick={async () => {setResetLoading(true); try {const res = await fetch(`${SUPABASE_URL}/rest/v1/servidores_v2?matricula=eq.${editingServer.matricula}`, { method: 'PATCH', headers: { ...headers, 'Content-Type': 'application/json', 'x-matricula-executor': String(user?.matricula || ''), 'x-executor-nome': String(user?.nome || '') }, body: JSON.stringify({ senha: null, conf_senha: null }) }); if (!res.ok) throw new Error(await parseRequestError(res)); setFeedback({ type: 'success', text: 'Senha resetada com sucesso.' });} catch (err: any) {setFeedback({ type: 'error', text: `Erro ao resetar senha: ${String(err?.message || 'falha na operação')}` });} finally {setResetLoading(false);}}} disabled={resetLoading} className="py-4 bg-amber-500 text-white rounded-2xl text-[11px] font-black uppercase disabled:opacity-70">{resetLoading ? 'Resetando...' : 'Resetar senha'}</button><button type="button" onClick={async () => {setDeactivateLoading(true); try {const nextStatus = normalizeText(String(editingServer.status || '')) === 'ATIVO' ? 'DESATIVADO' : 'ATIVO'; const res = await fetch(`${SUPABASE_URL}/rest/v1/servidores_v2?matricula=eq.${editingServer.matricula}`, { method: 'PATCH', headers: { ...headers, 'Content-Type': 'application/json', 'x-matricula-executor': String(user?.matricula || ''), 'x-executor-nome': String(user?.nome || '') }, body: JSON.stringify({ status: nextStatus }) }); if (!res.ok) throw new Error(await parseRequestError(res)); setEditingServer({ ...editingServer, status: nextStatus }); fetchData(); setFeedback({ type: 'success', text: `Servidor ${nextStatus === 'ATIVO' ? 'reativado' : 'desativado'} com sucesso.` });} catch (err: any) {setFeedback({ type: 'error', text: `Erro ao alterar status: ${String(err?.message || 'falha na operação')}` });} finally {setDeactivateLoading(false);}}} disabled={deactivateLoading} className="py-4 bg-red-600 text-white rounded-2xl text-[11px] font-black uppercase disabled:opacity-70">{deactivateLoading ? 'Atualizando...' : (normalizeText(String(editingServer.status || '')) === 'ATIVO' ? 'Desativar servidor' : 'Reativar servidor')}</button><button type="submit" disabled={saveLoading} className="py-4 bg-gradient-to-r from-lb-navy to-[#0d3a78] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest disabled:opacity-70">{saveLoading ? 'Sincronizando...' : 'Confirmar alterações'}</button></div></form></div></div>}
    </div>
  );
};

export default AdminDashboard;



















