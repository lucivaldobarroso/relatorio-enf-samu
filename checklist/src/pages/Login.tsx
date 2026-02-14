import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession, fetchDadosIniciais, realizarLogin, validarIdentidadeCadastro, registrarSenha } from '@/hooks/useSession';
import { toast } from 'sonner';

type Screen = 'login' | 'cadastro';
type DesafioType = 'dia' | 'mes' | 'ano';

const Login = () => {
  const navigate = useNavigate();
  const { user, initialized, login } = useSession();
  const [screen, setScreen] = useState<Screen>('login');
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('SINCRONIZANDO COM O PORTAL SAMU 192');

  // Login state
  const [nomes, setNomes] = useState<string[]>([]);
  const [vtrs, setVtrs] = useState<string[]>([]);
  const [loginVtr, setLoginVtr] = useState('');
  const [loginNome, setLoginNome] = useState('');
  const [loginSenha, setLoginSenha] = useState('');
  const [desafio, setDesafio] = useState<DesafioType>('dia');
  const [valorDesafio, setValorDesafio] = useState('');
  const [loginErro, setLoginErro] = useState('');

  // Cadastro state
  const [cadNome, setCadNome] = useState('');
  const [cadProf, setCadProf] = useState('');
  const [cadCpf, setCadCpf] = useState('');
  const [cadDia, setCadDia] = useState('');
  const [cadMes, setCadMes] = useState('');
  const [cadAno, setCadAno] = useState('');
  const [showSenhaFields, setShowSenhaFields] = useState(false);
  const [linhaUser, setLinhaUser] = useState<number | null>(null);
  const [s1, setS1] = useState('');
  const [s2, setS2] = useState('');

  const loadInitialData = useCallback(async () => {
    try {
      const data = await fetchDadosIniciais();
      setNomes(data.nomes);
      setVtrs(data.vtrs);
      gerarDesafio();
    } catch {
      setLoginErro('Falha ao carregar dados iniciais.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialized) {
      return;
    }
    if (user) {
      navigate('/dashboard');
      return;
    }
    loadInitialData();
  }, [initialized, user, navigate, loadInitialData]);

  const gerarDesafio = () => {
    const tipos: DesafioType[] = ['dia', 'mes', 'ano'];
    setDesafio(tipos[Math.floor(Math.random() * tipos.length)]);
    setValorDesafio('');
  };

  const obterSaudacaoPorHorario = () => {
    const horaAtual = new Date().getHours();
    if (horaAtual < 12) return 'Bom dia';
    if (horaAtual < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const handleEntrar = async () => {
    setLoginErro('');
    if (!loginVtr || !loginNome) {
      toast.error('Selecione a VTR e seu Nome!');
      return;
    }

    const saudacao = obterSaudacaoPorHorario();
    setLoading(true);
    setLoadingText(`${saudacao}! Bem-vindo ao check list do SAMU ${loginNome}.`);

    const res = await realizarLogin({
      nome: loginNome,
      senha: loginSenha,
      tipoDesafio: desafio,
      valorDesafio,
      vtr: loginVtr,
    });

    setLoading(false);
    setLoginSenha('');

    if (res.logado) {
      login({
        nome: res.nome!,
        codigo_servidor: res.codigo_servidor || undefined,
        vtr: loginVtr,
        profissao: res.profissao || 'NÃ£o Informado',
        turno: '',
      });
    } else {
      setLoginErro(res.msg || 'Falha na conexÃ£o.');
      gerarDesafio();
    }
  };

  const handleValidarCadastro = async () => {
    setLoading(true);
    setLoadingText('VERIFICANDO DADOS NO SISTEMA...');

    const res = await validarIdentidadeCadastro({
      nome: cadNome,
      profissao: cadProf,
      cpf: cadCpf,
      dia: cadDia,
      mes: cadMes,
      ano: cadAno,
    });

    setLoading(false);

    if (res.sucess) {
      setLinhaUser(res.row!);
      setShowSenhaFields(true);
    } else {
      toast.error(res.msg || 'Erro ao validar informaÃ§Ãµes.');
    }
  };

  const handleSalvarSenha = async () => {
    if (s1 !== s2 || s1 === '') {
      toast.error('As senhas nÃ£o conferem ou estÃ£o vazias!');
      return;
    }

    setLoading(true);
    setLoadingText('REGISTRANDO SUA SENHA...');

    const res = await registrarSenha(linhaUser!, s1);
    setLoading(false);

    if (res.sucess) {
      toast.success(res.msg);
      resetForms();
      setScreen('login');
    } else {
      toast.error(res.msg || 'Erro ao salvar senha.');
    }
  };

  const resetForms = () => {
    setLoginSenha('');
    setValorDesafio('');
    setCadNome('');
    setCadProf('');
    setCadCpf('');
    setCadDia('');
    setCadMes('');
    setCadAno('');
    setS1('');
    setS2('');
    setShowSenhaFields(false);
    setLinhaUser(null);
    setLoginErro('');
  };

  const voltarLogin = () => {
    resetForms();
    setShowSenhaFields(false);
    setScreen('login');
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col justify-center items-center z-50">
        <div className="w-16 h-16 border-[6px] border-border border-t-primary border-r-destructive border-b-accent rounded-full animate-spin mb-5" />
        <div className="font-orbitron text-primary text-sm font-bold text-center px-5">{loadingText}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      {screen === 'login' ? (
        <div className="w-full max-w-md p-8 glass border-2 border-white rounded-3xl text-center shadow-xl">
          <h1 className="font-orbitron text-primary text-2xl font-bold mb-2">SAMU 192</h1>
          <p className="text-primary font-bold mb-6 text-sm">CHECK LIST DA USA - Suporte AvanÃ§ado de Vida</p>

          <div className="mb-5 text-left">
            <label className="block mb-2 text-primary text-xs font-bold uppercase">Viatura (VTR)</label>
            <select
              value={loginVtr}
              onChange={e => setLoginVtr(e.target.value)}
              className="w-full p-3.5 bg-card border border-input rounded-xl text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"
            >
              <option value="" disabled>Selecione a VTR...</option>
              {vtrs.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div className="mb-5 text-left">
            <label className="block mb-2 text-primary text-xs font-bold uppercase">Servidor</label>
            <select
              value={loginNome}
              onChange={e => setLoginNome(e.target.value)}
              className="w-full p-3.5 bg-card border border-input rounded-xl text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"
            >
              <option value="" disabled>Selecione o seu nome...</option>
              {nomes.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <div className="mb-5 text-left">
            <label className="block mb-2 text-primary text-xs font-bold uppercase">
              {desafio.toUpperCase()} DE NASCIMENTO
            </label>
            <input
              type="text"
              value={valorDesafio}
              onChange={e => setValorDesafio(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleEntrar()}
              placeholder={`Digite o ${desafio}...`}
              className="w-full p-3.5 bg-card border border-input rounded-xl text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"
            />
          </div>

          <div className="mb-5 text-left">
            <label className="block mb-2 text-primary text-xs font-bold uppercase">Senha</label>
            <input
              type="password"
              value={loginSenha}
              onChange={e => setLoginSenha(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleEntrar()}
              placeholder="Digite sua senha..."
              className="w-full p-3.5 bg-card border border-input rounded-xl text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"
            />
          </div>

          <button
            onClick={handleEntrar}
            className="w-full p-4 samu-gradient border-none rounded-xl text-primary-foreground font-orbitron font-bold text-sm cursor-pointer uppercase shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition active:translate-y-0"
          >
            ENTRAR NO SISTEMA
          </button>

          {loginErro && <p className="text-destructive text-sm mt-4 font-bold">{loginErro}</p>}

          <p className="text-sm mt-5 text-muted-foreground">
            Ainda nÃ£o tem acesso?{' '}
            <span
              className="text-destructive font-bold cursor-pointer underline"
              onClick={() => { resetForms(); setScreen('cadastro'); }}
            >
              Ative seu cadastro
            </span>
          </p>
        </div>
      ) : (
        <div className="w-full max-w-md p-8 glass border-2 border-white rounded-3xl text-center shadow-xl">
          <h1 className="font-orbitron text-primary text-2xl font-bold mb-6">ATIVAÃ‡ÃƒO DE ACESSO</h1>

          {!showSenhaFields ? (
            <>
              <div className="mb-5 text-left">
                <label className="block mb-2 text-primary text-xs font-bold uppercase">Nome Completo</label>
                <select
                  value={cadNome}
                  onChange={e => setCadNome(e.target.value)}
                  className="w-full p-3.5 bg-card border border-input rounded-xl text-foreground outline-none focus:border-primary transition"
                >
                  <option value="" disabled>Selecione seu nome...</option>
                  {nomes.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>

              <div className="mb-5 text-left">
                <label className="block mb-2 text-primary text-xs font-bold uppercase">Cargo</label>
                <select
                  value={cadProf}
                  onChange={e => setCadProf(e.target.value)}
                  className="w-full p-3.5 bg-card border border-input rounded-xl text-foreground outline-none focus:border-primary transition"
                >
                  <option value="" disabled>Escolha sua profissÃ£o...</option>
                  <option>Enfermeiro</option>
                  <option>MÃ©dico</option>
                  <option>TÃ©cnico de Enfermagem</option>
                  <option>Condutor</option>
                </select>
              </div>

              <div className="mb-5 text-left">
                <label className="block mb-2 text-primary text-xs font-bold uppercase">CPF</label>
                <input
                  type="text"
                  value={cadCpf}
                  onChange={e => setCadCpf(e.target.value)}
                  placeholder="Digite apenas nÃºmeros"
                  className="w-full p-3.5 bg-card border border-input rounded-xl text-foreground outline-none focus:border-primary transition"
                />
              </div>

              <div className="mb-5 text-left">
                <label className="block mb-2 text-primary text-xs font-bold uppercase">Data de Nascimento</label>
                <div className="flex gap-2">
                  <input type="text" value={cadDia} onChange={e => setCadDia(e.target.value)} placeholder="Dia" maxLength={2} className="flex-1 p-3.5 bg-card border border-input rounded-xl text-foreground text-center outline-none focus:border-primary transition" />
                  <input type="text" value={cadMes} onChange={e => setCadMes(e.target.value)} placeholder="MÃªs" maxLength={2} className="flex-1 p-3.5 bg-card border border-input rounded-xl text-foreground text-center outline-none focus:border-primary transition" />
                  <input type="text" value={cadAno} onChange={e => setCadAno(e.target.value)} placeholder="Ano" maxLength={4} className="flex-1 p-3.5 bg-card border border-input rounded-xl text-foreground text-center outline-none focus:border-primary transition" />
                </div>
              </div>

              <button
                onClick={handleValidarCadastro}
                className="w-full p-4 samu-gradient-red border-none rounded-xl text-primary-foreground font-orbitron font-bold text-sm cursor-pointer uppercase shadow-lg hover:-translate-y-0.5 transition"
              >
                VERIFICAR INFORMAÃ‡Ã•ES
              </button>
            </>
          ) : (
            <>
              <div className="mb-5 text-left">
                <label className="block mb-2 text-primary text-xs font-bold uppercase">Nova Senha</label>
                <input
                  type="password"
                  value={s1}
                  onChange={e => setS1(e.target.value)}
                  placeholder="Crie uma senha forte"
                  className="w-full p-3.5 bg-card border border-input rounded-xl text-foreground outline-none focus:border-primary transition"
                />
              </div>

              <div className="mb-5 text-left">
                <label className="block mb-2 text-primary text-xs font-bold uppercase">Confirmar Senha</label>
                <input
                  type="password"
                  value={s2}
                  onChange={e => setS2(e.target.value)}
                  placeholder="Repita a senha"
                  className="w-full p-3.5 bg-card border border-input rounded-xl text-foreground outline-none focus:border-primary transition"
                />
              </div>

              <button
                onClick={handleSalvarSenha}
                className="w-full p-4 samu-gradient-red border-none rounded-xl text-primary-foreground font-orbitron font-bold text-sm cursor-pointer uppercase shadow-lg hover:-translate-y-0.5 transition"
              >
                CONCLUIR CADASTRO
              </button>
            </>
          )}

          <button
            onClick={voltarLogin}
            className="w-full p-4 mt-4 bg-transparent border border-muted-foreground rounded-xl text-muted-foreground font-orbitron font-bold text-sm cursor-pointer uppercase hover:bg-muted transition"
          >
            VOLTAR AO LOGIN
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;

