# VideoTeca-FrontEnd

Interface web do sistema de gestão da **Videoteca UNIFOR**.

- **Stack:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4
- **UI:** lucide-react (ícones), recharts (gráficos), design system próprio em `globals.css`
- **Alvo de deploy:** AWS Amplify (T27)

## Estrutura

```
src/
├── app/                    # rotas (App Router)
│   ├── (público)           # /catalogo, /eventos, /sobre, /login
│   ├── aluno/              # área do aluno
│   ├── professor/          # área do professor
│   ├── funcionario/        # painel administrativo
│   ├── globals.css         # design tokens + base do design system
│   └── layout.tsx          # fontes (Inter/Poppins) + ToastProvider
├── components/
│   ├── ui/                 # primitivos (Button, Card, Input, Modal, DataTable…)
│   ├── layout/             # AppShell, Sidebar, TopBar, MobileBottomNav
│   ├── catalog/            # FilmDetailView
│   └── providers/          # ToastProvider
├── lib/                    # api.ts, auth.ts, types.ts, constants.ts, utils.ts, films.ts
└── middleware.ts           # proteção de rotas por sessão
```

## Rodar localmente

```bash
npm install
cp .env.example .env.local     # defina NEXT_PUBLIC_API_URL
npm run dev                    # http://localhost:3000
```

## Variáveis de ambiente

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_API_URL` | URL base da API (ex.: `http://localhost:8000`) |

## Design system

Os tokens de marca (cores UNIFOR, tipografia, sombras, motion, raios) vivem em
`src/app/globals.css` e são a **base do redesenho** (tarefa **T20 — Design system e
responsividade**). Componentes novos devem consumir esses tokens em vez de valores
hardcoded.

> Redesenho completo da interface = T20 (Sprint 6). Esta base já está estruturada
> para evoluir sem reescrever a arquitetura de rotas/componentes.
