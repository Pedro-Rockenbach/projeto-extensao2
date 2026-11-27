# 📌 Mural de Projetos de Extensão

Plataforma web para divulgação, consulta e gerenciamento de projetos de extensão universitária, construída com **Vue.js**, **Node.js (Express)**, **MySQL 8.4** e **Nginx**.

![Node.js](https://img.shields.io/badge/Node.js-22+-339933?style=flat&logo=nodedotjs&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-3-4FC08D?style=flat&logo=vuedotjs&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.4-4479A1?style=flat&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat&logo=docker&logoColor=white)

---

## 📋 Índice

- [Pré-requisitos e Instalação do Docker](#-pré-requisitos-e-instalação-do-docker)
- [Como Rodar com Docker (Recomendado)](#-como-rodar-com-docker-recomendado)
- [Popular o Banco com Dados de Teste](#-popular-o-banco-com-dados-de-teste)
- [Comandos Úteis do Docker](#-comandos-úteis-do-docker)
- [Execução Local (Sem Docker)](#-execução-local-sem-docker)

---

## 🐳 Pré-requisitos e Instalação do Docker

Para rodar o projeto via contêineres, você precisa ter o **Docker** e o **Docker Compose** instalados. Caso ainda não tenha, siga os passos abaixo para o seu sistema operacional:

### Ubuntu / Debian

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
```

### Arch Linux

```bash
sudo pacman -S docker docker-compose
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
```

### Windows e macOS

Baixe e instale o **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** e mantenha o aplicativo aberto antes de executar os comandos no terminal.

> 💡 **Importante (Linux):** Após executar `usermod -aG docker $USER`, faça **logout e login** novamente na sua sessão (ou rode `newgrp docker`) para usar comandos `docker` sem precisar de `sudo`.

---

## 🚀 Como Rodar com Docker (Recomendado)

### 1. Clonar ou atualizar o repositório

**Se for seu primeiro acesso:**

```bash
git clone <URL_DO_REPOSITORIO>
cd projeto-extensao2
```

**Se você já clonou antes e está atualizando (`git pull`):**

```bash
git pull
```

---

### 2. Configurar as variáveis de ambiente

Crie o arquivo `.env` na raiz do projeto a partir do arquivo de exemplo:

```bash
cp .env.example .env
```

Abra o arquivo `.env` e preencha suas credenciais (como `DB_PASSWORD` e um `SESSION_SECRET` forte com pelo menos 32 caracteres).

---

### 3. Subir os contêineres

Na raiz do projeto, suba o banco de dados, o backend e o frontend:

```bash
DB_PORT=3307 docker compose up -d --build
```

> 🔄 **Dica após `git pull`:** Se houver alterações em dependências, `Dockerfile` ou configurações de servidor (`nginx.conf`), use `--build --force-recreate` para garantir que os contêineres sejam reconstruídos com as novidades:
>
> ```bash
> DB_PORT=3307 docker compose up -d --build --force-recreate
> ```

---

### 4. Acessar a aplicação

Aguarde alguns segundos até o MySQL inicializar e acesse no navegador:

- 🌐 **Frontend (Aplicação Web):** [http://localhost:5173](http://localhost:5173)
- ⚙️ **Backend (API):** [http://localhost:3000](http://localhost:3000)

---

## 🌱 Popular o Banco com Dados de Teste

Se o banco de dados acabou de ser criado e está vazio (ou se quiser resetar os dados para os registros iniciais de teste), execute:

```bash
docker compose exec -T db mysql -u root -p"$DB_PASSWORD" sistema_mural -e "SET FOREIGN_KEY_CHECKS=0; TRUNCATE TABLE postagens; TRUNCATE TABLE usuarios; SET FOREIGN_KEY_CHECKS=1;"
docker compose exec -T db mysql -u root -p"$DB_PASSWORD" sistema_mural < seed.sql
```

> ⚠️ **Atenção:** Os comandos acima apagam os registros atuais das tabelas `postagens` e `usuarios` antes de inserir os dados do `seed.sql`.

---

## 🛠️ Comandos Úteis do Docker

| Ação                            | Comando                                                   |
| :------------------------------ | :-------------------------------------------------------- |
| Ver status dos contêineres      | `docker compose ps`                                       |
| Acompanhar logs em tempo real   | `docker compose logs -f`                                  |
| Ver logs apenas do backend      | `docker compose logs -f backend`                          |
| Parar todos os contêineres      | `docker compose down`                                     |
| Parar e apagar volumes do banco | `docker compose down -v` _(remove todos os dados salvos)_ |

---

## 💻 Execução Local (Sem Docker)

Caso prefira rodar o projeto diretamente na sua máquina sem Docker, você precisará de **Node.js 22+** e **MySQL 8+ / MariaDB** instalados e rodando localmente.

1. **Instale as dependências:**

   ```bash
   npm install
   cd frontend && npm install
   ```

2. **Configure o arquivo `.env`:**

   ```bash
   cp .env.example .env
   ```

   Preencha os dados de acesso ao seu banco local no `.env`.

3. **Crie o banco e as tabelas** _(⚠️ apaga dados existentes conforme o script)_:

   ```bash
   mysql -u root -p < database.sql
   ```

   _(No Arch Linux com MariaDB, substitua `mysql` por `mariadb`.)_

4. **Inicie o backend e o frontend em dois terminais separados:**
   - **Terminal 1 (Backend — raiz do projeto):**
     ```bash
     npm run dev
     ```
   - **Terminal 2 (Frontend):**
     ```bash
     cd frontend
     npm run dev
     ```

5. Acesse [http://localhost:5173](http://localhost:5173) no navegador.
   _(Se a API estiver rodando em outro endereço/porta, crie `frontend/.env` com `VITE_API_URL=http://endereco-da-api`.)_
