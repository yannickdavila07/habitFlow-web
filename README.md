# HabitFlow Web

Interface web do **HabitFlow**, um gerenciador de hábitos com autenticação por e-mail, painel interativo e animações suaves. Consome a API REST do backend [`habitFlow`](#backend) (Spring Boot).

![React](https://img.shields.io/badge/React-19-09CBC2?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3C507D?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-E0C58F?style=flat-square&logo=vite&logoColor=112250)
![Tailwind](https://img.shields.io/badge/Tailwind-4-09CBC2?style=flat-square&logo=tailwindcss&logoColor=white)

## Destaques

- **Autenticação completa:** cadastro, verificação por código de 6 dígitos enviado ao e-mail (com reenvio e contagem regressiva) e login com JWT.
- **Sessão resiliente:** renovação automática do token ao receber `401`, com uma única requisição de refresh compartilhada, e logout se a renovação falhar.
- **Gestão de hábitos:** criar, editar, excluir, ativar/pausar e filtrar por frequência e estado.
- **Interface otimista:** o toggle de ativo responde na hora e reverte em caso de erro.
- **Animações modernas:** transições de página, entrada escalonada dos cards, pílulas de filtro que deslizam, modais com mola, contadores animados e skeleton de carregamento. Respeita `prefers-reduced-motion`.
- **Design próprio:** tema escuro com vidro translúcido e a paleta abaixo, responsivo e com foco visível.

## Paleta

| Cor | Hex | Uso |
|---|---|---|
| Navy | `#112250` | Fundo |
| Slate | `#3C507D` | Superfícies e bordas |
| Teal | `#09CBC2` | Ação primária e foco |
| Cream | `#F5F0E9` | Texto |
| Gold | `#E0C58F` | Destaques |

## Stack

- **React 19** e **TypeScript**, empacotados com **Vite**
- **Tailwind CSS v4** (tokens definidos em `src/index.css`)
- **Motion** para animações
- **TanStack Query** para cache e mutações
- **React Router**, **React Hook Form** e **Zod**
- **Lucide** para ícones

## Como rodar

Pré-requisitos: Node.js e o backend em execução em `http://localhost:8080`.

```bash
npm install --legacy-peer-deps
cp .env.example .env
npm run dev
```

Abra http://localhost:5173. Essa é a única origem liberada no CORS do backend.

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Checagem de tipos e build de produção |
| `npm run lint` | Lint com oxlint |
| `npm run preview` | Pré-visualiza o build |

### Variáveis de ambiente

| Variável | Padrão | Descrição |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8080` | URL base da API |

## Arquitetura

```
src/
├── lib/api.ts              Cliente HTTP: Bearer, refresh de token, erros
├── auth/AuthContext.tsx    Sessão, useAuth e rotas protegidas
├── features/habits/        Tipos e hooks do TanStack Query
├── components/             Primitivos de UI, cards e modais
└── pages/                  Landing, Login, Cadastro, Verificação, Painel
```

## Backend

A API fica no projeto `habitFlow` (Spring Boot, PostgreSQL, JWT). Endpoints usados:

| Método | Rota | Descrição |
|---|---|---|
| POST | `/login`, `/login/refresh` | Login e renovação de token |
| POST | `/login/create` | Cadastro |
| POST | `/login/verificar`, `/login/reenviarcodigo` | Verificação de e-mail |
| GET, POST, PUT | `/habitos` | Listar (com filtros), criar e atualizar |
| PATCH | `/habitos/{id}/{ativar\|desativar}` | Alterar estado |
| DELETE | `/habitos/{id}` | Excluir |

## Licença

Sem licença definida até o momento.
