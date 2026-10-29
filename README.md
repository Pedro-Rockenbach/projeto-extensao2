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
