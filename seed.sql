USE sistema_mural;

INSERT INTO usuarios (vinculo, nome, curso, email) VALUES
  ('Aluno', 'Lucas Almeida', 'Ciência da Computação', 'lucas.almeida@unioeste.br'),
  ('Professor', 'Marina Souza', 'Enfermagem', 'marina.souza@unioeste.br'),
  ('Servidor', 'Carlos Eduardo Pereira', 'Pró-Reitoria de Extensão', 'carlos.pereira@unioeste.br')
ON DUPLICATE KEY UPDATE
  vinculo = VALUES(vinculo),
  nome = VALUES(nome),
  curso = VALUES(curso);

INSERT INTO postagens (
  titulo,
  conteudo,
  area,
  publico_alvo,
  status,
  vagas,
  data_inicio,
  data_fim,
  campus,
  local,
  dia_semana,
  hora_inicio,
  hora_termino,
  professor_coordenador,
  inscricao,
  requisitos,
  usuario_id
)
SELECT
  'Oficina de Lógica e Programação com Python',
  'Curso introdutório prático voltado a iniciantes para desenvolver algoritmos, estruturas de controle e pequenos projetos em Python.',
  'Tecnologia e Produção',
  'Estudantes do ensino médio e calouros universitários',
  'abertas',
  30,
  '2026-12-01',
  '2026-12-18',
  'Cascavel',
  'Laboratório de Informática 02 - Bloco C',
  'seg,qua,sex',
  '14:00:00',
  '16:00:00',
  'Prof. Dr. Rogério Luís Rizzi',
  'Preencher o formulário eletrônico até o dia anterior ao início das aulas.',
  'Não exige experiência prévia em programação.',
  u.id
FROM usuarios u
WHERE u.email = 'lucas.almeida@unioeste.br'
  AND NOT EXISTS (
    SELECT 1 FROM postagens p WHERE p.titulo = 'Oficina de Lógica e Programação com Python'
  );

INSERT INTO postagens (
  titulo,
  conteudo,
  area,
  publico_alvo,
  status,
  vagas,
  data_inicio,
  data_fim,
  campus,
  local,
  dia_semana,
  hora_inicio,
  hora_termino,
  professor_coordenador,
  inscricao,
  requisitos,
  usuario_id
)
SELECT
  'Ações de Prevenção e Promoção à Saúde na Comunidade',
  'Atividades educativas sobre hipertensão, vacinação e hábitos saudáveis realizadas em parceria com unidades básicas e escolas.',
  'Saúde',
  'Moradores da comunidade local e estudantes da área da saúde',
  'andamento',
  20,
  '2026-11-10',
  '2026-12-20',
  'Foz do Iguaçu',
  'Auditório Central - Campus Foz do Iguaçu',
  'ter,qui',
  '09:00:00',
  '11:30:00',
  'Profa. Dra. Marina Souza',
  'Inscrição presencial na coordenação do projeto ou por e-mail institucional.',
  'Disponibilidade para participar das visitas agendadas.',
  u.id
FROM usuarios u
WHERE u.email = 'marina.souza@unioeste.br'
  AND NOT EXISTS (
    SELECT 1 FROM postagens p WHERE p.titulo = 'Ações de Prevenção e Promoção à Saúde na Comunidade'
  );

INSERT INTO postagens (
  titulo,
  conteudo,
  area,
  publico_alvo,
  status,
  vagas,
  data_inicio,
  data_fim,
  campus,
  local,
  dia_semana,
  hora_inicio,
  hora_termino,
  professor_coordenador,
  inscricao,
  requisitos,
  usuario_id
)
SELECT
  'Educação Ambiental e Separação de Resíduos no Campus',
  'Projeto focado na redução de resíduos sólidos, reciclagem e boas práticas ambientais junto à comunidade acadêmica.',
  'Meio Ambiente',
  'Comunidade acadêmica e moradores vizinhos',
  'encerrado',
  25,
  '2026-08-01',
  '2026-10-30',
  'Toledo',
  'Sala Multiuso 104',
  'qua,sab',
  '08:30:00',
  '10:30:00',
  'Prof. Carlos Eduardo Pereira',
  'Inscrições encerradas para a turma atual.',
  'Interesse em práticas sustentáveis.',
  u.id
FROM usuarios u
WHERE u.email = 'carlos.pereira@unioeste.br'
  AND NOT EXISTS (
    SELECT 1 FROM postagens p WHERE p.titulo = 'Educação Ambiental e Separação de Resíduos no Campus'
  );
