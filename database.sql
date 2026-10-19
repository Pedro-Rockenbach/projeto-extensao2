-- Arquivo modelo enquanto nao estamos usando docker
-- Para rodar na sua maquina, digite no terminal:
-- mysql -u root -p < database.sql
-- ou se for ARCH LINUX, digite:
-- mariadb -u root -p < database.sql

CREATE DATABASE IF NOT EXISTS sistema_mural;
USE sistema_mural;

CREATE TABLE usuarios (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    vinculo ENUM('Aluno', 'Professor', 'Servidor') NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    professor VARCHAR(100) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE postagens (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    conteudo TEXT NOT NULL,
    area ENUM('Comunicação', 'Cultura', 'Direitos Humanos e Justiça', 'Educação', 'Meio Ambiente', 'Saúde', 'Tecnologia e Produção', 'Trabalho') NOT NULL,
    publico_alvo VARCHAR(100) NOT NULL,
    status ENUM('abertas', 'andamento', 'encerrado') NOT NULL,
    vagas INT,
    data_inicio DATE,
    data_fim DATE,
    campus ENUM('Cascavel', 'Foz do Iguaçu', 'Francisco Beltrão', 'Marechal Cândido Rondon', 'Toledo') NOT NULL,
    local VARCHAR(100) NOT NULL,
    dia_semana SET('seg', 'ter', 'qua', 'qui', 'sex', 'sab') NOT NULL,
    hora_inicio TIME,
    hora_termino TIME,
    usuario_id INT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario_postagem FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
