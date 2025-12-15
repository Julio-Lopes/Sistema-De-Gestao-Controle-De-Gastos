# Sistema de Controle de Gastos

Sistema web fullstack para gerenciamento de despesas pessoais e categorização de transações financeiras.

## Tecnologias

### Backend
- **.NET 9.0** - API RESTful
- **Entity Framework Core** - ORM
- **MySQL** - Banco de dados
- **JWT** - Autenticação e autorização
- **BCrypt** - Criptografia de senhas
- **Swagger** - Documentação da API

### Frontend
- **React 19** - Interface de usuário
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **React Router** - Roteamento
- **Axios** - Requisições HTTP

## 📋 Funcionalidades

- Autenticação de usuários (Login/Registro)
- Gerenciamento de categorias de gastos
- Cadastro de pessoas
- Controle de transações financeiras
- Dashboard com visão geral
- Relatórios de despesas

## ⚙️ Pré-requisitos

- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js](https://nodejs.org/) (v18 ou superior)
- [MySQL](https://www.mysql.com/) (v8 ou superior)

## 🔧 Configuração

### 1. Banco de Dados

Crie o banco de dados MySQL:
```sql
CREATE DATABASE controle_gastos;
```

Configure a string de conexão em `ControleGastos.API/appsettings.json` conforme seu ambiente.

### 2. Backend (.NET API)

```bash
# Navegar para a pasta da API
cd ControleGastos.API

# Restaurar dependências
dotnet restore

# Aplicar migrations ao banco de dados
dotnet ef database update

# Executar a API
dotnet run
```

A API estará disponível em `http://localhost:5013` (ou a porta configurada).
Acesse a documentação Swagger em `http://localhost:5013/swagger`.

### 3. Frontend (React)

```bash
# Navegar para a pasta do frontend
cd controle-gastos-frontend

# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev
```

O frontend estará disponível em `http://localhost:5173`.
Para alterar a url da api acesse o arquivo /services/api.ts e altere a variavel API_URL.

## 📦 Build para Produção

### Backend
```bash
cd ControleGastos.API
dotnet publish -c Release -o ./publish
```

### Frontend
```bash
cd controle-gastos-frontend
npm run build
```

Os arquivos de build estarão na pasta `dist/`.

## 🗂️ Estrutura do Projeto

```
desafio-maxprod/
├── ControleGastos.API/        # Backend .NET
│   ├── Controllers/           # Endpoints da API
│   ├── Data/                  # Contexto do EF Core
│   ├── DTOs/                  # Data Transfer Objects
│   ├── Models/                # Modelos de dados
│   ├── Services/              # Lógica de negócio
│   └── Migrations/            # Migrações do banco
│
└── controle-gastos-frontend/  # Frontend React
    ├── src/
    │   ├── components/        # Componentes reutilizáveis
    │   ├── contexts/          # Context API (Auth)
    │   ├── pages/             # Páginas da aplicação
    │   ├── services/          # Integração com API
    │   └── types/             # Definições TypeScript
    └── public/                # Arquivos estáticos
```
