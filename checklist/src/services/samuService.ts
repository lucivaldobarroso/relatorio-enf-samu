import { normalizar } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { ChecklistItem, ConfigChecklist, SubmitChecklist, TurnoKey, SHIFTS } from '@/types/samu';

/**
 * Get Boa Vista time (UTC-4)
 */
export function getBoaVistaTime() {
  const now = new Date();
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Boa_Vista',
      hour12: false,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
    const parts = formatter.formatToParts(now);
    const getPart = (type: string) => parts.find(p => p.type === type)?.value || '0';
    const h = parseInt(getPart('hour'));
    const m = parseInt(getPart('minute'));
    const bvDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Boa_Vista' }));
    return { hour: h, minute: m, date: bvDate };
  } catch {
    return { hour: now.getHours(), minute: now.getMinutes(), date: now };
  }
}

/**
 * Determine shift status based on Boa Vista time
 */
export function getShiftStatus(turno: TurnoKey): 'atual' | 'encerrando' | 'bloqueado' {
  const { hour } = getBoaVistaTime();
  const config = SHIFTS[turno];
  const hStart = config.start;
  const hEnd = config.end;

  if (turno !== 'NOITE') {
    if (hour >= hStart && hour < hEnd) return 'atual';
    if (hour >= hEnd && hour < hEnd + 1) return 'encerrando';
  } else {
    if (hour >= 18 || hour < 6) return 'atual';
    if (hour >= 6 && hour < 7) return 'encerrando';
  }
  return 'bloqueado';
}

/**
 * Fetch initial data: servidores names and vtrs
 */
export async function fetchDadosIniciais() {
  const [servidoresRes, vtrsRes] = await Promise.all([
    supabase.from('servidores').select('nome').order('nome'),
    supabase.from('vtrs').select('nome').order('id'),
  ]);
  return {
    nomes: (servidoresRes.data || []).map(s => s.nome),
    vtrs: (vtrsRes.data || []).map(v => v.nome),
  };
}

/**
 * Login: validate credentials
 */
export async function realizarLogin(dados: {
  nome: string;
  senha: string;
  tipoDesafio: string;
  valorDesafio: string;
  vtr: string;
}) {
  const { data: servidor, error } = await supabase
    .from('servidores')
    .select('*')
    .eq('nome', dados.nome)
    .maybeSingle();

  if (error || !servidor) return { logado: false, msg: 'Servidor não encontrado.' };
  if (!servidor.senha) return { logado: false, msg: 'Acesso não ativado. Cadastre sua senha primeiro.' };
  if (servidor.senha !== dados.senha) return { logado: false, msg: 'Senha incorreta.' };

  // Validate birth date challenge
  const dataNasc = new Date(servidor.data_nasc);
  const dia = String(dataNasc.getDate()).padStart(2, '0');
  const mes = String(dataNasc.getMonth() + 1).padStart(2, '0');
  const ano = String(dataNasc.getFullYear());

  let valorEsperado = '';
  if (dados.tipoDesafio === 'dia') valorEsperado = dia;
  if (dados.tipoDesafio === 'mes') valorEsperado = mes;
  if (dados.tipoDesafio === 'ano') valorEsperado = ano;

  if (dados.valorDesafio.trim() !== valorEsperado) {
    return { logado: false, msg: 'Resposta de segurança incorreta.' };
  }

  // Log access
  await supabase.from('logs_acesso').insert({
    nome_servidor: servidor.nome,
    vtr_selecionada: dados.vtr,
  });

  return {
    logado: true,
    nome: servidor.nome,
    profissao: servidor.profissao,
  };
}

/**
 * Validate identity for registration
 */
