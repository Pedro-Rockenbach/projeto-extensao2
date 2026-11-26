-- Executar uma vez em bancos ja existentes, antes de provisionar credenciais.
ALTER TABLE usuarios
    ADD COLUMN senha_hash VARCHAR(255) NULL AFTER email;
