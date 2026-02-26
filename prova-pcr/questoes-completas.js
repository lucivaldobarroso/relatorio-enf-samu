// Cole aqui, SEM ALTERAR, os quatro blocos completos:
// const questoesSBV = [...]
// const maisQuestoesSBV = [...]
// const questoesSAVC = [...]
// const maisQuestoesSAVC = [...]
//
// O index.html vai usar automaticamente esses blocos quando eles existirem.
 // --- BANCO DE DADOS: 25 QUESTÕES DE SBV ---
    const questoesSBV = [
        { q: "1. Qual é a frequência de compressões torácicas recomendada para adultos em parada cardíaca?", 
          o: ["A) 80 a 100/min", "B) Aproximadamente 100/min", "C) 100 a 120/min", "D) Pelo menos 120/min"], 
          a: 2, 
          f: "<strong>Tema:</strong> Qualidade da RCP (Frequência).<br><strong>Justificativa:</strong> As diretrizes atuais recomendam de 100 a 120 compressões por minuto para maximizar o retorno venoso e o débito cardíaco.<br><strong>Bibliografia:</strong> Destaques das Diretrizes da AHA 2020 para RCP e ACE, Pág. 7." },
        
        { q: "2. Qual é a profundidade de compressão torácica recomendada para um adulto médio?", 
          o: ["A) Exatamente 4 cm", "B) Pelo menos 5 cm, não superior a 6 cm", "C) Pelo menos 6 cm", "D) 1/3 do diâmetro do tórax"], 
          a: 1, 
          f: "<strong>Tema:</strong> Qualidade da RCP (Profundidade).<br><strong>Justificativa:</strong> Para adultos, comprima pelo menos 5 cm, evitando excesso acima de 6 cm, pois não melhora a sobrevivência e pode causar lesões.<br><strong>Bibliografia:</strong> Destaques das Diretrizes da AHA 2020 para RCP e ACE, Pág. 7." },
        
        { q: "3. Qual é a relação compressão-ventilação correta para um adulto sem via aérea avançada (1 ou 2 socorristas)?", 
          o: ["A) 15:2", "B) 30:2", "C) 50:2", "D) Compressões contínuas sem ventilar"], 
          a: 1, 
          f: "<strong>Tema:</strong> Relação Compressão-Ventilação (Adultos).<br><strong>Justificativa:</strong> A relação universal de SBV para adultos sem via aérea avançada é de 30 compressões para 2 ventilações.<br><strong>Bibliografia:</strong> Destaques das Diretrizes da AHA 2020 para RCP e ACE, Pág. 7." },
        
        { q: "4. Qual a sequência correta dos passos de avaliação e suporte inicial de RCP recomendada pela AHA?", 
          o: ["A) A-B-C", "B) C-A-B", "C) B-C-A", "D) A-C-B"], 
          a: 1, 
          f: "<strong>Tema:</strong> Sequência do SBV.<br><strong>Justificativa:</strong> A sequência foi alterada de A-B-C para C-A-B (Compressão, Vias Aéreas, Respiração) para garantir que as compressões torácicas comecem o mais rápido possível.<br><strong>Bibliografia:</strong> Destaques das Diretrizes da AHA 2010 para RCP e ACE, Pág. 4." },
        
        { q: "5. Ao avaliar uma vítima, você nota que ela não responde e apresenta apenas 'gasping'. O que isso indica?", 
          o: ["A) A vítima está engasgada.", "B) A vítima está respirando normalmente.", "C) É sinal de Parada Cardíaca, iniciar RCP.", "D) Aguarde a respiração parar."], 
          a: 2, 
          f: "<strong>Tema:</strong> Reconhecimento de Parada Cardíaca.<br><strong>Justificativa:</strong> O gasping (respiração agônica) não é respiração normal. Vítima não responsiva com gasping está em parada cardíaca.<br><strong>Bibliografia:</strong> Destaques das Diretrizes da AHA 2020 para RCP e ACE, Pág. 8." },
        
        { q: "6. Qual é o tempo máximo que um profissional de saúde deve levar para checar o pulso central?", 
          o: ["A) 5 segundos", "B) 10 segundos", "C) 15 segundos", "D) 20 segundos"], 
          a: 1, 
          f: "<strong>Tema:</strong> Avaliação Inicial.<br><strong>Justificativa:</strong> A verificação de pulso (e respiração) deve ser feita simultaneamente em no máximo 10 segundos para não atrasar as compressões.<br><strong>Bibliografia:</strong> ACLS - Suporte Avançado de Vida (Barbara Aehlert) 5ª Ed., Pág. 45." },
        
        { q: "7. Por que é fundamental permitir o retorno total do tórax após cada compressão?", 
          o: ["A) Para evitar fratura de costelas.", "B) Para descansar o socorrista.", "C) Para permitir que o coração se encha de sangue.", "D) Para forçar a saída de ar."], 
          a: 2, 
          f: "<strong>Tema:</strong> Retorno da Parede Torácica.<br><strong>Justificativa:</strong> O relaxamento total permite o enchimento venoso do coração. Apoiar-se no tórax diminui o débito cardíaco.<br><strong>Bibliografia:</strong> Destaques das Diretrizes da AHA 2020 para RCP e ACE, Pág. 7." },
        
        { q: "8. Em um paciente adulto intubado, qual a frequência de ventilações durante a RCP?", 
          o: ["A) 1 a cada 3 a 5 seg.", "B) 1 a cada 6 seg (10/min) contínua.", "C) 2 a cada 30 compressões.", "D) 1 a cada 10 seg."], 
          a: 1, 
          f: "<strong>Tema:</strong> Ventilação com Via Aérea Avançada.<br><strong>Justificativa:</strong> Com via aérea avançada (tubo ET ou supraglótico), faça compressões ininterruptas e forneça 1 ventilação a cada 6 segundos.<br><strong>Bibliografia:</strong> Destaques das Diretrizes da AHA 2020 para RCP e ACE, Pág. 7." },
        
        { q: "9. Para um bebê em PCR atendido por 2 socorristas, qual a relação compressão-ventilação?", 
          o: ["A) 30:2", "B) 15:2", "C) 3:1", "D) 10:1"], 
          a: 1, 
          f: "<strong>Tema:</strong> Relação de Compressão Pediátrica.<br><strong>Justificativa:</strong> Para bebês e crianças com 2 socorristas, a relação muda de 30:2 para 15:2.<br><strong>Bibliografia:</strong> Destaques das Diretrizes da AHA 2020 para RCP e ACE, Pág. 16." },
        
        { q: "10. Qual a técnica de compressão recomendada para 1 socorrista em um bebê?", 
          o: ["A) Uma mão.", "B) Técnica dos dois dedos ou dois polegares.", "C) Duas mãos sobrepostas.", "D) Abraço com 4 dedos."], 
          a: 1, 
          f: "<strong>Tema:</strong> Técnica de Compressão no Bebê.<br><strong>Justificativa:</strong> A diretriz de 2020 permite o uso tanto da técnica de dois dedos quanto dos dois polegares para um socorrista único em lactentes.<br><strong>Bibliografia:</strong> Destaques das Diretrizes da AHA 2020 para RCP e ACE, Pág. 16." },
        
        { q: "11. Ao usar o DEA, qual é a PRIMEIRA ação assim que o aparelho chega?", 
          o: ["A) Colar as pás.", "B) Ligar o aparelho.", "C) Afastar as pessoas.", "D) Checar pulso."], 
          a: 1, 
          f: "<strong>Tema:</strong> Uso do DEA.<br><strong>Justificativa:</strong> A primeira etapa vital do DEA é ligá-lo. O aparelho ditará os próximos passos por comandos de voz.<br><strong>Bibliografia:</strong> ACLS - Suporte Avançado de Vida (Barbara Aehlert) 5ª Ed., Pág. 30." },
        
        { q: "12. Qual é a meta da Fração de Compressão Torácica (FCT) na RCP?", 
          o: ["A) > 40%", "B) > 60%, idealmente 80%", "C) 100%", "D) 50%"], 
          a: 1, 
          f: "<strong>Tema:</strong> Fração de Compressão Torácica.<br><strong>Justificativa:</strong> A FCT é a proporção de tempo gasto fazendo compressões. A meta é minimizar pausas para manter a FCT maior que 60%.<br><strong>Bibliografia:</strong> Destaques das Diretrizes da AHA 2020 para RCP e ACE, Pág. 7." },
        
        { q: "13. O que fazer IMEDIATAMENTE após o choque do DEA?", 
          o: ["A) Checar pulso.", "B) Ventilar 2 vezes.", "C) Retomar RCP pelas compressões.", "D) Esperar reanálise."], 
          a: 2, 
          f: "<strong>Tema:</strong> Cuidados pós-choque imediato.<br><strong>Justificativa:</strong> Não se deve checar o pulso logo após o choque; a RCP deve ser retomada imediatamente pelas compressões torácicas.<br><strong>Bibliografia:</strong> Destaques das Diretrizes da AHA 2020 para RCP e ACE, Pág. 7." },
        
        { q: "14. Você encontra um adulto consciente com engasgo grave. Qual a manobra inicial (Diretriz 2025)?", 
          o: ["A) Apenas Heimlich.", "B) Ciclos de 5 golpes nas costas seguidos de 5 compressões abdominais.", "C) Varredura digital.", "D) Tapas no peito."], 
          a: 1, 
          f: "<strong>Tema:</strong> Engasgo no Adulto.<br><strong>Justificativa:</strong> Em 2025, o protocolo unificou-se ao pediátrico: iniciar com 5 golpes nas costas alternando com 5 compressões abdominais.<br><strong>Bibliografia:</strong> Destaques das Diretrizes da AHA 2025 para RCP e ACE, Pág. 19." },
        
        { q: "15. A vítima adulta de engasgo perdeu a consciência. Qual o próximo passo?", 
          o: ["A) Heimlich deitado.", "B) Iniciar RCP imediatamente (compressões).", "C) Fazer 2 ventilações fortes.", "D) Varredura digital às cegas."], 
          a: 1, 
          f: "<strong>Tema:</strong> Engasgo Inconsciente.<br><strong>Justificativa:</strong> Se a vítima desmaiar, mude para RCP. As compressões torácicas criam pressão que ajuda a expelir o corpo estranho. Nunca faça varredura às cegas.<br><strong>Bibliografia:</strong> Destaques das Diretrizes da AHA 2025 para RCP e ACE, Pág. 19." },
        
        { q: "16. Suspeita de overdose de opioides em adulto não responsivo. O que os leigos devem fazer com imunidade legal?", 
          o: ["A) Aplicar Epinefrina.", "B) Aplicar Naloxona.", "C) Apenas observar.", "D) Fazer compressões abdominais."], 
          a: 1, 
          f: "<strong>Tema:</strong> Overdose de Opioides.<br><strong>Justificativa:</strong> As diretrizes de 2025 apoiam políticas que dão imunidade legal a leigos para a administração de Naloxona em suspeita de overdose.<br><strong>Bibliografia:</strong> Destaques das Diretrizes da AHA 2025 para RCP e ACE, Pág. 25." },
        
        { q: "17. Como deve ser a ventilação de resgate na CRIANÇA com pulso, mas sem respiração?", 
          o: ["A) 1 a cada 6 seg.", "B) 1 a cada 2 a 3 seg (20-30/min).", "C) 2 a cada 15 seg.", "D) 1 a cada 10 seg."], 
          a: 1, 
          f: "<strong>Tema:</strong> Ventilação de Resgate Pediátrica.<br><strong>Justificativa:</strong> A taxa de ventilação de resgate para bebês e crianças foi atualizada para 1 ventilação a cada 2 a 3 segundos.<br><strong>Bibliografia:</strong> Destaques das Diretrizes da AHA 2020 para RCP e ACE, Pág. 16." },
        
        { q: "18. Qual é a profundidade de compressões para uma criança?", 
          o: ["A) Pelo menos 5 cm ou 1/3 do diâmetro torácico.", "B) 4 cm.", "C) 6 cm.", "D) 2 cm."], 
          a: 0, 
          f: "<strong>Tema:</strong> Profundidade de Compressão (Pediatria).<br><strong>Justificativa:</strong> Na criança, a profundidade é cerca de um terço do diâmetro anteroposterior, o que equivale a cerca de 5 cm.<br><strong>Bibliografia:</strong> Destaques das Diretrizes da AHA 2020 para RCP e ACE, Pág. 16." },
        
        { q: "19. Socorrista sozinho encontra criança em PCR asfíxica (não presenciada) sem celular. O que fazer?", 
          o: ["A) Correr para ligar.", "B) Fazer 2 min de RCP antes de buscar ajuda.", "C) Apenas ventilar.", "D) Procurar pulso por 30s."], 
          a: 1, 
          f: "<strong>Tema:</strong> RCP Pediátrica (Socorrista Sozinho).<br><strong>Justificativa:</strong> Crianças param mais por asfixia. Forneça 2 minutos de RCP para oxigenar o sangue antes de abandonar a vítima para chamar socorro.<br><strong>Bibliografia:</strong> Destaques das Diretrizes da AHA 2020 para RCP e ACE, Pág. 16." },
        
        { q: "20. Onde deve ser checado o pulso no bebê (menos de 1 ano)?", 
          o: ["A) Carótida.", "B) Radial.", "C) Braquial.", "D) Femoral."], 
          a: 2, 
          f: "<strong>Tema:</strong> Verificação de Pulso Pediátrico.<br><strong>Justificativa:</strong> Em lactentes, o pescoço curto e gordinho dificulta a palpação carotídea; o pulso braquial (face interna do braço) é o recomendado.<br><strong>Bibliografia:</strong> ACLS Português 2022, Pág. 495." },
        
        { q: "21. A cada quanto tempo os compressores torácicos devem revezar?", 
          o: ["A) A cada 5 min.", "B) A cada 2 min (ou 5 ciclos).", "C) Quando cansarem.", "D) Após cada choque."], 
          a: 1, 
          f: "<strong>Tema:</strong> Fadiga na RCP.<br><strong>Justificativa:</strong> A troca deve ocorrer a cada 2 minutos em menos de 5 segundos de pausa para evitar a queda imperceptível na qualidade da RCP.<br><strong>Bibliografia:</strong> Destaques das Diretrizes da AHA 2020 para RCP e ACE, Pág. 7." },
        
        { q: "22. Qual é a conduta física para melhorar a RCP na gestante?", 
          o: ["A) Elevar as pernas.", "B) Deslocamento uterino manual para a esquerda.", "C) RCP de bruços.", "D) Inclinar o tórax para a direita."], 
          a: 1, 
          f: "<strong>Tema:</strong> PCR na Gravidez.<br><strong>Justificativa:</strong> O deslocamento uterino para a esquerda alivia a compressão da veia cava inferior e da aorta, melhorando o retorno venoso e a eficácia da RCP.<br><strong>Bibliografia:</strong> Destaques das Diretrizes da AHA 2020 para RCP e ACE, Pág. 10." },
        
        { q: "23. O que define uma ventilação adequada durante a RCP?", 
          o: ["A) O estômago estufa.", "B) Sopro com toda a força.", "C) Volume suficiente para elevação visível do tórax.", "D) 3 segundos de duração."], 
          a: 2, 
          f: "<strong>Tema:</strong> Ventilação Adequada.<br><strong>Justificativa:</strong> O foco é evitar a hiperventilação. O ar deve ser insuflado em 1 segundo apenas até observar a elevação do tórax.<br><strong>Bibliografia:</strong> Destaques das Diretrizes da AHA 2020 para RCP e ACE, Pág. 7." },
        
        { q: "24. Como agir se a vítima estiver em uma poça de água e o DEA chegar?", 
          o: ["A) Dar choque mesmo assim.", "B) Secar rapidamente o tórax antes de aplicar as pás.", "C) Não usar o DEA.", "D) Usar pás pediátricas."], 
          a: 1, 
          f: "<strong>Tema:</strong> Segurança no uso do DEA.<br><strong>Justificativa:</strong> A água conduz eletricidade. O paciente deve ser retirado da poça e o tórax seco para que o choque foque no coração e evite queimaduras.<br><strong>Bibliografia:</strong> ACLS - Suporte Avançado de Vida (Barbara Aehlert) 5ª Ed., Pág. 126." },
        
        { q: "25. A diretriz de 2020 reitera que leigos iniciem RCP imediata, pois o risco da RCP desnecessária é:", 
          o: ["A) Altamente letal.", "B) Baixo.", "C) Moderado.", "D) Causa pneumotórax fatal em 50%."], 
          a: 1, 
          f: "<strong>Tema:</strong> RCP por Leigos.<br><strong>Justificativa:</strong> Novas evidências mostram que o risco de lesões por RCP em pessoas que não estão em PCR é muito baixo, sendo pior a hesitação em agir.<br><strong>Bibliografia:</strong> Destaques das Diretrizes da AHA 2020 para RCP e ACE, Pág. 11." }
    ];

    // --- BANCO DE DADOS: 25 QUESTÕES DE SAVC ---
    const questoesSAVC = [
        { q: "1. Quais são os ritmos CHOCÁVEIS na Parada Cardíaca?", 
          o: ["A) Assistolia e AESP.", "B) Fibrilação Ventricular (FV) e Taquicardia Ventricular Sem Pulso (TVSP).", "C) Fibrilação Atrial.", "D) Taquicardia Sinusal."], 
          a: 1, 
          f: "<strong>Tema:</strong> Ritmos de Parada.<br><strong>Justificativa:</strong> O choque (desfibrilação) é o tratamento de escolha apenas para a desorganização elétrica da FV e da TVSP.<br><strong>Bibliografia:</strong> Destaques das Diretrizes da AHA 2020 para RCP e ACE, Pág. 7." },
        
        { q: "2. Em ritmos NÃO chocáveis (AESP/Assistolia), quando a Epinefrina deve ser dada?", 
          o: ["A) Imediatamente, o mais rápido possível.", "B) Após o 2º choque.", "C) Após 10 minutos.", "D) Não é indicada."], 
          a: 0, 
          f: "<strong>Tema:</strong> Epinefrina na Parada.<br><strong>Justificativa:</strong> O algoritmo de 2020 dá grande ênfase à aplicação imediata da epinefrina para ritmos não chocáveis a fim de maximizar a sobrevivência.<br><strong>Bibliografia:</strong> Destaques das Diretrizes da AHA 2020 para RCP e ACE, Pág. 7." },
        
        { q: "3. Qual é a dose de Amiodarona na FV/TVSP refratária?", 
          o: ["A) 150 mg.", "B) 300 mg (1ª dose), 150 mg (2ª dose).", "C) 1 mg a cada 3 min.", "D) 1 mg/kg."], 
          a: 1, 
          f: "<strong>Tema:</strong> Fármacos Antiarrítmicos.<br><strong>Justificativa:</strong> A dose de bolus inicial é 300 mg; se o ritmo refratário persistir, uma segunda dose de 150 mg pode ser feita.<br><strong>Bibliografia:</strong> Destaques das Diretrizes da AHA 2020 para RCP e ACE, Pág. 7." },
        
        { q: "4. Por que a Vasopressina foi removida do algoritmo adulto?", 
          o: ["A) Muito cara.", "B) Não oferecia benefício adicional sobre o uso isolado de Epinefrina.", "C) Causava alergia.", "D) Aumentava a mortalidade."], 
          a: 1, 
          f: "<strong>Tema:</strong> Evolução das Diretrizes.<br><strong>Justificativa:</strong> Simplificou-se o algoritmo removendo a vasopressina, pois estudos provaram que sua eficácia é a mesma da epinefrina isolada.<br><strong>Bibliografia:</strong> ACLS - Suporte Avançado de Vida (Barbara Aehlert) 5ª Ed., Pág. 140." },
        
        { q: "5. Na capnografia (ETCO2), o que um salto abrupto e sustentado (ex: para 40 mmHg) indica?", 
          o: ["A) Óbito.", "B) Falha do tubo.", "C) Retorno da Circulação Espontânea (RCE).", "D) Fadiga do socorrista."], 
          a: 2, 
          f: "<strong>Tema:</strong> Capnografia Quantitativa.<br><strong>Justificativa:</strong> O salto abrupto e sustentado no ETCO2 indica que o coração voltou a bombear sangue aos pulmões de forma espontânea (RCE).<br><strong>Bibliografia:</strong> Destaques das Diretrizes da AHA 2020 para RCP e ACE, Pág. 7." },
        
        { q: "6. Qual valor de ETCO2 alerta a equipe para melhorar a qualidade das compressões?", 
          o: ["A) 35-45 mmHg.", "B) Menor que 10 mmHg.", "C) 20 mmHg.", "D) Acima de 50 mmHg."], 
          a: 1, 
          f: "<strong>Tema:</strong> Monitorização da RCP.<br><strong>Justificativa:</strong> Um valor de ETCO2 < 10 mmHg demonstra fluxo sanguíneo muito baixo gerado pela RCP, exigindo troca de compressor ou mais força.<br><strong>Bibliografia:</strong> Destaques das Diretrizes da AHA 2020 para RCP e ACE, Pág. 7." },
        
        { q: "7. Bradicardia Sintomática Instável: Qual a nova dose de Atropina (AHA 2020)?", 
          o: ["A) 0.5 mg.", "B) 1 mg a cada 3-5 min.", "C) 2 mg.", "D) 3 mg."], 
          a: 1, 
          f: "<strong>Tema:</strong> Tratamento da Bradicardia.<br><strong>Justificativa:</strong> A diretriz atualizou a dose da atropina de 0,5 mg para 1 mg IV, com máximo cumulativo de 3 mg.<br><strong>Bibliografia:</strong> Destaques das Diretrizes da AHA 2020 para RCP e ACE, Pág. 17." },
        
        { q: "8. Se a Atropina falhar na bradicardia instável, qual a conduta?", 
          o: ["A) Desfibrilação.", "B) Marca-passo transcutâneo OU infusão de Dopamina/Epinefrina.", "C) Amiodarona.", "D) RCP."], 
          a: 1, 
          f: "<strong>Tema:</strong> Tratamento da Bradicardia.<br><strong>Justificativa:</strong> Terapias de segunda linha incluem estimulação (marca-passo) e inotrópicos IV.<br><strong>Bibliografia:</strong> ACLS - Suporte Avançado de Vida (Barbara Aehlert) 5ª Ed., Pág. 226." },
        
        { q: "9. Taquicardia regular de QRS estreito, ESTÁVEL. Qual a droga de primeira escolha?", 
          o: ["A) Adenosina 6 mg IV.", "B) Amiodarona.", "C) Epinefrina.", "D) Choque."], 
          a: 0, 
          f: "<strong>Tema:</strong> Tratamento da Taquicardia Estável.<br><strong>Justificativa:</strong> Após manobras vagais, a Adenosina 6 mg IV rápida (seguida de flush) é a primeira linha terapêutica.<br><strong>Bibliografia:</strong> ACLS - Suporte Avançado de Vida (Barbara Aehlert) 5ª Ed., Pág. 203." },
        
        { q: "10. Taquicardia com pulso e sinais de INSTABILIDADE (PA 70/40, mental alterado). Conduta?", 
          o: ["A) Amiodarona.", "B) Cardioversão Sincronizada.", "C) Desfibrilação cega.", "D) RCP."], 
          a: 1, 
          f: "<strong>Tema:</strong> Tratamento da Taquicardia Instável.<br><strong>Justificativa:</strong> O tratamento de escolha para qualquer taquicardia instável COM PULSO é a Cardioversão Sincronizada imediata.<br><strong>Bibliografia:</strong> ACLS - Suporte Avançado de Vida (Barbara Aehlert) 5ª Ed., Pág. 197." },
        
        { q: "11. Em PCR adulto, qual via vascular as diretrizes de 2025 preferem inicialmente?", 
          o: ["A) IO.", "B) IV periférica.", "C) Tubo ET.", "D) Intramuscular."], 
          a: 1, 
          f: "<strong>Tema:</strong> Acesso Vascular.<br><strong>Justificativa:</strong> As diretrizes de 2025 priorizam fortemente a via IV. Acesso IO é aceitável se o IV falhar ou for inviável.<br><strong>Bibliografia:</strong> Destaques das Diretrizes da AHA 2025 para RCP e ACE, Pág. 21." },
        
        { q: "12. Qual a dose inicial de Lidocaína (alternativa à amiodarona) na PCR?", 
          o: ["A) 1 a 1,5 mg/kg.", "B) 300 mg.", "C) 1 mg IV.", "D) 6 mg."], 
          a: 0, 
          f: "<strong>Tema:</strong> Fármacos Antiarrítmicos.<br><strong>Justificativa:</strong> A lidocaína pode ser usada no lugar da amiodarona. A dose de ataque é de 1 a 1,5 mg/kg IV/IO.<br><strong>Bibliografia:</strong> Destaques das Diretrizes da AHA 2020 para RCP e ACE, Pág. 7." },
        
        { q: "13. Quais são os famosos 5Hs e 5Ts que causam PCR?", 
          o: ["A) Hipovolemia, Hipóxia, Hidrogênio (Acidose), Hipo/Hipercalemia, Hipotermia e Tromboses/Tamponamento/Tensão/Toxinas.", "B) Hipotensão, Hipoglicemia...", "C) Hérnia, Hematoma...", "D) Tosse, Tonteira..."], 
          a: 0, 
          f: "<strong>Tema:</strong> Causas Reversíveis de PCR.<br><strong>Justificativa:</strong> O mnemônico dos 5Hs e 5Ts é essencial na investigação (especialmente AESP/Assistolia) para tratar a causa base da parada.<br><strong>Bibliografia:</strong> Destaques das Diretrizes da AHA 2020 para RCP e ACE, Pág. 7." },
        
        { q: "14. Tratamento para Torsades de Pointes (TV Polimórfica com QT longo):", 
          o: ["A) Amiodarona.", "B) Sulfato de Magnésio.", "C) Adenosina.", "D) Atropina."], 
          a: 1, 
          f: "<strong>Tema:</strong> Situações Especiais de Taquicardia.<br><strong>Justificativa:</strong> O Sulfato de Magnésio IV é a droga de escolha para reverter Torsades de Pointes.<br><strong>Bibliografia:</strong> ACLS - Suporte Avançado de Vida (Barbara Aehlert) 5ª Ed., Pág. 141." },
        
        { q: "15. Cuidados Pós-RCE: Qual a meta de saturação de oxigênio (SpO2)?", 
          o: ["A) 100% sempre.", "B) 92% a 98%.", "C) < 90%.", "D) 85%."], 
          a: 1, 
          f: "<strong>Tema:</strong> Cuidados Pós-PCR (Oxigenação).<br><strong>Justificativa:</strong> Evita-se a hiperóxia (excesso de oxigênio), que causa dano oxidativo cerebral. Titula-se a SpO2 entre 92% e 98%.<br><strong>Bibliografia:</strong> Destaques das Diretrizes da AHA 2020 para RCP e ACE, Pág. 9." },
        
        { q: "16. Cuidados Pós-RCE: Qual a meta de Pressão Arterial Média (PAM)?", 
          o: ["A) PAM > 65 mmHg.", "B) PAM > 100 mmHg.", "C) PAM < 60 mmHg.", "D) Não importa."], 
          a: 0, 
          f: "<strong>Tema:</strong> Cuidados Pós-PCR (Hemodinâmica).<br><strong>Justificativa:</strong> A hipotensão agrava a lesão isquêmica cerebral. Trata-se com fluidos ou vasopressores para manter PAM >= 65 mmHg.<br><strong>Bibliografia:</strong> Destaques das Diretrizes da AHA 2020 para RCP e ACE, Pág. 9." },
        
        { q: "17. Paciente comatoso pós-RCE. A AHA 2025 recomenda Controle Direcionado de Temperatura (CDT) por pelo menos:", 
          o: ["A) 12 horas.", "B) 24 horas.", "C) 36 horas.", "D) 7 dias."], 
          a: 2, 
          f: "<strong>Tema:</strong> Controle Direcionado de Temperatura.<br><strong>Justificativa:</strong> A atualização de 2025 especifica a duração mínima de 36 horas para controle de temperatura visando proteção neurológica.<br><strong>Bibliografia:</strong> Destaques das Diretrizes da AHA 2025 para RCP e ACE, Pág. 22." },
        
        { q: "18. Meta de tempo 'Porta-Balão' para IAM com Supradesnivelamento de ST (ICP):", 
          o: ["A) < 90 minutos.", "B) 3 horas.", "C) 24 horas.", "D) 10 minutos."], 
          a: 0, 
          f: "<strong>Tema:</strong> Síndromes Coronarianas Agudas.<br><strong>Justificativa:</strong> Pacientes com IAM com Supra de ST devem ir à hemodinâmica para angioplastia primária em < 90 min.<br><strong>Bibliografia:</strong> ACLS - Suporte Avançado de Vida (Barbara Aehlert) 5ª Ed., Pág. 274." },
        
        { q: "19. Ritmo CHOCÁVEL na PCR. Quando dar a primeira dose de Epinefrina?", 
          o: ["A) Antes do 1º choque.", "B) Após o 2º choque falho.", "C) No 4º choque.", "D) Não se dá."], 
          a: 1, 
          f: "<strong>Tema:</strong> Farmacologia em Ritmo Chocável.<br><strong>Justificativa:</strong> O choque tem prioridade. A Epinefrina só entra no algoritmo caso o ritmo permaneça em FV/TVSP após o 2º choque.<br><strong>Bibliografia:</strong> Destaques das Diretrizes da AHA 2020 para RCP e ACE, Pág. 7." },
        
        { q: "20. O que diz a Diretriz de 2025 sobre Desfibrilação Sequencial Dupla?", 
          o: ["A) É a primeira linha de tratamento.", "B) A sua utilidade rotineira ainda não está bem estabelecida.", "C) É proibida.", "D) Substitui a RCP."], 
          a: 1, 
          f: "<strong>Tema:</strong> Desfibrilação Refratária.<br><strong>Justificativa:</strong> Apesar de pequenos estudos, a utilidade da mudança de vetor e do duplo choque não foi estabelecida para uso rotineiro.<br><strong>Bibliografia:</strong> Destaques das Diretrizes da AHA 2025 para RCP e ACE, Pág. 20." },
        
        { q: "21. AESP com QRS ESTREITO e RÁPIDO no monitor. A causa mais provável é:", 
          o: ["A) Metabólica (Hipercalemia).", "B) Mecânica (Hipovolemia/Tamponamento).", "C) Hipotermia profunda.", "D) Overdose de beta-bloqueador."], 
          a: 1, 
          f: "<strong>Tema:</strong> Diagnóstico Diferencial na AESP.<br><strong>Justificativa:</strong> QRS estreito com FC alta na parada frequentemente indica causa estrutural/mecânica (Tensão, Tamponamento, Hipovolemia, Trombose).<br><strong>Bibliografia:</strong> ACLS - Suporte Avançado de Vida (Barbara Aehlert) 5ª Ed., Pág. 143." },
        
        { q: "22. Qual é a contraindicação fatal para uso de Nitroglicerina no IAM?", 
          o: ["A) Uso prévio de Sildenafil/Tadalafil nas 24-48h anteriores.", "B) Dor severa.", "C) Pressão de 150x90.", "D) Histórico de gastrite."], 
          a: 0, 
          f: "<strong>Tema:</strong> Medicamentos nas SCAs.<br><strong>Justificativa:</strong> Nitratos interagem com inibidores da fosfodiesterase (remédios para disfunção erétil), causando hipotensão letal refratária.<br><strong>Bibliografia:</strong> ACLS - Suporte Avançado de Vida (Barbara Aehlert) 5ª Ed., Pág. 299." },
        
        { q: "23. O Neuroprognóstico Multimodal pós-RCE deve ser feito no mínimo após:", 
          o: ["A) 12 horas.", "B) 72 horas.", "C) 7 dias.", "D) Imediatamente no DE."], 
          a: 1, 
          f: "<strong>Tema:</strong> Cuidados Neurológicos Pós-RCE.<br><strong>Justificativa:</strong> A avaliação de testes como EEG, RM e exames clínicos deve aguardar pelo menos 72h após o reaquecimento para limpeza de sedativos.<br><strong>Bibliografia:</strong> Destaques das Diretrizes da AHA 2020 para RCP e ACE, Pág. 10." },
        
        { q: "24. Fibrinólise (Alteplase IV) no AVC Isquêmico Agudo é melhor aplicada dentro de qual janela?", 
          o: ["A) 12 horas.", "B) 3 a 4,5 horas do início dos sintomas.", "C) 24 horas.", "D) Somente nos primeiros 10 minutos."], 
          a: 1, 
          f: "<strong>Tema:</strong> Protocolo de AVC.<br><strong>Justificativa:</strong> A terapia trombolítica IV possui janela terapêutica de 3h, extensível a 4.5h sob rigorosos critérios médicos.<br><strong>Bibliografia:</strong> ACLS - Suporte Avançado de Vida (Barbara Aehlert) 5ª Ed., Pág. 396." },
        
        { q: "25. O que a AHA recomenda sobre o uso da ECPR (RCP Extracorpórea/ECMO)?", 
          o: ["A) Uso universal em toda PCR.", "B) Transporte regionalizado focado em pacientes altamente selecionados (jovens, parada presenciada, causa reversível).", "C) Contraindicada em humanos.", "D) Somente para idosos acima de 80 anos."], 
          a: 1, 
          f: "<strong>Tema:</strong> Tecnologias Avançadas.<br><strong>Justificativa:</strong> Sendo um recurso complexo, a ECPR exige transporte rápido a centros regionais para pacientes estritos onde a causa raiz possa ser tratada.<br><strong>Bibliografia:</strong> Destaques das Diretrizes da AHA 2025 para RCP e ACE, Pág. 11." }
    ];
    const maisQuestoesSBV = [
        { q: "51. Qual é o sexto elo recentemente adicionado à Cadeia de Sobrevivência (adultos e pediatria) da AHA?", 
          o: ["A) Desfibrilação precoce.", "B) Recuperação e Sobrevivência.", "C) Cuidados intensivos na UTI.", "D) Prevenção comunitária."], 
          a: 1, 
          f: "<strong>Tema:</strong> Cadeia de Sobrevivência.<br><strong>Justificativa:</strong> O sexto elo, Recuperação, destaca que a jornada do paciente não termina na alta. Envolve reabilitação física, cognitiva e emocional a longo prazo para o paciente e cuidadores.<br><strong>Bibliografia:</strong> Diretrizes AHA 2020 (Circulation), Pág. 3." },
        
        { q: "52. No tratamento de uma vítima com suspeita de engasgo (OVACE) grave adulta, como deve ser a sequência (Atualização 2025)?", 
          o: ["A) Apenas compressões abdominais.", "B) Varredura digital cega e respiração boca a boca.", "C) Ciclos repetidos de 5 golpes nas costas seguidos de 5 compressões abdominais.", "D) Compressões torácicas imediatamente, independentemente da consciência."], 
          a: 2, 
          f: "<strong>Tema:</strong> Obstrução de Via Aérea (Engasgo).<br><strong>Justificativa:</strong> A diretriz de 2025 alterou a regra do adulto para se alinhar com a pediatria: alternar 5 golpes nas costas com 5 compressões abdominais (Heimlich) até desobstruir ou a vítima desmaiar.<br><strong>Bibliografia:</strong> Destaques Diretrizes AHA 2025, Pág. 10." },
        
        { q: "53. Os despachantes (telecomunicadores) do serviço de emergência devem usar a regra 'Não-Não-Vá' para orientar os leigos. O que isso significa?", 
          o: ["A) Não toque, não ligue, vá embora.", "B) Se a vítima NÃO responde e NÃO respira normalmente, VÁ iniciar a RCP.", "C) Não faça boca a boca, não use o DEA, vá para o hospital.", "D) Não use as mãos, não respire, vá buscar ajuda."], 
          a: 1, 
          f: "<strong>Tema:</strong> RCP orientada por telecomunicador.<br><strong>Justificativa:</strong> A estrutura 'Não-Não-Vá' é altamente eficaz para despachantes instruírem leigos a iniciarem RCP apenas com as mãos se a vítima não responde e não respira (ou tem gasping).<br><strong>Bibliografia:</strong> Diretrizes AHA 2020, Pág. 27." },
        
        { q: "54. Qual é a conduta de primeiros socorros para uma pessoa com hipoglicemia sintomática leve que está consciente e consegue engolir?", 
          o: ["A) Injetar insulina imediatamente.", "B) Oferecer comprimidos de glicose ou outras formas de açúcar (alimentos comuns).", "C) Fazer RCP preventiva.", "D) Apenas observar e não dar nada via oral."], 
          a: 1, 
          f: "<strong>Tema:</strong> Primeiros Socorros (Hipoglicemia).<br><strong>Justificativa:</strong> Se os comprimidos de glicose não estiverem disponíveis, alimentos comuns contendo açúcar são alternativas aceitáveis para reverter a hipoglicemia leve.<br><strong>Bibliografia:</strong> Destaques Diretrizes AHA/ARC Primeiros Socorros 2024, Pág. 6." },
        
        { q: "55. Se uma pessoa sofrer anafilaxia por picada de abelha e já usou o autoinjetor de epinefrina, mas os sintomas persistem ou pioram, o que fazer?", 
          o: ["A) Dar água para a vítima beber.", "B) Aguardar mais 30 minutos.", "C) Administrar uma segunda dose de epinefrina após 5 a 10 minutos, se a emergência não chegar.", "D) Iniciar RCP mesmo se ela estiver respirando e falando."], 
          a: 2, 
          f: "<strong>Tema:</strong> Primeiros Socorros (Anafilaxia).<br><strong>Justificativa:</strong> Evidências suportam a necessidade de uma segunda dose de epinefrina se os sintomas de anafilaxia não se resolverem com a dose inicial após 5 a 10 minutos.<br><strong>Bibliografia:</strong> Destaques Diretrizes AHA/ARC Primeiros Socorros 2024, Pág. 3." },
        
        { q: "56. Nos primeiros socorros para o controle de sangramento com risco de vida nas extremidades, qual é a terapia de primeira linha atual?", 
          o: ["A) Elevação do membro.", "B) Aplicação de gelo.", "C) Uso de um torniquete fabricado (manufaturado) o mais rápido possível.", "D) Compressão em pontos arteriais no pescoço."], 
          a: 2, 
          f: "<strong>Tema:</strong> Primeiros Socorros (Hemorragia).<br><strong>Justificativa:</strong> A recomendação aumentou de 'pode ser considerado' para 'deve ser usado'. Torniquetes reduzem a mortalidade e devem ser usados imediatamente para hemorragias graves em membros.<br><strong>Bibliografia:</strong> Diretrizes HSI/AHA 2020 (Primeiros Socorros), Pág. 22." },
        
        { q: "57. Se um dente permanente for avulsionado (arrancado por trauma) e não puder ser replantado imediatamente, qual o melhor meio de transporte?", 
          o: ["A) Água da torneira.", "B) Embrulhado em gaze seca.", "C) Solução salina de Hanks, leite de vaca integral ou a própria saliva da pessoa.", "D) Álcool ou antisséptico bucal."], 
          a: 2, 
          f: "<strong>Tema:</strong> Primeiros Socorros (Avulsão Dentária).<br><strong>Justificativa:</strong> A água da torneira danifica as células da raiz do dente. Deve-se transportá-lo em leite, solução de Hanks ou saliva para aumentar a chance de reimplante bem-sucedido.<br><strong>Bibliografia:</strong> Destaques Diretrizes AHA/ARC Primeiros Socorros 2024, Pág. 4." },
        
        { q: "58. Para hipertermia de esforço ou insolação (heat stroke), qual é a técnica de resfriamento mais eficaz nos primeiros socorros?", 
          o: ["A) Dar líquidos quentes para provocar suor.", "B) Imersão de todo o corpo em água fria (até o queixo).", "C) Apenas ligar um ventilador comum.", "D) Fazer compressões torácicas."], 
          a: 1, 
          f: "<strong>Tema:</strong> Primeiros Socorros (Emergências Térmicas).<br><strong>Justificativa:</strong> A imersão em água fria de todo o corpo é o método mais rápido e eficaz para baixar a temperatura central do corpo rapidamente em casos de insolação grave.<br><strong>Bibliografia:</strong> Diretrizes HSI/AHA 2020 (Primeiros Socorros), Pág. 23." },
        
        { q: "59. Em relação ao uso de auxílios cognitivos (listas de verificação, aplicativos) durante a ressuscitação, qual é a diretriz de 2025 para SOCORRISTAS LEIGOS?", 
          o: ["A) São obrigatórios.", "B) Não são recomendados para leigos, pois atrasam o início da RCP.", "C) Devem substituir o acionamento do SME.", "D) Melhoram a RCP em 100% dos casos."], 
          a: 1, 
          f: "<strong>Tema:</strong> Ciência da Educação (Auxílios Cognitivos).<br><strong>Justificativa:</strong> Dados de simulação mostraram que, para leigos, o uso de auxílios cognitivos atrasou significativamente o início da RCP. Portanto, seu uso não é recomendado para esse público (apenas para profissionais).<br><strong>Bibliografia:</strong> Destaques Diretrizes AHA 2025, Pág. 30." },
        
        { q: "60. Como a Diretriz de 2025 orienta a realização de RCP em adultos com obesidade?", 
          o: ["A) Usar dispositivo mecânico obrigatoriamente.", "B) Aprofundar para 8 cm.", "C) Fazer apenas ventilação.", "D) Realizar usando as mesmas técnicas usadas para pacientes não obesos."], 
          a: 3, 
          f: "<strong>Tema:</strong> RCP em Adultos (Obesidade).<br><strong>Justificativa:</strong> Uma revisão não encontrou evidências que apoiem alterações na RCP padrão para obesos. O protocolo (100-120/min, mín 5cm de profundidade) permanece inalterado.<br><strong>Bibliografia:</strong> Destaques Diretrizes AHA 2025, Pág. 10." },
        
        { q: "61. Durante o treinamento de SBV, o que se entende por 'Aprendizagem Espaçada' (Spaced Learning)?", 
          o: ["A) Aprender apenas no espaço sideral.", "B) Um curso único de 8 horas sem pausas.", "C) Treinamento separado em várias sessões curtas ao longo do tempo (em vez de um evento massivo único).", "D) Ler o manual sem praticar."], 
          a: 2, 
          f: "<strong>Tema:</strong> Ciência da Educação.<br><strong>Justificativa:</strong> Separar o treinamento em várias sessões ajuda na retenção de habilidades de RCP muito melhor do que o aprendizado em massa (curso tradicional único).<br><strong>Bibliografia:</strong> Diretrizes AHA 2020 (Educação), Pág. 26." },
        
        { q: "62. Disparidades na educação em RCP: Qual barreira frequentemente impede as mulheres de receberem RCP por leigos na rua?", 
          o: ["A) O coração feminino não fibrila.", "B) Leigos temem ferir a mulher ou serem acusados de tocar nos seios de forma inadequada.", "C) O DEA não funciona em mulheres.", "D) Mulheres não sofrem parada cardíaca extra-hospitalar."], 
          a: 1, 
          f: "<strong>Tema:</strong> Disparidades Sociais e Ética.<br><strong>Justificativa:</strong> As diretrizes de 2020/2025 focam fortemente no treinamento ético e de conscientização pública para eliminar o medo infundado de tocar no tórax de vítimas femininas.<br><strong>Bibliografia:</strong> Diretrizes AHA 2020 (Educação), Pág. 28 / AHA 2025, Pág. 29." },
        
        { q: "63. Qual mnemônico de Primeiros Socorros é amplamente ensinado a leigos para o reconhecimento precoce do AVC?", 
          o: ["A) CAB.", "B) FAST (Face, Arms, Speech, Time) / SAMU no Brasil.", "C) OPQRST.", "D) SAMPLE."], 
          a: 1, 
          f: "<strong>Tema:</strong> Primeiros Socorros (Reconhecimento de AVC).<br><strong>Justificativa:</strong> O teste FAST demonstrou ser de fácil memorização para leigos, ajudando a diminuir o tempo porta-hospital para o tratamento trombolítico.<br><strong>Bibliografia:</strong> Destaques Diretrizes AHA/ARC Primeiros Socorros 2024, Pág. 3." },
        
        { q: "64. No adulto com suspeita de traumatismo cranioencefálico/cervical, a primeira manobra para abrir a via aérea é a anteriorização da mandíbula. E se ela falhar?", 
          o: ["A) Desistir de abrir a via aérea.", "B) Fazer traqueostomia.", "C) O socorrista deve usar a inclinação da cabeça-elevação do queixo.", "D) Comprimir o pescoço."], 
          a: 2, 
          f: "<strong>Tema:</strong> Manejo de Via Aérea (Trauma).<br><strong>Justificativa:</strong> A diretriz de 2025 reforça que, se a elevação da mandíbula não abrir a via aérea, a prioridade absoluta é oxigenar o paciente, logo, deve-se usar a inclinação da cabeça-elevação do queixo (risco de vida sobrepõe o risco cervical).<br><strong>Bibliografia:</strong> Destaques Diretrizes AHA 2025, Pág. 9." },
        
        { q: "65. Para qual faixa etária as diretrizes de 2025 recomendam INICIAR o ensino de RCP para criar prontidão e confiança futura?", 
          o: ["A) Somente adultos maiores de 18 anos.", "B) Somente adolescentes acima de 15 anos.", "C) Crianças menores de 12 anos (ensino fundamental).", "D) Apenas estudantes de medicina."], 
          a: 2, 
          f: "<strong>Tema:</strong> Treinamento de RCP em Escolas.<br><strong>Justificativa:</strong> Começar a apresentar a RCP e o uso do DEA para crianças menores de 12 anos melhora a socialização e quebra a barreira psicológica de hesitar em ajudar no futuro.<br><strong>Bibliografia:</strong> Destaques Diretrizes AHA 2025, Pág. 29." },
        
        { q: "66. Qual é a instrução em relação a ferimentos torácicos abertos (sugadores) nos primeiros socorros?", 
          o: ["A) Encher a ferida de gaze.", "B) Colocar um curativo totalmente oclusivo em 4 pontas.", "C) É aceitável deixar o ferimento aberto e descoberto; se precisar de pressão, cuide para não ocluir totalmente (risco de pneumotórax).", "D) Jogar água no pulmão."], 
          a: 2, 
          f: "<strong>Tema:</strong> Primeiros Socorros (Trauma Torácico).<br><strong>Justificativa:</strong> Curativos oclusivos podem reter o ar e causar pneumotórax hipertensivo fatal. Leigos devem evitar selar a ferida hermeticamente.<br><strong>Bibliografia:</strong> Destaques Diretrizes AHA/ARC Primeiros Socorros 2024, Pág. 2." },
        
        { q: "67. Qual é a recomendação para o uso de objetos caseiros (ex: travesseiros, rolos de papel higiênico) para simular compressões no treinamento de leigos em casa?", 
          o: ["A) São melhores que manequins.", "B) É proibido usar objetos.", "C) A utilidade não está bem estabelecida (faltam evidências fortes).", "D) Aumentam a taxa de sobrevivência em 50%."], 
          a: 2, 
          f: "<strong>Tema:</strong> Equipamentos Alternativos de Treinamento.<br><strong>Justificativa:</strong> Em 2025, concluiu-se que o uso de objetos alternativos tem resultados variados; a evidência ainda não é forte o suficiente para recomendá-los em substituição aos manequins padrão.<br><strong>Bibliografia:</strong> Destaques Diretrizes AHA 2025, Pág. 30." },
        
        { q: "68. Na cadeia de sobrevivência para PCREH Pediátrica, qual é o PRIMEIRO elo, antes mesmo do acionamento do SME?", 
          o: ["A) Desfibrilação.", "B) Transporte para UTI.", "C) Prevenção.", "D) Recuperação."], 
          a: 2, 
          f: "<strong>Tema:</strong> Cadeia de Sobrevivência Pediátrica.<br><strong>Justificativa:</strong> Diferente do adulto, a parada cardíaca pediátrica raramente é súbita e cardíaca primária. Geralmente é causada por asfixia, afogamento ou trauma, tornando a 'Prevenção' o elo inicial fundamental.<br><strong>Bibliografia:</strong> Diretrizes AHA 2020 (Suporte Pediátrico), Pág. 16." },
        
        { q: "69. Uso da Naloxona por leigos: As diretrizes de 2025 encorajam políticas públicas que garantam o quê?", 
          o: ["A) Que leigos sejam processados se usarem a medicação.", "B) Que a Naloxona seja vendida apenas para médicos.", "C) Imunidade de responsabilidade civil e criminal para leigos que administrem de boa-fé.", "D) Uso exclusivo via acesso intravenoso."], 
          a: 2, 
          f: "<strong>Tema:</strong> Overdose de Opioides (Políticas Públicas).<br><strong>Justificativa:</strong> Para combater a crise de opioides, programas de acesso comunitário devem proteger legalmente o socorrista leigo que administra a naloxona por via nasal/IM.<br><strong>Bibliografia:</strong> Destaques Diretrizes AHA 2025, Pág. 4." },
        
        { q: "70. Qual é a recomendação para o posicionamento da vítima de colapso que respira normalmente (para evitar aspiração)?", 
          o: ["A) Deitada de bruços (pronação).", "B) Posição de recuperação lateral (de lado). A técnica HAINES não é mais preferida.", "C) Sentada e inclinada para trás.", "D) Com as pernas amarradas para cima."], 
          a: 1, 
          f: "<strong>Tema:</strong> Primeiros Socorros (Posicionamento).<br><strong>Justificativa:</strong> Colocar a vítima lateralmente protege a via aérea de vômito e secreções. A manobra específica de HAINES (braço suspenso) não tem mais recomendação exclusiva.<br><strong>Bibliografia:</strong> Destaques Diretrizes AHA/ARC Primeiros Socorros 2024, Pág. 2." },
        
        { q: "71. Durante a ventilação com Dispositivo Bolsa-Máscara (BVM), qual o volume de ar recomendado para um paciente adulto sem via aérea avançada?", 
          o: ["A) O suficiente para estufar o estômago.", "B) Toda a capacidade da bolsa de 2 litros.", "C) Apenas o volume suficiente para produzir uma elevação visível do tórax.", "D) O menor volume possível, não importando o tórax."], 
          a: 2, 
          f: "<strong>Tema:</strong> Ventilação com BVM.<br><strong>Justificativa:</strong> Evite hiperventilação. O excesso de volume aumenta a pressão intratorácica e diminui o débito cardíaco. Basta ver a elevação do tórax ao longo de 1 segundo.<br><strong>Bibliografia:</strong> Destaques Diretrizes AHA 2025, Pág. 9." },
        
        { q: "72. Qual é a meta em porcentagem para a Fração de Compressão Torácica (FCT) na RCP para adultos?", 
          o: ["A) 25%", "B) 40%", "C) Pelo menos 60%, idealmente maior que 80%.", "D) 100% (sem pausas para absolutamente nada, nunca)."], 
          a: 2, 
          f: "<strong>Tema:</strong> Qualidade da RCP (FCT).<br><strong>Justificativa:</strong> A FCT é a proporção de tempo gasto comprimindo o peito. Minimizar pausas (para choque ou checagem de ritmo) aumenta a FCT, sendo a meta mínima de 60%.<br><strong>Bibliografia:</strong> Diretrizes AHA 2020 (Suporte Adulto), Pág. 7." },
        
        { q: "73. Se você for o único socorrista leigo a atender um bebê não responsivo e sem respiração (e sem telefone), a prioridade muda. Você deve:", 
          o: ["A) Procurar um DEA por 10 minutos.", "B) Fazer cerca de 2 minutos de RCP (5 ciclos) ANTES de abandonar a criança para buscar ajuda.", "C) Ligar para a emergência e esperar na rua.", "D) Fazer apenas Heimlich."], 
          a: 1, 
          f: "<strong>Tema:</strong> RCP Pediátrica (Socorrista Solitário).<br><strong>Justificativa:</strong> A parada em bebês geralmente é hipóxica (asfixia). A oxigenação precoce e as compressões são urgentes; portanto, aplique 2 min de RCP antes de sair caso não tenha celular.<br><strong>Bibliografia:</strong> Diretrizes AHA 2020 (Suporte Pediátrico)." },
        
        { q: "74. Dispositivos de feedback audiovisual na RCP (ex: aqueles que dizem 'Aprofunde mais' ou marcam o ritmo):", 
          o: ["A) São contraindicados porque distraem a equipe.", "B) Recomenda-se seu uso durante o treinamento em RCP para profissionais e leigos, pois melhoram significativamente o desempenho.", "C) São úteis apenas para médicos.", "D) Dão choque automaticamente na vítima."], 
          a: 1, 
          f: "<strong>Tema:</strong> Ciência da Educação (Dispositivos de Feedback).<br><strong>Justificativa:</strong> Meta-análises mostram que o feedback em tempo real melhora a velocidade e a profundidade alcançadas pelo aluno, fixando a memória motora.<br><strong>Bibliografia:</strong> Destaques Diretrizes AHA 2025, Pág. 26." },
        
        { q: "75. Qual é o papel da Imersão Gamificada e Realidade Virtual (RV) no treinamento de SBV atual (2025)?", 
          o: ["A) Substitui integralmente a prática manual no manequim.", "B) Pode apoiar a aquisição de conhecimento (teórico), mas NÃO deve ser usada para ensinar HABILIDADES motoras de RCP exclusivas sem prática real.", "C) É ilegal nas certificações AHA.", "D) Melhora a profundidade real das mãos na vítima humana."], 
          a: 1, 
          f: "<strong>Tema:</strong> Realidade Virtual no Ensino.<br><strong>Justificativa:</strong> A RV ajuda a engajar e fixar o fluxo de decisões mentais, mas faltam evidências (ou elas são inferiores) de que a RV crie memória motora adequada para profundidade/frequência sem o uso de manequins reais.<br><strong>Bibliografia:</strong> Destaques Diretrizes AHA 2025, Pág. 28." }
    ];
     const maisQuestoesSAVC = [
        { q: "51. O que a Diretriz AHA de 2025 estabelece sobre a Desfibrilação Sequencial Dupla e a Desfibrilação com Mudança de Vetor para FV refratária?", 
          o: ["A) Devem ser o padrão ouro após o primeiro choque.", "B) A utilidade ainda é incerta/não estabelecida para uso rotineiro, necessitando de mais investigação.", "C) Foram proibidas por causar explosão do DEA.", "D) Aumentam o RCE em 90% dos casos."], 
          a: 1, 
          f: "<strong>Tema:</strong> Desfibrilação Avançada.<br><strong>Justificativa:</strong> Apesar de um pequeno ensaio recente (DOSE VF) apoiar o benefício, as diretrizes de 2025 mantêm a postura de que a evidência não é forte o suficiente para adotar como rotina universal (utilidade não estabelecida).<br><strong>Bibliografia:</strong> Destaques Diretrizes AHA 2025, Pág. 12." },
        
        { q: "52. No paciente adulto em PCR, a Diretriz de 2025 determinou que a via para administração de drogas (Acesso Vascular) tem uma clara prioridade. Qual é?", 
          o: ["A) Via Intraóssea (IO) é preferida sobre a Intravenosa (IV).", "B) Via Intratraqueal é a primeira escolha.", "C) Os profissionais devem tentar PRIMEIRO o acesso IV periférico. O IO é aceitável se o IV falhar ou for inviável.", "D) Acesso venoso central exclusivo."], 
          a: 2, 
          f: "<strong>Tema:</strong> Acesso Vascular.<br><strong>Justificativa:</strong> Meta-análises de 2025 comprovaram que o uso de via intraóssea teve menores chances de RCE sustentado quando comparado à via IV. Portanto, o acesso IV recupera o protagonismo absoluto.<br><strong>Bibliografia:</strong> Destaques Diretrizes AHA 2025, Pág. 13." },
        
        { q: "53. Vasopressina vs. Epinefrina: Segundo a atualização de 2025, qual é o papel da Vasopressina na PCR do adulto?", 
          o: ["A) A vasopressina isolada ou em combinação NÃO oferece vantagem como substituta da epinefrina.", "B) Deve ser dada logo no primeiro minuto.", "C) Dobra as chances de RCE.", "D) É exclusiva para ritmos chocáveis."], 
          a: 0, 
          f: "<strong>Tema:</strong> Vasopressores.<br><strong>Justificativa:</strong> Estudos extensos confirmaram que a vasopressina não melhora a sobrevida em comparação à epinefrina isolada, mantendo a epinefrina como o vasopressor padrão do algoritmo.<br><strong>Bibliografia:</strong> Destaques Diretrizes AHA 2025, Pág. 13." },
        
        { q: "54. Qual é o limite de tempo estipulado em 2025 para a conclusão do Parto de Ressuscitação (antiga Cesariana Perimortem) na gestante em PCR sem sucesso na RCP?", 
          o: ["A) 15 minutos.", "B) 5 minutos desde o reconhecimento da PCR.", "C) 1 hora.", "D) Apenas se a mãe recuperar pulso."], 
          a: 1, 
          f: "<strong>Tema:</strong> PCR na Gestação.<br><strong>Justificativa:</strong> Para melhorar as chances de salvar o bebê e aliviar a compressão aortocava da mãe (facilitando o retorno venoso e o RCE), a meta é iniciar os preparos imediatamente e concluir a extração em 5 minutos.<br><strong>Bibliografia:</strong> Destaques Diretrizes AHA 2025, Pág. 24." },
        
        { q: "55. No caso de uma embolia por líquido amniótico com choque hemorrágico no periparto resultando em PCR, qual é o protocolo transfusional?", 
          o: ["A) Apenas soro fisiológico.", "B) Protocolo de transfusão maciça equilibrada (glóbulos vermelhos, plasma e plaquetas em proporções iguais).", "C) Exsanguineotransfusão.", "D) Apenas plaquetas."], 
          a: 1, 
          f: "<strong>Tema:</strong> PCR na Gestação (Coagulopatia).<br><strong>Justificativa:</strong> A embolia amniótica causa falência cardiovascular e coagulopatia intravascular disseminada grave (CID). A reposição com hemocomponentes equilibrados reduz o risco de morte.<br><strong>Bibliografia:</strong> Destaques Diretrizes AHA 2025, Pág. 24." },
        
        { q: "56. Um paciente adulto que utiliza um Dispositivo de Assistência Ventricular Esquerda (LVAD) durável é encontrado inconsciente e com sinais de 'baixa perfusão'. Devo fazer RCP?", 
          o: ["A) Nunca, pois a RCP destruirá a bomba do coração.", "B) O socorrista DEVE executar compressões torácicas se houver falha de perfusão (inconsciente, pálido/cinzento, tempo de enchimento capilar lento).", "C) Apenas ventilar.", "D) Apenas dar choques com DEA repetidamente."], 
          a: 1, 
          f: "<strong>Tema:</strong> PCR em Situações Especiais (LVAD).<br><strong>Justificativa:</strong> O pulso nesses pacientes pode ser impalpável naturalmente (fluxo contínuo). Se houver sinais visíveis de hipoperfusão severa/morte clínica, o benefício da RCP salva-vidas supera o risco teórico de deslocar o dispositivo (Diretriz 2025).<br><strong>Bibliografia:</strong> Destaques Diretrizes AHA 2025, Pág. 23." },
        
        { q: "57. No manejo pós-RCE no adulto (Cuidados Pós-PCR), qual é a meta mínima para a Pressão Arterial Média (PAM) definida na AHA 2025?", 
          o: ["A) > 100 mmHg.", "B) > 40 mmHg.", "C) Pelo menos 65 mmHg.", "D) Não importa, desde que tenha pulso."], 
          a: 2, 
          f: "<strong>Tema:</strong> Cuidados Pós-PCR (Hemodinâmica).<br><strong>Justificativa:</strong> Deve-se evitar a hipotensão ativamente (com fluidos e inotrópicos) mantendo a PAM ≥ 65 mmHg para garantir a perfusão de órgãos vitais, sobretudo o cérebro lesionado.<br><strong>Bibliografia:</strong> Destaques Diretrizes AHA 2025, Pág. 16." },
        
        { q: "58. Qual é a nova diretriz de 2025 (Atualização) para Cardioversão Sincronizada da Fibrilação Atrial (FA)?", 
          o: ["A) Iniciar com baixa energia (50J).", "B) Usar configuração de energia inicial MAIS ALTA, de pelo menos 200 J em desfibrilador bifásico.", "C) Usar amiodarona antes do choque obrigatoriamente.", "D) A cardioversão está contraindicada na FA."], 
          a: 1, 
          f: "<strong>Tema:</strong> Arritmias (Cardioversão da FA).<br><strong>Justificativa:</strong> Ensaios recentes mostraram que um choque bifásico alto e único de 200J teve uma taxa de sucesso cumulativo >90% e menor taxa de degeneração para FV do que começar com baixas energias escalonadas.<br><strong>Bibliografia:</strong> Destaques Diretrizes AHA 2025, Pág. 14." },
        
        { q: "59. Em um paciente em Coma pós-RCE, a AHA 2025 atualizou o tempo mínimo para a manutenção do Controle de Temperatura (32ºC a 37.5ºC). Qual é este tempo?", 
          o: ["A) 12 horas.", "B) 24 horas.", "C) Pelo menos 36 horas.", "D) 72 horas."], 
          a: 2, 
          f: "<strong>Tema:</strong> Cuidados Pós-PCR (Controle Direcionado de Temperatura).<br><strong>Justificativa:</strong> O período recomendado de controle contínuo (seja com hipotermia ou apenas impedindo a febre agressivamente) foi ampliado para o mínimo de 36 horas em pacientes comatosos.<br><strong>Bibliografia:</strong> Destaques Diretrizes AHA 2025, Pág. 18." },
        
        { q: "60. Quais são os métodos de triagem diagnóstica para avaliar a etiologia da parada e complicações no paciente adulto recém ressuscitado (pós-RCE) na UTI/DE?", 
          o: ["A) TC do corpo inteiro (cabeça a pelve) e USG point-of-care (POCUS) cardíaco são aceitáveis para descartar sangramentos ou problemas mecânicos ocultos.", "B) Somente ECG.", "C) Nenhum exame até o paciente acordar.", "D) Apenas dosagem de Potássio."], 
          a: 0, 
          f: "<strong>Tema:</strong> Cuidados Pós-PCR (Imagem).<br><strong>Justificativa:</strong> A diretriz 2025 endossa formalmente que uma TC ampla (Panc CT) e ultrassom cardíaco à beira do leito são estratégias válidas para descobrir a causa raiz da parada e avaliar traumas compressivos de RCP.<br><strong>Bibliografia:</strong> Destaques Diretrizes AHA 2025, Pág. 17." },
        
        { q: "61. Ao avaliar um paciente no Setor de Emergência com suspeita de AVC isquêmico agudo, as diretrizes defendem uma forte integração do 'Target: Stroke'. Qual a meta do Tempo Porta-Agulha?", 
          o: ["A) Até 4.5 horas.", "B) Menos de 60 minutos (idealmente, metade dos pacientes em 45 min).", "C) 10 minutos.", "D) 120 minutos."], 
          a: 1, 
          f: "<strong>Tema:</strong> AVC Agudo (Tempo Porta-Agulha).<br><strong>Justificativa:</strong> O medicamento fibrinolítico (Alteplase) salva mais neurônios quanto mais cedo infundido. O sistema de saúde deve almejar Porta-Agulha < 60 minutos.<br><strong>Bibliografia:</strong> Diretrizes SAVC 2020 (Sistemas de AVC)." },
        
        { q: "62. Como se aborda a Bradicardia Sintomática REFRATÁRIA no adulto (não responde à atropina nem a drogas IV, paciente gravemente chocado)?", 
          o: ["A) Desfibrilação máxima.", "B) Fazer compressões torácicas.", "C) Considerar implantação de marcapasso transvenoso provisório.", "D) Administrar lidocaína."], 
          a: 2, 
          f: "<strong>Tema:</strong> Bradicardia (Tratamento de Exceção).<br><strong>Justificativa:</strong> A AHA 2025 inclui a aceitação da introdução do marcapasso transvenoso temporário (pela veia jugular/femoral até o VD) para estabilizar o paciente em choque grave por bradicardia resistente, servindo como ponte ao tratamento definitivo.<br><strong>Bibliografia:</strong> Destaques Diretrizes AHA 2025, Pág. 15." },
        
        { q: "63. Qual é o papel atual do Ultrassom Point-of-Care (POCUS) DURANTE as manobras ativas de RCP (em parada)?", 
          o: ["A) Pode ajudar a identificar causas reversíveis (como Tamponamento ou Trombose/TEP), mas não deve atrasar ou causar pausas > 10s nas compressões.", "B) É proibido na PCR.", "C) É a primeira linha e deve durar 2 minutos.", "D) Dispensa o uso de Epinefrina se o coração não estiver batendo."], 
          a: 0, 
          f: "<strong>Tema:</strong> Diagnóstico na PCR (POCUS).<br><strong>Justificativa:</strong> O uso de ultrassom ajuda incrivelmente no diagnóstico de pseudoparada (AESP com contração miocárdica oculta) e nos 5Hs e 5Ts. Porém, sua aplicação requer destreza para nunca interromper a compressão torácica além do permitido.<br><strong>Bibliografia:</strong> Diretrizes SAVC 2020." },
        
        { q: "64. Mioclonia e crises convulsivas pós-RCE: qual a diretriz mandatória se o hospital tiver o recurso?", 
          o: ["A) Deixar convulsionar para 'gastar energia'.", "B) Eletroencefalograma (EEG) contínuo, ou intermitente, para detectar status epilepticus não convulsivo e tratar agressivamente.", "C) Injetar adenosina.", "D) Desligar o ventilador mecânico."], 
          a: 1, 
          f: "<strong>Tema:</strong> Cuidados Neurológicos Pós-RCE.<br><strong>Justificativa:</strong> Convulsões subclínicas devastam o cérebro pós-anóxia. A detecção precoce pelo EEG e o tratamento imediato são partes fundamentais do Neuroprognóstico e proteção.<br><strong>Bibliografia:</strong> Diretrizes AHA 2020/2025 (Pós-PCR)." },
        
        { q: "65. Quando se fala em avaliação neuroprognóstica (Neuroprognóstico Multimodal) no adulto pós-RCE, qual o momento MÍNIMO seguro para prever resultados neurológicos ruins?", 
          o: ["A) No momento do RCE.", "B) Em 24h.", "C) Somente após 72 horas do retorno da normotermia do paciente e sem efeito residual de sedativos.", "D) 1 semana."], 
          a: 2, 
          f: "<strong>Tema:</strong> Cuidados Pós-PCR (Neuroprognóstico).<br><strong>Justificativa:</strong> O cérebro necessita de tempo para se recuperar da isquemia, e o metabolismo das drogas é atrasado pela hipotermia. Diagnósticos fúteis ou precoces de 'estado vegetativo' levam à retirada precoce do suporte de vida.<br><strong>Bibliografia:</strong> Destaques Diretrizes AHA 2020, Pág. 11." },
        
        { q: "66. Qual é a Regra Universal de Término de Ressuscitação para pacientes com PCR Extra-Hospitalar (usada pelo SME)?", 
          o: ["A) Parar aos 10 minutos independentemente da causa.", "B) Parar se: PCR não foi presenciada pelo SME; Nenhum choque foi indicado/administrado; Não houve RCE antes do transporte.", "C) Parar se a vítima tiver mais de 80 anos.", "D) Transportar todo paciente em PCR ativo e buzinando até a sala de emergência."], 
          a: 1, 
          f: "<strong>Tema:</strong> Decisões Éticas e SAVC.<br><strong>Justificativa:</strong> Esta regra validada clinicamente prevê futilidade e salva as equipes do risco de acidentes de ambulância em transportes de emergência de um cadáver cuja reanimação tem zero chance de sucesso.<br><strong>Bibliografia:</strong> Destaques Diretrizes AHA 2025, Pág. 13." },
        
        { q: "67. Paciente obteve RCE, mas não obedece a comandos. Pressão de 70/40. No ECG, há Supra de ST em V2, V3 e V4. Qual a prioridade além do controle de temperatura?", 
          o: ["A) Fazer Raio-X.", "B) Trombolítico imediato na UTI.", "C) Encaminhar para Cateterismo de emergência (Hemodinâmica / ICP) mesmo o paciente estando em coma.", "D) Tratar apenas a hipotensão e não focar no coração."], 
          a: 2, 
          f: "<strong>Tema:</strong> Cuidados Pós-PCR (Síndrome Coronariana).<br><strong>Justificativa:</strong> O paciente pós-RCE com suspeita de IAM (Supradesnível de ST) deve ir direto para a intervenção coronária percutânea (revascularização), independentemente do seu nível de consciência neurológica.<br><strong>Bibliografia:</strong> Algoritmo de Cuidados Pós-PCR 2020." },
        
        { q: "68. Na RCP Pediátrica Intra-Hospitalar, uma meta específica de sobrevivência focada na Pressão Arterial foi estipulada em 2025. Qual é ela?", 
          o: ["A) Permitir hipotensão permissiva.", "B) Manter a Pressão Arterial Sistólica (PAS) e Média (PAM) acima do 10º percentil para a idade.", "C) Deixar a PAS sempre em 120 mmHg.", "D) Não monitorar PA pós-parada pediátrica."], 
          a: 1, 
          f: "<strong>Tema:</strong> Pós-RCE Pediátrico.<br><strong>Justificativa:</strong> A hipotensão pós-RCE é letal em crianças. Manter a PA de forma pró-ativa acima desse limite (com vasopressores/fluidos) associou-se a altas taxas de sobrevivência neurológica intacta.<br><strong>Bibliografia:</strong> Destaques Diretrizes AHA 2025, Pág. 21." },
        
        { q: "69. Uso de ECPR (ECMO durante a parada cardíaca): Para qual perfil de adulto ela é considerada aceitável e ética?", 
          o: ["A) Idosos institucionalizados com câncer terminal.", "B) Parada cardíaca não presenciada há mais de 40 min em assistolia.", "C) Um número altamente selecionado e limitado de adultos com parada presenciada, bom tempo sem fluxo (time-to-CPR) e causa potencialmente reversível em centros especializados.", "D) Todos os pacientes no hospital."], 
          a: 2, 
          f: "<strong>Tema:</strong> SAVC Avançado / Ética (ECPR).<br><strong>Justificativa:</strong> O sistema ECMO é caro e demanda equipes altamente especializadas, por isso a triagem é estrita para limitar futilidade terapêutica e aplicar o princípio da justiça distributiva.<br><strong>Bibliografia:</strong> Destaques Diretrizes AHA 2025, Pág. 7 / 2020." },
        
        { q: "70. A Capnografia de Forma de Onda (EtCO2) no Tubo Endotraqueal. Se no meio do 3º ciclo da RCP, o EtCO2 subir abruptamente de 12 mmHg para 42 mmHg e se manter assim, o que você faz?", 
          o: ["A) Administra Epinefrina 1mg.", "B) Suspeita de Retorno da Circulação Espontânea (RCE) e pausa para checar o pulso.", "C) Aumenta a força da compressão.", "D) Extuba o paciente."], 
          a: 1, 
          f: "<strong>Tema:</strong> Capnografia Avançada.<br><strong>Justificativa:</strong> O ETCO2 mede o débito cardíaco sendo carreado para o pulmão. Um salto sustentado para valores >35-40 mmHg no meio da massagem indica o retorno do débito espontâneo do coração.<br><strong>Bibliografia:</strong> Algoritmo de PCR do Adulto 2020/2025." },
        
        { q: "71. Durante uma parada em AESP, o monitor exibe um QRS estreito e muito rápido (antes do coração parar de vez). A jugular do paciente está distendida, não há entrada de ar de um lado do pulmão (timpanismo). Qual a causa mais provável a tratar?", 
          o: ["A) Pneumotórax Hipertensivo (Tratamento: Descompressão por agulha/Drenagem torácica).", "B) Intoxicação por Antidepressivo Tricíclico.", "C) Hipovolemia severa.", "D) Hipotermia extrema."], 
          a: 0, 
          f: "<strong>Tema:</strong> 5Hs e 5Ts (Manejo Direcionado).<br><strong>Justificativa:</strong> Uma AESP com QRS estreito é mecânica (obstrução do fluxo). Jugular turgida e ausência de murmúrio assimétrico gritam Tensão no Tórax. O alívio intratorácico imediato salva a vida.<br><strong>Bibliografia:</strong> Algoritmos SAVC (Tensão do Tórax)." },
        
        { q: "72. Hipotermia acidental GRAVE (< 28°C) e parada cardíaca. A diretriz 2025 diz o que sobre o reaquecimento?", 
          o: ["A) Usar secadores de cabelo.", "B) Usar mantas externas e não fazer RCP.", "C) Usar ECLS/ECMO para reaquecer e perfundir ativamente o paciente simultaneamente.", "D) Declarar óbito após 5 min."], 
          a: 2, 
          f: "<strong>Tema:</strong> Situações Especiais (Hipotermia).<br><strong>Justificativa:</strong> 'Ninguém está morto até estar quente e morto.' A ECMO Veno-Arterial fornece oxigenação e reaquecimento do sangue diretamente, sendo a terapia de resgate ouro.<br><strong>Bibliografia:</strong> Destaques Diretrizes AHA 2025, Pág. 22." },
        
        { q: "73. A AHA sugere que para o Debriefing Pós-PCR o instrutor/líder deve:", 
          o: ["A) Gritar com o time para evitar erros futuros.", "B) Apontar quem errou os medicamentos.", "C) Usar um Roteiro de Debriefing Estruturado para garantir consistência sem ambiente punitivo.", "D) Nunca falar com o time depois."], 
          a: 2, 
          f: "<strong>Tema:</strong> Dinâmica de Equipe e Melhoria Contínua.<br><strong>Justificativa:</strong> Modelos estruturados (como o GAS ou o roteiro AHA) protegem a segurança psicológica do grupo, facilitando a aprendizagem real focada no processo e não no indivíduo.<br><strong>Bibliografia:</strong> Destaques Diretrizes AHA 2025, Pág. 30." },
        
        { q: "74. Choque Cardiogênico refratário em Adultos APÓS RCE. O que pode ser considerado pela AHA de 2025?", 
          o: ["A) Suporte Circulatório Mecânico Temporário (ex: Bomba de Balão Intra-aórtico ou Impella/ECMO).", "B) Vasopressina em altíssima dose.", "C) Parar o tratamento por futilidade imediata.", "D) Choques de DEA seriados com o paciente acordado."], 
          a: 0, 
          f: "<strong>Tema:</strong> Cuidados Pós-PCR (Choque Cardiogênico).<br><strong>Justificativa:</strong> Se o músculo cardíaco estiver muito 'atordoado' (stunning miocárdico) pós-infarto/parada e a PA não subir com drogas, as bombas de assistência assumem o trabalho temporariamente.<br><strong>Bibliografia:</strong> Destaques Diretrizes AHA 2025, Pág. 18." },
        
        { q: "75. Cuidado no final da vida e limitação de esforços: o termo 'Não Ressuscitar' nos hospitais hoje em dia apoia-se em formulários e definições de Ordem de Tratamento. O que o termo 'Princípio de Ausência de Objeção' reflete eticamente?", 
          o: ["A) O hospital manda na família.", "B) O médico suspende o tratamento sem a família saber.", "C) Se a família entende e aceita que a RCP é fútil sem exigir sua parada verbalmente, mas sem objetar à decisão da equipe, a RCP pode ser suspensa eticamente.", "D) Que todos devem ser ressuscitados sob coerção."], 
          a: 2, 
          f: "<strong>Tema:</strong> Ética e Limitação de Cuidado.<br><strong>Justificativa:</strong> Esse princípio ético humanizado de 2025 foca em tirar o 'peso' da decisão moral dos ombros das famílias arrasadas pela dor, quando a morte é clinicamente irreversível.<br><strong>Bibliografia:</strong> Destaques Diretrizes AHA 2025 (Ética), Pág. 4." }
    ];