export async function validarIdentidadeCadastro(dados: {
  nome: string;
  profissao: string;
  cpf: string;
  dia: string;
  mes: string;
  ano: string;
}) {
  const { data: servidor, error } = await supabase
    .from('servidores')
    .select('*')
    .eq('nome', dados.nome)
    .maybeSingle();

  if (error || !servidor) return { sucess: false, msg: 'Servidor não encontrado no sistema.' };
  if (servidor.senha) return { sucess: false, msg: 'Este servidor já possui senha cadastrada.' };

  const profNorm = normalizar(dados.profissao);
  const profDBNorm = normalizar(servidor.profissao);
  if (profNorm !== profDBNorm) return { sucess: false, msg: 'Profissão não confere.' };
  if (dados.cpf.trim() !== servidor.cpf.trim()) return { sucess: false, msg: 'CPF não confere.' };

  const dataNasc = new Date(servidor.data_nasc);
  const dia = String(dataNasc.getDate()).padStart(2, '0');
  const mes = String(dataNasc.getMonth() + 1).padStart(2, '0');
  const ano = String(dataNasc.getFullYear());

  if (dados.dia.padStart(2, '0') !== dia || dados.mes.padStart(2, '0') !== mes || dados.ano !== ano) {
    return { sucess: false, msg: 'Data de nascimento não confere.' };
  }

  return { sucess: true, row: servidor.id };
}

/**
 * Register password
 */
export async function registrarSenha(id: number, senha: string) {
  const { error } = await supabase
    .from('servidores')
    .update({ senha, conf_senha: senha })
    .eq('id', id);

  if (error) return { sucess: false, msg: 'Erro ao salvar senha.' };
  return { sucess: true, msg: 'Senha cadastrada com sucesso! Faça login.' };
}

/**
 * Load checklist items with latest submit data
 */
export async function carregarItens(vtr: string, turno: string): Promise<ChecklistItem[]> {
  const { data: configItems, error } = await supabase
    .from('config_checklist')
    .select('*')
    .order('secao')
    .order('item');

  if (error || !configItems) return [];

  // Get today's date range for Boa Vista timezone
  const bvNow = getBoaVistaTime();
  const today = bvNow.date;
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  // Get recent submits for this VTR and turno
  const { data: recentSubmits } = await supabase
    .from('submits_checklist')
    .select('*')
    .eq('vtr', vtr)
    .eq('turno', turno)
    .gte('data_hora', startOfDay.toISOString())
    .order('data_hora', { ascending: false });

  // Get the most recent submit per item
  const lastSubmitByItem = new Map<string, SubmitChecklist>();
  (recentSubmits || []).forEach(s => {
    if (!lastSubmitByItem.has(s.item)) {
      lastSubmitByItem.set(s.item, s);
    }
  });

  // Also get last submit regardless of turno for "ultimo_submit" display
  const { data: allRecentSubmits } = await supabase
    .from('submits_checklist')
    .select('servidor, data_hora, item, secao')
    .eq('vtr', vtr)
    .order('data_hora', { ascending: false })
    .limit(200);

  const lastSubmitBySection = new Map<string, { nome: string; data: string }>();
  (allRecentSubmits || []).forEach(s => {
    if (!lastSubmitBySection.has(s.secao)) {
      lastSubmitBySection.set(s.secao, {
        nome: s.servidor,
        data: new Date(s.data_hora).toLocaleString('pt-BR', { timeZone: 'America/Boa_Vista' }),
      });
    }
  });

  return configItems.map((config: ConfigChecklist) => {
    const lastSubmit = lastSubmitByItem.get(config.item);
    return {
      ...config,
      inicio_vtr: lastSubmit ? lastSubmit.saldo_final : null,
      concluido_turno: !!lastSubmit,
      ultimo_submit: lastSubmitBySection.get(config.secao),
    };
  });
}

/**
 * Save checklist data
 */
