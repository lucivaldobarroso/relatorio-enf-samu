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
    codigo_servidor: servidor.codigo_servidor || null,
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

  // Define start window by shift in Boa Vista timezone.
  // For NOITE, keep the same shift across midnight (18:00 -> 06:00).
  const bvNow = getBoaVistaTime();
  const today = bvNow.date;
  const turnoNorm = normalizar(turno);
  const startWindow = new Date(today);
  if (turnoNorm === 'NOITE') {
    if (bvNow.hour < 6) {
      startWindow.setDate(startWindow.getDate() - 1);
    }
    startWindow.setHours(18, 0, 0, 0);
  } else {
    startWindow.setHours(0, 0, 0, 0);
  }

  // Get recent submits for this VTR and turno
  const { data: recentSubmits } = await supabase
    .from('submits_checklist')
    .select('*')
    .eq('vtr', vtr)
    .eq('turno', turno)
    .gte('data_hora', startWindow.toISOString())
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

  const obterUltimoNumero = async () => {
    const prefixoBase = `${prefixoId}-${dados.vtr}-`;
    const { data: ids, error } = await supabase
      .from('submits_checklist')
      .select('id')
      .like('id', `${prefixoBase}%`)
      .order('data_hora', { ascending: false })
      .limit(500);

    if (error || !ids?.length) return 0;

    let maxNumero = 0;
    ids.forEach(({ id }) => {
      const rawId = String(id || '');
      if (!rawId.startsWith(prefixoBase)) return;
      const sufixo = rawId.slice(prefixoBase.length);
      const match = sufixo.match(/^(\d+)$/);
      if (match) {
        const numero = parseInt(match[1], 10);
        if (!Number.isNaN(numero) && numero > maxNumero) {
          maxNumero = numero;
        }
      }
    });

    return maxNumero;
  };

  const montarRegistros = (numeroInicial: number) => {
    const now = new Date().toISOString();
    return dados.itens.map((item, index) => ({
      id: `${prefixoId}-${dados.vtr}-${numeroInicial + index + 1}`,
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
  };

  const inserirRegistros = async () => {
    const numeroAtual = await obterUltimoNumero();
    const records = montarRegistros(numeroAtual);
    return supabase.from('submits_checklist').insert(records);
  };

  let { error } = await inserirRegistros();

  // Retry curto para colisão eventual entre gravações simultâneas.
  if (error?.message?.includes('duplicate key value violates unique constraint')) {
    ({ error } = await inserirRegistros());
  }

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
    .limit(80);

  if (!logs || logs.length === 0) return [];

  const nomes = [...new Set(logs.map((l) => String(l.nome_servidor || '')).filter(Boolean))];
  const { data: servidores } = await supabase
    .from('servidores')
    .select('nome,profissao,codigo_servidor')
    .in('nome', nomes);

  const profissaoPorNome = new Map<string, string>();
  const codigoPorNome = new Map<string, string>();
  (servidores || []).forEach((s) => {
    profissaoPorNome.set(String(s.nome || ''), String(s.profissao || 'Servidor'));
    codigoPorNome.set(String(s.nome || ''), String(s.codigo_servidor || ''));
  });

  const { data: configItems } = await supabase
    .from('config_checklist')
    .select('secao,item,estoque');

  const totalItensPorSecao = new Map<string, number>();
  (configItems || []).forEach((cfg) => {
    const secao = String(cfg.secao || '');
    const estoqueNorm = normalizar(String((cfg as { estoque?: string }).estoque || ''));
    if (!secao) return;
    if (estoqueNorm === 'NAO TEM') return;
    totalItensPorSecao.set(secao, (totalItensPorSecao.get(secao) || 0) + 1);
  });

  const turnoOrder: Record<string, number> = { MANHA: 1, TARDE: 2, DIA: 3, NOITE: 4 };

  // For each log, classify each section as complete / incomplete / missing
  const results = await Promise.all(
    logs.map(async (log) => {
      const logDate = new Date(log.data_hora);
      const bvHour = parseInt(
        logDate.toLocaleTimeString('en-GB', {
          timeZone: 'America/Boa_Vista',
          hour: '2-digit',
          hour12: false,
        }),
        10,
      );
      const shiftDate = new Date(logDate);
      const startOfRange = new Date(logDate);
      const endOfRange = new Date(logDate);

      if (bvHour >= 18) {
        startOfRange.setHours(18, 0, 0, 0);
        endOfRange.setDate(endOfRange.getDate() + 1);
        endOfRange.setHours(6, 59, 59, 999);
      } else if (bvHour < 6) {
        shiftDate.setDate(shiftDate.getDate() - 1);
        startOfRange.setDate(startOfRange.getDate() - 1);
        startOfRange.setHours(18, 0, 0, 0);
        endOfRange.setHours(6, 59, 59, 999);
      } else {
        startOfRange.setHours(0, 0, 0, 0);
        endOfRange.setHours(23, 59, 59, 999);
      }

      const { data: submits } = await supabase
        .from('submits_checklist')
        .select('secao,item,turno,data_hora,servidor')
        .eq('vtr', vtr)
        .gte('data_hora', startOfRange.toISOString())
        .lte('data_hora', endOfRange.toISOString());

      const submitsOrdenados = [...(submits || [])].sort(
        (a, b) => new Date(String(b.data_hora || '')).getTime() - new Date(String(a.data_hora || '')).getTime(),
      );
      const submitsServidor = submitsOrdenados.filter(
        (s) => String((s as { servidor?: string }).servidor || '') === String(log.nome_servidor || ''),
      );
      const turnoDetectado = String(submitsServidor[0]?.turno || submitsOrdenados[0]?.turno || (bvHour >= 18 || bvHour < 6 ? 'NOITE' : '---'));
      const submitsDoTurno =
        turnoDetectado === '---'
          ? submitsOrdenados
          : submitsOrdenados.filter((s) => String(s.turno || '') === turnoDetectado);

      const ultimoSubmitTurno = submitsDoTurno[0];
      const primeiroSubmitTurno = submitsDoTurno[submitsDoTurno.length - 1];
      const tempoSessaoMin = (() => {
        if (!ultimoSubmitTurno || !primeiroSubmitTurno) return 0;
        const fim = new Date(String(ultimoSubmitTurno.data_hora || '')).getTime();
        const inicio = new Date(String(primeiroSubmitTurno.data_hora || '')).getTime();
        if (Number.isNaN(fim) || Number.isNaN(inicio) || fim < inicio) return 0;
        return Math.round((fim - inicio) / 60000);
      })();

      const itensPorSecao = new Map<string, Set<string>>();
      submitsDoTurno.forEach((row) => {
        const secao = String(row.secao || '');
        const item = String(row.item || '');
        if (!secao || !item) return;
        if (!itensPorSecao.has(secao)) itensPorSecao.set(secao, new Set<string>());
        itensPorSecao.get(secao)!.add(item);
      });

      const secoesOk: string[] = [];
      const secoesIncompletas: string[] = [];

      totalItensPorSecao.forEach((totalItens, secao) => {
        const enviados = itensPorSecao.get(secao)?.size || 0;
        if (totalItens === 0) {
          secoesOk.push(secao);
          return;
        }
        if (enviados >= totalItens && totalItens > 0) {
          secoesOk.push(secao);
        } else if (enviados > 0 && enviados < totalItens) {
          secoesIncompletas.push(secao);
        }
      });

      const totalSecoes = totalItensPorSecao.size || 1;
      const secoesConcluidas = secoesOk.length;
      const percentualConclusao = Math.round((secoesConcluidas / totalSecoes) * 100);

      return {
        nome: log.nome_servidor,
        profissao: profissaoPorNome.get(String(log.nome_servidor || '')) || 'Servidor',
        codigo_servidor: codigoPorNome.get(String(log.nome_servidor || '')) || '',
        turno: turnoDetectado,
        data: new Date(log.data_hora).toLocaleString('pt-BR', { timeZone: 'America/Boa_Vista' }),
        ts: new Date(log.data_hora).getTime(),
        dateKey: shiftDate.toLocaleDateString('sv-SE', { timeZone: 'America/Boa_Vista' }),
        secoes_ok: secoesOk,
        secoes_incompletas: secoesIncompletas,
        resumo_conclusao: `${secoesConcluidas}/${totalSecoes} secoes (${percentualConclusao}%)`,
        tempo_sessao_min: tempoSessaoMin,
        ultima_secao: String(ultimoSubmitTurno?.secao || '---'),
        ultima_secao_hora: ultimoSubmitTurno?.data_hora
          ? new Date(String(ultimoSubmitTurno.data_hora)).toLocaleTimeString('pt-BR', {
              timeZone: 'America/Boa_Vista',
              hour: '2-digit',
              minute: '2-digit',
            })
          : '--:--',
      };
    })
  );

  const dedup = new Map<string, (typeof results)[number]>();
  results.forEach((row) => {
    const turnoNorm = normalizar(String(row.turno || '---'));
    const turnoKey = turnoNorm in turnoOrder ? turnoNorm : '---';
    const key = `${row.nome}__${row.dateKey}__${turnoKey}`;
    const existing = dedup.get(key);
    if (!existing || row.ts > existing.ts) {
      dedup.set(key, row);
    }
  });

  return Array.from(dedup.values())
    .sort((a, b) => b.ts - a.ts)
    .slice(0, 10)
    .map(({ ts, dateKey, ...row }) => row);
}

export interface RankingProfissaoEntry {
  nome: string;
  acessos: number;
  concluidos: string;
  incompletos: number;
  naoRealizados: number;
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
  rastreioAntecessorEnfermeiros: RastreioAntecessorEntry[];
  rastreioAntecessorMedicos: RastreioAntecessorEntry[];
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

function isEnfermeiroProf(normProf: string) {
  return normProf.includes('ENFERMEIRO');
}

function isMedicoProf(normProf: string) {
  return normProf.includes('MEDICO') || normProf.includes('MÃ‰DICO');
}

function isSecaoEquipe(responsavelNorm: string) {
  return (
    responsavelNorm.includes('EQUIPE') ||
    responsavelNorm.includes('TODOS') ||
    responsavelNorm.includes('AMBOS') ||
    responsavelNorm.includes('GERAL') ||
    responsavelNorm.includes('USA')
  );
}

function responsavelCombinaComProfissao(responsavelNorm: string, profissaoNorm: string) {
  if (!responsavelNorm) return true;
  if (profissaoNorm.includes('COORD')) return true;
  if (isSecaoEquipe(responsavelNorm)) return true;
  if (profissaoNorm.includes('ENFERMEIRO') && responsavelNorm.includes('ENFERMEIRO')) return true;
  if ((profissaoNorm.includes('MEDICO') || profissaoNorm.includes('MÉDICO')) && (responsavelNorm.includes('MEDICO') || responsavelNorm.includes('MÉDICO'))) return true;
  if (profissaoNorm.includes('CONDUTOR') && responsavelNorm.includes('CONDUTOR')) return true;
  if (profissaoNorm.includes('TECNICO') && (responsavelNorm.includes('TECNICO') || responsavelNorm.includes('ENFERMAG'))) return true;
  return false;
}

export async function obterDashboardEstatistico(vtr: string, days = 30): Promise<DashboardEstatisticoData> {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - Math.max(days, 1));

  const [configRes, submitsRes, logsRes, servidoresRes] = await Promise.all([
    supabase.from('config_checklist').select('secao,item,responsavel,estoque'),
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
  const secoesSet = new Set<string>(configRows.map(c => String(c.secao || '')).filter(Boolean));
  const responsaveisPorSecao = new Map<string, Set<string>>();
  const totalItensPorSecao = new Map<string, number>();
  configRows.forEach((row) => {
    const secao = String(row.secao || '');
    const estoqueNorm = normalizar(String((row as { estoque?: string }).estoque || ''));
    if (!secao) return;
    const respNorm = normalizar(String((row as { responsavel?: string }).responsavel || ''));
    if (!responsaveisPorSecao.has(secao)) responsaveisPorSecao.set(secao, new Set<string>());
    if (respNorm) responsaveisPorSecao.get(secao)!.add(respNorm);
    if (estoqueNorm !== 'NAO TEM') {
      totalItensPorSecao.set(secao, (totalItensPorSecao.get(secao) || 0) + 1);
    }
  });

  const accessesByHour = new Map<number, number>();
  logs.forEach(log => {
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
  const secoesPorTurnoData = new Map<string, Set<string>>();
  const itensPorSecaoTurnoData = new Map<string, Map<string, Set<string>>>();
  const ajustesByItem = new Map<string, ItemAjustadoEntry>();
  const medsMap = new Map<string, ItemAjustadoEntry>();
  const psychoMap = new Map<string, ItemAjustadoEntry>();

  submits.forEach(row => {
    const dateKey = toBvDateKey(row.data_hora);
    const key = `${row.servidor}__${row.turno}__${dateKey}`;
    const keyTurnoData = `${row.turno}__${dateKey}`;
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

    if (!secoesPorTurnoData.has(keyTurnoData)) {
      secoesPorTurnoData.set(keyTurnoData, new Set<string>());
    }
    secoesPorTurnoData.get(keyTurnoData)!.add(secao);

    if (!itensPorSecaoTurnoData.has(keyTurnoData)) {
      itensPorSecaoTurnoData.set(keyTurnoData, new Map<string, Set<string>>());
    }
    const mapaTurno = itensPorSecaoTurnoData.get(keyTurnoData)!;
    if (!mapaTurno.has(secao)) mapaTurno.set(secao, new Set<string>());
    if (item) mapaTurno.get(secao)!.add(item);

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
  const sessoesGeraisMap = new Map<string, { minTs: number; maxTs: number; secoes: Set<string> }>();
  submits.forEach((row) => {
    const dateKey = toBvDateKey(row.data_hora);
    const keyTurnoData = `${row.turno}__${dateKey}`;
    const ts = new Date(row.data_hora).getTime();
    const secao = String(row.secao || '');
    const existing = sessoesGeraisMap.get(keyTurnoData);
    if (!existing) {
      sessoesGeraisMap.set(keyTurnoData, { minTs: ts, maxTs: ts, secoes: new Set(secao ? [secao] : []) });
    } else {
      existing.minTs = Math.min(existing.minTs, ts);
      existing.maxTs = Math.max(existing.maxTs, ts);
      if (secao) existing.secoes.add(secao);
    }
  });
  const sessoesGerais = Array.from(sessoesGeraisMap.values());
  const completedSessions = sessoesGerais.filter(s => s.secoes.size >= totalSecoes);
  const incompleteSessions = sessoesGerais.filter(s => s.secoes.size < totalSecoes);

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
  const profissaoNormPorNome = new Map<string, string>();
  const profissaoNormPorNomeNormalizado = new Map<string, string>();
  servidores.forEach(s => {
    const nome = String(s.nome || '');
    const profNorm = normalizar(String(s.profissao || ''));
    profissaoNormPorNome.set(nome, profNorm);
    profissaoNormPorNomeNormalizado.set(normalizar(nome), profNorm);
    if (isProfissao(profNorm, 'ENFERMEIRO')) servidoresByProf.ENFERMEIRO.add(nome);
    if (isProfissao(profNorm, 'MEDICO')) servidoresByProf.MEDICO.add(nome);
  });

  const getProfissaoNormByNome = (nome: string) =>
    profissaoNormPorNome.get(nome) || profissaoNormPorNomeNormalizado.get(normalizar(nome)) || '';

  const getSecoesAplicaveis = (servidor: string) => {
    const profNorm = profissaoNormPorNome.get(servidor) || '';
    const secoesAplicaveis = new Set<string>();
    secoesSet.forEach((secao) => {
      const responsaveis = responsaveisPorSecao.get(secao);
      if (!responsaveis || responsaveis.size === 0) {
        secoesAplicaveis.add(secao);
        return;
      }
      let aplica = false;
      responsaveis.forEach((respNorm) => {
        if (responsavelCombinaComProfissao(respNorm, profNorm)) aplica = true;
      });
      if (aplica) secoesAplicaveis.add(secao);
    });
    if (secoesAplicaveis.size === 0) return new Set<string>(secoesSet);
    return secoesAplicaveis;
  };

  const sessionSummaryByKey = new Map<
    string,
    {
      secoesConcluidas: number;
      secoesIncompletas: number;
      secoesNaoRealizadas: number;
      totalSecoes: number;
      concluido: boolean;
      taxaConclusao: number;
    }
  >();
  sessionList.forEach((s) => {
    const keyTurnoData = `${s.turno}__${s.dateKey}`;
    const secoesConcluidasNoTurno = secoesPorTurnoData.get(keyTurnoData) || s.secoes;
    const itensDoTurno = itensPorSecaoTurnoData.get(keyTurnoData) || new Map<string, Set<string>>();
    const aplicaveis = getSecoesAplicaveis(s.servidor);
    let concluidas = 0;
    let incompletas = 0;
    let naoRealizadas = 0;
    aplicaveis.forEach((secao) => {
      const totalItensSecao = totalItensPorSecao.get(secao) || 0;
      const enviados = itensDoTurno.get(secao)?.size || (secoesConcluidasNoTurno.has(secao) ? 1 : 0);
      if (totalItensSecao <= 0) {
        concluidas += 1;
      } else if (enviados >= totalItensSecao) {
        concluidas += 1;
      } else if (enviados > 0) {
        incompletas += 1;
      } else {
        naoRealizadas += 1;
      }
    });
    const totalAplicavel = aplicaveis.size || 1;
    const concluidoAplicavel = concluidas >= totalAplicavel;
    const taxaConclusao = totalAplicavel > 0 ? round2((concluidas / totalAplicavel) * 100) : 0;
    sessionSummaryByKey.set(s.key, {
      secoesConcluidas: concluidas,
      secoesIncompletas: incompletas,
      secoesNaoRealizadas: naoRealizadas,
      totalSecoes: totalAplicavel,
      concluido: concluidoAplicavel,
      taxaConclusao,
    });
  });

  const acessosPorSessaoNome = new Map<string, number>();
  const ultimaSessaoPorNome = new Map<string, SessionAgg>();
  sessionList.forEach((s) => {
    acessosPorSessaoNome.set(s.servidor, (acessosPorSessaoNome.get(s.servidor) || 0) + 1);
    const atual = ultimaSessaoPorNome.get(s.servidor);
    if (!atual || s.maxTs > atual.maxTs) {
      ultimaSessaoPorNome.set(s.servidor, s);
    }
  });

  const incompleteSessionsAplicavel = sessionList.filter((s) => {
    const resumo = sessionSummaryByKey.get(s.key);
    if (!resumo) return true;
    if (resumo.concluido) {
      return false;
    }
    return true;
  });

  const buildRankingProf = (profKey: 'ENFERMEIRO' | 'MEDICO') => {
    const names = Array.from(servidoresByProf[profKey]);
    return names
      .map(nome => {
        const acessos = acessosPorSessaoNome.get(nome) || 0;
        const ultimaSessao = ultimaSessaoPorNome.get(nome);
        const resumoUltima = ultimaSessao ? sessionSummaryByKey.get(ultimaSessao.key) : null;
        const secoesConcluidas = resumoUltima?.secoesConcluidas || 0;
        const totalSecoesAplicaveis = resumoUltima?.totalSecoes || 0;
        const incompletos = resumoUltima?.secoesIncompletas || 0;
        const naoRealizados = resumoUltima?.secoesNaoRealizadas || 0;
        const taxaConclusao =
          totalSecoesAplicaveis > 0 ? round2((secoesConcluidas / totalSecoesAplicaveis) * 100) : 0;
        return {
          nome,
          acessos,
          concluidos: `${secoesConcluidas}/${totalSecoesAplicaveis}`,
          incompletos,
          naoRealizados,
          taxaConclusao,
        };
      })
      .sort((a, b) => {
        if (b.taxaConclusao !== a.taxaConclusao) return b.taxaConclusao - a.taxaConclusao;
        if (b.incompletos !== a.incompletos) return a.incompletos - b.incompletos;
        if (b.naoRealizados !== a.naoRealizados) return a.naoRealizados - b.naoRealizados;
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

  const rastreioAntecessorEnfermeiros = rastreioAntecessor.filter((r) => {
    const profSucessor = getProfissaoNormByNome(String(r.sucessor || ''));
    return isEnfermeiroProf(profSucessor);
  });

  const rastreioAntecessorMedicos = rastreioAntecessor.filter((r) => {
    const profSucessor = getProfissaoNormByNome(String(r.sucessor || ''));
    return isMedicoProf(profSucessor);
  });

  const turnosIncompletos = incompleteSessionsAplicavel
    .map(s => ({
      servidor: s.servidor,
      turno: s.turno,
      data: s.dateKey,
      secoesConcluidas: sessionSummaryByKey.get(s.key)?.secoesConcluidas || 0,
      totalSecoes: sessionSummaryByKey.get(s.key)?.totalSecoes || totalSecoes,
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
    rastreioAntecessorEnfermeiros: rastreioAntecessorEnfermeiros.slice(0, 20),
    rastreioAntecessorMedicos: rastreioAntecessorMedicos.slice(0, 20),
    rankingEnfermeiros: buildRankingProf('ENFERMEIRO'),
    rankingMedicos: buildRankingProf('MEDICO'),
    turnosIncompletos,
  };
}




