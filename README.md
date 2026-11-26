# README TEMPORARIO

## Passos para executar o projeto

1 - Clonar o Repositorio

2 - Instalar as dependencias (precisa do Node.js 22 ou mais novo):

```
npm install
```

```
cd frontend/
npm install
```

3 - configuracao do banco de dados

Voce deve ter o mysql ou mariadb instalado e rodando na maquina, então:

```
cp .env.example .env
```

dentro da sua .env criada, preencha com os seus dados.

Depois crie o banco e as tabelas (ATENCAO: apaga os dados que ja existiam nele):

```
mysql -u root -p < database.sql
```

No Arch Linux, troque `mysql` por `mariadb`.

### Atualizacao de um banco ja existente

Se voce ja tinha criado o banco antes desta atualizacao, aplique a migracao abaixo
uma unica vez, a partir da raiz do projeto. Ela adiciona a coluna `senha_hash`
necessaria para o login e preserva os dados existentes:

```
mysql -u root -p sistema_mural < database/migrations/001_adicionar_hash_senha.sql
```

No Arch Linux, use `mariadb` no lugar de `mysql`. Se o nome do banco configurado
em `DB_NAME` no arquivo `.env` for diferente de `sistema_mural`, substitua esse
nome no comando. Quem acabou de criar o banco usando `database.sql` nao precisa
rodar a migracao, pois a coluna ja esta incluida nesse arquivo.

### Cadastro manual de usuario

O projeto ainda nao possui uma tela de cadastro. Para criar um usuario manualmente,
gere primeiro o hash da senha, na raiz do projeto:

```
npm run senha:hash
```

Informe e confirme uma senha com pelo menos 12 caracteres. O terminal mostra o
hash, nao a senha. Copie o valor completo, que comeca com `scrypt$`.

Conecte-se ao banco (substitua `sistema_mural` se voce configurou outro nome em
`DB_NAME` no arquivo `.env`):

```
mysql -u root -p sistema_mural
```

No Arch Linux, use `mariadb` no lugar de `mysql`. No prompt do banco, insira o
usuario substituindo os valores de exemplo e colando o hash gerado:

```sql
INSERT INTO usuarios (vinculo, nome, curso, email, senha_hash)
VALUES ('Aluno', 'Seu nome', 'Seu curso', 'seu.email@exemplo.com', 'scrypt$COLE_O_HASH_AQUI');
```

O campo `vinculo` aceita `Aluno`, `Professor` ou `Servidor`, e cada usuario
precisa de um e-mail unico. Nao insira a senha em texto puro no banco. Se o
e-mail ja existir, atualize a senha da conta com o hash novo:

```sql
UPDATE usuarios
SET senha_hash = 'scrypt$COLE_O_HASH_AQUI'
WHERE email = 'seu.email@exemplo.com';
```

4 - Rodar o projeto (um terminal para cada):

Backend, na raiz do projeto (reinicia sozinho quando um arquivo muda):

```
npm run dev
```

Frontend:

```
cd frontend/
npm run dev
```

Abra http://localhost:5173 no navegador.

Se a API estiver em outro endereco, crie `frontend/.env` com `VITE_API_URL=http://endereco-da-api`.

5 - Divirta-se !