export async function salvarChecklist(dados: {
  servidor: string;
  vtr: string;
  turno: string;
  profissao: string;
  bypass_trava: boolean;
  perfil_cme: boolean;
  itens: Array<{
    secao: string;
    item: string;
    inicio: number;
    gasto: number;
    reposicao: number;
    inconstancia: number;
    excesso: number;
    retirar: number;
    inconsistencia_msg: string;
    saldo_final: number;
  }>;
}) {
  const profNorm = normalizar(dados.profissao);
  const prefixoId = (() => {
    if (profNorm.includes('COORD')) return 'COORD';
    if (profNorm.includes('MEDICO')) return 'MED';
    if (profNorm.includes('ENFERMEIRO')) return 'ENF';
    if (profNorm.includes('CONDUTOR')) return 'COND';
    if (profNorm.includes('TECNICO')) return 'TEC';
    return 'USR';
  })();

  const now = new Date().toISOString();
  const records = dados.itens.map((item, index) => ({
    id:
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? `${prefixoId}-${dados.vtr}-${crypto.randomUUID()}`
        : `${prefixoId}-${dados.vtr}-${Date.now()}-${index + 1}-${Math.random().toString(36).slice(2, 8)}`,
    data_hora: now,
    servidor: dados.servidor,
    vtr: dados.vtr,
    turno: dados.turno,
    secao: item.secao,
    item: item.item,
    inicio: item.inicio,
    gasto: item.gasto,
    reposicao: item.reposicao,
    excesso: item.excesso,
    inconsistencia: item.inconstancia,
    retirar: item.retirar,
    situacao: item.inconsistencia_msg,
    bypass_trava: dados.bypass_trava,
    perfil_envio: dados.perfil_cme ? 'CME' : dados.profissao,
    saldo_final: item.saldo_final,
  }));

  const { error } = await supabase.from('submits_checklist').insert(records);
  if (error) {
    console.error('Erro ao salvar:', error);
    return { sucesso: false, msg: error.message };
  }
  return { sucesso: true };
}

/**
 * Get recent history for a VTR
 */
