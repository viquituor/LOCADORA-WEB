# Projeto 📝 Locadora de Veículos - Sistema de Gestão

Este projeto consiste em um sistema completo para gerenciamento de uma locadora de veículos, com Frontend em React e Backend em Node.js + Express + MySQL.

## 📋 Pré-requisitos

Node.js (v18 ou superior)

MySQL (ou MariaDB)

Git (opcional)

## 🚀 Instalação e Configuração

### 1. Clone o repositório (ou baixe os arquivos)

```bash
git clone https://github.com/seu-usuario/locadora-web.git
cd locadora-web
```

### 2. Configure o Backend

#### Instale as dependências - Backend

```bash
cd BACK-END
npm install
```

#### Configure o banco de dados

Crie um banco MySQL chamado locadora.

Importe o script SQL (database.sql) para criar as tabelas.

Edite o arquivo config/database.js com suas credenciais do MySQL.

### 3. Configure o Frontend

#### Instale as dependências - Frontend

```bash
cd FRONT-END
npm install
```

## ⚙️ Iniciando o Sistema

### Opção 1: Iniciar Frontend e Backend separadamente

#### Backend (Node.js)

```bash
cd BACK-END
npm run dev  # Inicia com nodemon (reload automático)
Acesse a API em: `http://localhost:3001`
```

#### Frontend (React)

```bash
cd FRONT-END
npm start
Acesse o sistema em: `http://localhost:3000`
```

### Opção 2: Iniciar ambos simultaneamente (recomendado)

```bash
npm run dev  # Execute na raiz do projeto
Isso inicia Frontend (React) e Backend (Node.js) ao mesmo tempo usando concurrently.

```

## 🌐 Endpoints da API (Backend)

|Rota | Método | Descrição|
|-----|--------|----------|
|/clientes | GET | Lista todos os clientes |
|/clientes | POST | Cadastra um novo cliente |
|/clientes/:habilitacao | PUT | Edita dados de um cliente |
|/clientes/:habilitacao | DELETE | Remove um cliente |
||||
|/veiculo | GET | Lista todos os veículos |
|/veiculo | POST | Cadastra um novo veículo |
|/veiculo/:chassi | PUT | Edita dados de um veículo |
|/veiculo/:chassi | DELETE | Remove um veículo |
||||
|/locacoes | GET | Lista todas as locações |
|/locacoes | POST | Realiza uma nova locação |
|/locacoes/encerrar | PUT | Encerra uma locação |
|/locacoes/:id_locacao | PUT | Edita dados de uma locação |
|/locacoes/:id_locacao | DELETE | Remove uma locação |
||||
|/categorias | GET | Lista todos as categorias |
|/categoria | POST| Cadastra uma nova categoria |
|/categoria/:id_categoria | DELETE | Deleta uma categoria |

## 🛠 Estrutura do Projeto

´´´text
locadora-web/
├── FRONT-END/           # Aplicação React
│   ├── src/
│   │   ├── pages/       # Telas do sistema (Clientes, Veículos, Locações)
│   │   ├── styles/      # CSS modularizado
│   │   └── App.js       # Rotas principais
│   └── package.json
│
├── BACK-END/            # API Node.js
│   ├── routes/          # Rotas da API
│   ├── models/          # Modelos do banco de dados
│   ├── config/          # Configurações (banco de dados)
│   └── app.js           # Servidor principal
│
└── package.json         # Script para iniciar ambos (front + back)
´´´

## 📌 Observações

### O backend roda na porta 3001 (API REST)

### O frontend roda na porta 3000 (React App)

### Certifique-se de que o MySQL está rodando antes de iniciar o backend

### Use Ctrl+C para encerrar os servidores

## 🔧 Solução de Problemas

### Erro de conexão com o MySQL: Verifique as credenciais no arquivo BACK-END/config/database.js

### Dependências faltando: Execute npm install novamente na pasta correspondente

### Portas em uso: Feche outros programas usando as portas 3000 ou 3001
