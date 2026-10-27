-- Arquivo modelo enquanto nao estamos usando docker
-- Para rodar na sua maquina, digite no terminal:
-- mysql -u root -p < database.sql
-- ou se for ARCH LINUX, digite:
-- mariadb -u root -p < database.sql
-- ATENCAO: o banco e recriado do zero, apagando os dados que ja existiam nele.

DROP DATABASE IF EXISTS sistema_mural;
CREATE DATABASE sistema_mural CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sistema_mural;

CREATE TABLE usuarios (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    vinculo ENUM('Aluno', 'Professor', 'Servidor') NOT NULL,
    nome VARCHAR(150) NOT NULL,
    curso VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE postagens (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    conteudo TEXT NOT NULL,
    area ENUM('Comunicação', 'Cultura', 'Direitos Humanos e Justiça', 'Educação', 'Meio Ambiente', 'Saúde', 'Tecnologia e Produção', 'Trabalho') NOT NULL,
    publico_alvo VARCHAR(150) NOT NULL,
    status ENUM('abertas', 'andamento', 'encerrado') NOT NULL,
    vagas INT,
    data_inicio DATE,
    data_fim DATE,
    campus ENUM('Cascavel', 'Foz do Iguaçu', 'Francisco Beltrão', 'Marechal Cândido Rondon', 'Toledo') NOT NULL,
    local VARCHAR(150) NOT NULL,
    dia_semana SET('seg', 'ter', 'qua', 'qui', 'sex', 'sab') NOT NULL,
    hora_inicio TIME,
    hora_termino TIME,
    professor_coordenador VARCHAR(150) NOT NULL,
    inscricao TEXT,
    requisitos TEXT,
    usuario_id INT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT fk_usuario_postagem FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