export async function obterHistoricoRecente(vtr: string) {
  const { data: logs } = await supabase
    .from('logs_acesso')
    .select('*')
    .eq('vtr_selecionada', vtr)
    .order('data_hora', { ascending: false })
    .limit(10);

  if (!logs || logs.length === 0) return [];

  // For each log, find which sections were completed
  const results = await Promise.all(
    logs.map(async (log) => {
      const logDate = new Date(log.data_hora);
      const startOfDay = new Date(logDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(logDate);
      endOfDay.setHours(23, 59, 59, 999);

      const { data: submits } = await supabase
        .from('submits_checklist')
        .select('secao')
        .eq('vtr', vtr)
        .eq('servidor', log.nome_servidor)
        .gte('data_hora', startOfDay.toISOString())
        .lte('data_hora', endOfDay.toISOString());

      const secoesOk = [...new Set((submits || []).map(s => s.secao))];

      return {
        nome: log.nome_servidor,
        profissao: 'Servidor',
        turno: '---',
        data: new Date(log.data_hora).toLocaleString('pt-BR', { timeZone: 'America/Boa_Vista' }),
        secoes_ok: secoesOk,
      };
    })
  );

  return results;
}

export interface RankingProfissaoEntry {
  nome: string;
  acessos: number;
  concluidos: number;
  taxaConclusao: number;
}

export interface ItemAjustadoEntry {
  item: string;
  secao: string;
  ajustes: number;
}

export interface TurnoIncompletoEntry {
  servidor: string;
  turno: string;
  data: string;
  secoesConcluidas: number;
  totalSecoes: number;
}

export interface PicoAcessoEntry {
  hora: string;
  acessos: number;
}

export interface RastreioAntecessorEntry {
  data: string;
  turno: string;
  antecessor: string;
  sucessor: string;
  intervaloMin: number;
}

export interface DashboardEstatisticoData {
  totalAcessos: number;
  sessoesConcluidas: number;
  sessoesIncompletas: number;
  taxaConclusaoGeral: number;
  tempoMedioChecklistMin: number;
  itensMaisAjustados: ItemAjustadoEntry[];
  rankingMedicamentos: ItemAjustadoEntry[];
  rankingPsicotropicos: ItemAjustadoEntry[];
  picosAcesso: PicoAcessoEntry[];
  rastreioAntecessor: RastreioAntecessorEntry[];
  rankingEnfermeiros: RankingProfissaoEntry[];
  rankingMedicos: RankingProfissaoEntry[];
  turnosIncompletos: TurnoIncompletoEntry[];
}

type SessionAgg = {
  key: string;
  servidor: string;
  turno: string;
  dateKey: string;
  minTs: number;
  maxTs: number;
  secoes: Set<string>;
};

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

function toBvDateKey(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString('sv-SE', { timeZone: 'America/Boa_Vista' });
}

function isProfissao(normProf: string, key: 'ENFERMEIRO' | 'MEDICO') {
  if (key === 'ENFERMEIRO') return normProf.includes('ENFERMEIRO');
  return normProf.includes('MEDICO') || normProf.includes('MÉDICO');
}

export async function obterDashboardEstatistico(vtr: string, days = 30): Promise<DashboardEstatisticoData> {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - Math.max(days, 1));

  const [configRes, submitsRes, logsRes, servidoresRes] = await Promise.all([
    supabase.from('config_checklist').select('secao,item'),
    supabase
      .from('submits_checklist')
      .select('data_hora,servidor,turno,secao,item,gasto,reposicao,excesso,inconsistencia,retirar,vtr')
      .eq('vtr', vtr)
      .gte('data_hora', start.toISOString())
      .order('data_hora', { ascending: true }),
    supabase
      .from('logs_acesso')
      .select('data_hora,nome_servidor,vtr_selecionada')
      .eq('vtr_selecionada', vtr)
      .gte('data_hora', start.toISOString())
      .order('data_hora', { ascending: true }),
    supabase.from('servidores').select('nome,profissao'),
  ]);

  const configRows = configRes.data || [];
  const submits = submitsRes.data || [];
  const logs = logsRes.data || [];
  const servidores = servidoresRes.data || [];

  const totalSecoes = new Set(configRows.map(c => c.secao)).size || 1;

  const accessByName = new Map<string, number>();
  const accessesByHour = new Map<number, number>();
  logs.forEach(log => {
    const nome = String(log.nome_servidor || '');
    accessByName.set(nome, (accessByName.get(nome) || 0) + 1);

    const hour = parseInt(
      new Date(log.data_hora).toLocaleTimeString('en-GB', {
        timeZone: 'America/Boa_Vista',
        hour: '2-digit',
        hour12: false,
      }),
      10,
    );
    accessesByHour.set(hour, (accessesByHour.get(hour) || 0) + 1);
  });

  const sessions = new Map<string, SessionAgg>();
  const ajustesByItem = new Map<string, ItemAjustadoEntry>();
  const medsMap = new Map<string, ItemAjustadoEntry>();
  const psychoMap = new Map<string, ItemAjustadoEntry>();

  submits.forEach(row => {
    const dateKey = toBvDateKey(row.data_hora);
    const key = `${row.servidor}__${row.turno}__${dateKey}`;
    const ts = new Date(row.data_hora).getTime();
    const secao = String(row.secao || '');
    const item = String(row.item || '');

    const existing = sessions.get(key);
    if (!existing) {
      sessions.set(key, {
        key,
        servidor: String(row.servidor || ''),
        turno: String(row.turno || ''),
        dateKey,
        minTs: ts,
        maxTs: ts,
        secoes: new Set([secao]),
      });
    } else {
      existing.minTs = Math.min(existing.minTs, ts);
      existing.maxTs = Math.max(existing.maxTs, ts);
      existing.secoes.add(secao);
    }

    const ajuste =
      Math.abs(Number(row.reposicao || 0)) +
      Math.abs(Number(row.excesso || 0)) +
      Math.abs(Number(row.retirar || 0)) +
      Math.abs(Number(row.inconsistencia || 0));

    if (ajuste > 0) {
      const keyItem = `${secao}__${item}`;
      const agg = ajustesByItem.get(keyItem) || { item, secao, ajustes: 0 };
      agg.ajustes += ajuste;
      ajustesByItem.set(keyItem, agg);

      const secaoNorm = normalizar(secao);
      const targetMap =
        secaoNorm.includes('PSICOTROP') || secaoNorm.includes('CONTROLADO')
          ? psychoMap
          : secaoNorm.includes('MEDIC')
            ? medsMap
            : null;

      if (targetMap) {
        const aggRank = targetMap.get(keyItem) || { item, secao, ajustes: 0 };
        aggRank.ajustes += ajuste + Math.abs(Number(row.gasto || 0));
        targetMap.set(keyItem, aggRank);
      }
    }
  });

  const sessionList = Array.from(sessions.values());
  const completedSessions = sessionList.filter(s => s.secoes.size >= totalSecoes);
  const incompleteSessions = sessionList.filter(s => s.secoes.size < totalSecoes);

  const completedByName = new Map<string, number>();
  completedSessions.forEach(s => {
    completedByName.set(s.servidor, (completedByName.get(s.servidor) || 0) + 1);
  });

  const avgTimeMin =
    completedSessions.length > 0
      ? round2(
          completedSessions.reduce((sum, s) => sum + (s.maxTs - s.minTs) / 60000, 0) / completedSessions.length,
        )
      : 0;

  const servidoresByProf = {
    ENFERMEIRO: new Set<string>(),
    MEDICO: new Set<string>(),
  };
  servidores.forEach(s => {
    const nome = String(s.nome || '');
    const profNorm = normalizar(String(s.profissao || ''));
    if (isProfissao(profNorm, 'ENFERMEIRO')) servidoresByProf.ENFERMEIRO.add(nome);
    if (isProfissao(profNorm, 'MEDICO')) servidoresByProf.MEDICO.add(nome);
  });

  const buildRankingProf = (profKey: 'ENFERMEIRO' | 'MEDICO') => {
    const names = Array.from(servidoresByProf[profKey]);
    return names
      .map(nome => {
        const acessos = accessByName.get(nome) || 0;
        const concluidos = completedByName.get(nome) || 0;
        const taxaConclusao = acessos > 0 ? round2((concluidos / acessos) * 100) : 0;
        return { nome, acessos, concluidos, taxaConclusao };
      })
      .sort((a, b) => {
        if (b.concluidos !== a.concluidos) return b.concluidos - a.concluidos;
        if (b.taxaConclusao !== a.taxaConclusao) return b.taxaConclusao - a.taxaConclusao;
        return b.acessos - a.acessos;
      })
      .slice(0, 10);
  };

  const toTopList = (map: Map<string, ItemAjustadoEntry>, limit = 10) =>
    Array.from(map.values())
      .sort((a, b) => b.ajustes - a.ajustes)
      .slice(0, limit);

  const picosAcesso = Array.from({ length: 24 }, (_, hour) => ({
    hora: `${String(hour).padStart(2, '0')}:00`,
    acessos: accessesByHour.get(hour) || 0,
  }));

  const rastreioAntecessor: RastreioAntecessorEntry[] = [];
  const sessionsByDateTurno = new Map<string, SessionAgg[]>();
  sessionList.forEach(s => {
    const key = `${s.dateKey}__${s.turno}`;
    const arr = sessionsByDateTurno.get(key) || [];
    arr.push(s);
    sessionsByDateTurno.set(key, arr);
  });

  Array.from(sessionsByDateTurno.values()).forEach(group => {
    group.sort((a, b) => a.minTs - b.minTs);
    for (let i = 1; i < group.length; i += 1) {
      const prev = group[i - 1];
      const curr = group[i];
      rastreioAntecessor.push({
        data: curr.dateKey,
        turno: curr.turno,
        antecessor: prev.servidor,
        sucessor: curr.servidor,
        intervaloMin: round2((curr.minTs - prev.maxTs) / 60000),
      });
    }
  });

  rastreioAntecessor.sort((a, b) => {
    const da = new Date(`${a.data}T00:00:00`).getTime();
    const db = new Date(`${b.data}T00:00:00`).getTime();
    return db - da;
  });

  const turnosIncompletos = incompleteSessions
    .map(s => ({
      servidor: s.servidor,
      turno: s.turno,
      data: s.dateKey,
      secoesConcluidas: s.secoes.size,
      totalSecoes,
    }))
    .sort((a, b) => {
      const sa = a.secoesConcluidas / a.totalSecoes;
      const sb = b.secoesConcluidas / b.totalSecoes;
      return sa - sb;
    })
    .slice(0, 20);

  const sessoesConcluidas = completedSessions.length;
  const sessoesIncompletas = incompleteSessions.length;
  const totalSessoes = sessoesConcluidas + sessoesIncompletas;

  return {
    totalAcessos: logs.length,
    sessoesConcluidas,
    sessoesIncompletas,
    taxaConclusaoGeral: totalSessoes > 0 ? round2((sessoesConcluidas / totalSessoes) * 100) : 0,
    tempoMedioChecklistMin: avgTimeMin,
    itensMaisAjustados: toTopList(ajustesByItem),
    rankingMedicamentos: toTopList(medsMap),
    rankingPsicotropicos: toTopList(psychoMap),
    picosAcesso,
    rastreioAntecessor: rastreioAntecessor.slice(0, 20),
    rankingEnfermeiros: buildRankingProf('ENFERMEIRO'),
    rankingMedicos: buildRankingProf('MEDICO'),
    turnosIncompletos,
  };
}

