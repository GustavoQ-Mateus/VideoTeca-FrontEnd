# Design system — Videoteca UNIFOR

Guia de referência dos tokens, componentes e padrões de acessibilidade do frontend
(Next.js 16 · React 19 · Tailwind CSS v4 · lucide-react).

- Tokens: `src/app/globals.css` (`:root` + `@theme inline`)
- Componentes base: `src/components/ui/*`
- Layout: `src/components/layout/*`
- Meta: **WCAG 2.2 nível AA**, mobile-first (360 px → desktop), sem rolagem horizontal.

---

## 1. Tokens

Os valores ficam em variáveis CSS no `:root`. O bloco `@theme inline` expõe esses
valores como **classes utilitárias do Tailwind**; mude o token no `:root` e todas as
classes acompanham. Os nomes são semânticos para **não** sobrescrever as escalas
padrão do Tailwind (`rounded-lg`, `shadow-md`, `text-sm` etc. continuam iguais).

> Código novo deve usar as classes semânticas (`bg-brand`, `text-fg-subtle`…) em vez de
> hex arbitrário (`bg-[#0066B3]`). O hex legado continua funcionando.

### 1.1 Cores

| Classe (Tailwind) | Variável | Valor | Uso | Contraste em branco |
|---|---|---|---|---|
| `brand` | `--unifor-blue` | `#0066B3` | ações primárias, links, foco | 5.9:1 |
| `brand-hover` | `--unifor-blue-hover` | `#005599` | hover de primária | 7.6:1 |
| `brand-subtle` | `--unifor-blue-light` | `#E8F2FC` | fundos de destaque | — |
| `brand-navy` | `--unifor-navy` | `#003A70` | sidebar, cabeçalhos escuros | 11.4:1 |
| `brand-red` / `brand-yellow` / `brand-green` | `--unifor-*` | | **decorativas** (ícones, pontos) | não usar como texto |
| `canvas` | `--bg` | `#F5F7FA` | fundo da aplicação | — |
| `surface` | `--bg-card` | `#FFFFFF` | cartões, painéis | — |
| `surface-subtle` | `--bg-subtle` | `#FAFBFC` | zebra de tabela | — |
| `line` | `--border` | `#E2E8F0` | divisores (decorativo) | — |
| `line-strong` | `--border-strong` | `#C4CDD8` | bordas de botões outline | — |
| `input` | `--border-input` | `#8A94A6` | borda de campos de formulário | 3.1:1 (WCAG 1.4.11) |
| `fg` | `--text-primary` | `#172033` | texto principal | 16.4:1 |
| `fg-muted` | `--text-secondary` | `#475467` | texto secundário | 7.7:1 |
| `fg-subtle` | `--text-tertiary` | `#667085` | legendas, metadados, placeholder | 4.97:1 |
| `fg-disabled` | `--text-disabled` | `#98A2B3` | **apenas** desabilitado/decorativo | 2.6:1 (isento) |
| `fg-inverse` | `--text-on-dark` | `#FFFFFF` | texto sobre `brand`/`brand-navy` | — |
| `danger` / `danger-strong` / `danger-subtle` | `--danger*` | `#B42318` / `#C4321C` / `#FEF3F2` | erro (texto) / botão destrutivo / fundo | 6.6:1 / 5.5:1 |
| `success` / `success-subtle` | `--success*` | `#067647` / `#ECFDF3` | sucesso | 5.7:1 |
| `warning` / `warning-subtle` | `--warning*` | `#93370D` / `#FFFAEB` | atenção | 7.5:1 |
| `info` / `info-subtle` | `--info*` | `#0066B3` / `#E8F2FC` | informação | 5.9:1 |
| `av`, `av-card`, `av-muted` | `--av-*` | `#101828`… | áreas audiovisuais escuras | — |

**Correção de contraste (T20.1):** `--text-tertiary` era `#98A2B3` (2.6:1, reprovado em AA
para texto). Passou a `#667085` (4.97:1). Como várias páginas usam o hex literal
`text-[#98A2B3]`, o `globals.css` remapeia essa classe (e `placeholder:text-[#98A2B3]`)
para o token, sem alterar estados `hover:`. O vermelho da marca `#E7472E` (3.9:1) também
não é usado como texto; erros usam `--danger`.

Status de acervo/empréstimo: `Badge status="..."` usa os pares de `STATUS_COLORS`
(`src/lib/utils.ts`), todos com texto `*-700` sobre fundo `*-100` (≥ 4.5:1).

### 1.2 Tipografia

Fontes carregadas por `next/font` em `src/app/layout.tsx` (sem `@import` do Google Fonts):

| Classe | Fonte | Uso |
|---|---|---|
| `font-sans` (padrão do body) | Inter (`--font-inter`) | texto corrido, UI |
| `font-display` (padrão de h1–h6) | Poppins (`--font-poppins`) | títulos |

Escala (tamanho / altura de linha). Mínimo de 11 px para qualquer texto; corpo ≥ 14 px.

| Classe | Tamanho | Linha | Uso |
|---|---|---|---|
| `text-caption` | 12 px | 16 px | legendas, metadados, badges |
| `text-body-sm` | 14 px | 20 px | UI densa, tabelas, formulários |
| `text-body` | 16 px | 24 px | texto corrido |
| `text-title-sm` | 18 px | 24 px | título de cartão (`CardTitle`) |
| `text-title` | 20 px | 28 px | título de seção |
| `text-title-lg` | 24 px | 32 px | título de página |
| `text-display` | 32 px | 40 px | destaques (hero, 404) |

As classes padrão (`text-xs`…`text-4xl`) continuam disponíveis.
Rótulos de seção em caixa alta: classe `.section-label` (11 px, 600, tracking 0.08em).

### 1.3 Raios, sombras, movimento, layout

| Classe | Variável | Valor | Uso |
|---|---|---|---|
| `rounded-chip` | `--r-xs` | 6 px | checkbox, chips |
| `rounded-control` | `--r-sm` | 10 px | botões, campos |
| `rounded-panel` | `--r-md` | 14 px | toasts, ícones de StatCard |
| `rounded-card` | `--r-lg` | 18 px | cartões, tabelas |
| `rounded-sheet` | `--r-xl` | 24 px | bottom sheet (Modal no mobile) |
| `rounded-pill` | `--r-full` | 9999 px | badges |
| `shadow-card` / `shadow-raised` / `shadow-overlay` / `shadow-brand` | `--shadow-sm/md/lg/blue` | | elevação |

Movimento: `--dur-fast` 150 ms, `--dur-base` 220 ms, `--dur-panel` 280 ms, `--ease-out`.
Classes `.motion-fade`, `.motion-up`, `.motion-slide-up`, `.motion-right`, `.motion-left`,
`.motion-scale`, `.stagger-1..6` só animam com `prefers-reduced-motion: no-preference`.
Com **reduzir movimento** ativo, `globals.css` zera animações e transições globalmente
(shimmer do skeleton e spinner ficam estáticos). Em componentes, use também
`motion-reduce:transition-none`.

Layout: `--topbar-h` 56 px, `--sidebar-w` 256 px, `--sidebar-w-collapsed` 72 px,
`--bottom-nav-h` 64 px, `--touch-target` 44 px.

---

## 2. Componentes base (`src/components/ui`)

Todas as props listadas como "novas" são **opcionais**; as APIs anteriores foram mantidas.

### Button
```tsx
<Button>Salvar</Button>
<Button variant="outline" size="sm">Cancelar</Button>
<Button variant="danger" loading loadingText="Excluindo…">Excluir</Button>
<Button size="icon" aria-label="Fechar"><X aria-hidden /></Button>
```
- `variant`: `primary` | `secondary` | `ghost` | `danger` | `outline`
- `size`: `sm` (36 px) | `md` (44 px, padrão) | `lg` (48 px) | `icon` (44×44, **novo**)
- `loading`: spinner decorativo + `aria-busy` + desabilita cliques
- Novas: `loadingText`, `leftIcon`, `rightIcon`, `fullWidth`
- Sem `type` explícito o botão é `submit` (comportamento HTML); informe `type="button"` fora de formulários.

### Input, Select, Textarea, Checkbox
```tsx
<Input label="E-mail" type="email" required helper="Use o e-mail institucional" error={errors.email} />
<Select label="Curso" name="course">…</Select>
<Textarea label="Observações" name="notes" helper="Até 2000 caracteres" />
<Checkbox label="Aviso de atraso" description="Enviado 1 dia após o prazo" />
```
- `label` sempre associado ao campo (`htmlFor`/`id`). Sem `id`, o id é gerado
  (`useId`), então não há colisão quando dois campos têm o mesmo rótulo.
- `error` → `aria-invalid="true"`, borda `danger` e mensagem com `role="alert"` ligada por
  `aria-describedby`. `helper` também entra no `aria-describedby`.
- `required` → asterisco visual (`aria-hidden`) + "(obrigatório)" para leitores de tela.
- Estados `disabled` (fundo `canvas`, texto `fg-disabled`), `read-only` e foco
  (borda `brand` + anel 2 px) visíveis. Altura de 44 px.
- Novas: `helper` (Select/Textarea), `hideLabel`, `containerClassName`;
  Checkbox: `description`, `error`. Utilitários exportados: `joinIds`, `FIELD_BASE`, `FIELD_ERROR`.

### Badge
`<Badge status="late" />` (rótulo e cor de `STATUS_*`) ou `<Badge label="Novo" tone="brand" />`.
Novas: `tone` (`neutral|brand|success|warning|danger|info`), `size` (`sm|md`). O ponto é decorativo.

### Card
`Card` (`hover`, novo `padded`), `CardHeader`, `CardBody`, e novos `CardTitle` (h2) e `CardFooter`.
Padding responsivo (16 px no mobile, 24 px a partir de `sm`).

### StatCard
`<StatCard label="Empréstimos" value={12} icon={BookOpen} accent="green" />`.
Novo `loading`. A ordem de leitura é rótulo → valor; a tendência tem texto "Alta/Queda" para leitores de tela.

### Tabs
```tsx
<Tabs tabs={…} value={tab} onChange={setTab} ariaLabel="Empréstimos" idPrefix="emp" withPanels />
<TabPanel idPrefix="emp" tab="ativos">…</TabPanel>
```
Padrão WAI-ARIA: `role=tablist/tab`, `aria-selected`, foco itinerante, setas ←/→/↑/↓, Home/End.
Novas: `ariaLabel`, `idPrefix`, `withPanels`, `TabItem.disabled`, componente `TabPanel`.

### AlertBanner
`<AlertBanner variant="warning" title="Pendência">…</AlertBanner>`.
Nova variante `error`; novas props `action`, `onDismiss`, `live` (`polite` → `role=status`,
`assertive` → `role=alert`, padrão para `error`; `off` sem região viva). Prefixo
"Atenção:/Erro:…" lido por leitores de tela.

---

## 3. Layout responsivo (`src/components/layout`)

| Faixa | Navegação |
|---|---|
| < 1024 px (mobile/tablet) | `TopBar` com botão "Abrir menu" → **gaveta modal** com a `Sidebar` completa; `MobileBottomNav` com 4 atalhos fixos no rodapé |
| ≥ 1024 px (desktop) | `Sidebar` fixa (sticky), **recolhível** para 72 px (só ícones); preferência salva em `localStorage` (`vt:sidebar-collapsed`) |

- `AppShell` (props existentes + novas `breadcrumbs`, `mainClassName`) renderiza
  `<main id="main-content" tabIndex={-1}>`, alvo do link "Pular para o conteúdo".
- Gaveta mobile: `role="dialog"`, foco no primeiro item ao abrir, Tab preso, **Esc fecha**,
  foco volta ao botão de menu, rolagem do fundo bloqueada, fecha ao navegar. Fechada, fica
  `inert` (não recebe foco nem é lida).
- Landmarks: `header` (TopBar), `nav aria-label="Menu principal"` (Sidebar),
  `nav aria-label="Atalhos"` (barra inferior), `main`. Item ativo com `aria-current="page"`
  (a raiz da área só fica ativa na própria página).
- Alvos de toque ≥ 44 px em todos os itens de navegação e botões de ícone do TopBar.
- Sem rolagem horizontal em 360–390 px (validado com Playwright: `scrollWidth === clientWidth`).
- `TopBar`: novas props `menuButtonRef`, `menuExpanded` (`aria-expanded`), `menuControls` (`aria-controls`).
  Busca dentro de `<form role="search">`.
- `Sidebar`: novas props `collapsed`, `onToggleCollapse`, `onClose`. Contadores têm texto
  para leitor de tela ("2 pendentes").

### DataTable
```tsx
<DataTable columns={cols} data={rows} rowKey={(r) => r.id} caption="Cópias do filme" />
```
- `mobileLayout="cards"` (padrão): abaixo de 768 px cada linha vira um cartão
  rótulo/valor (rótulo vem de `header` ou `Column.mobileLabel`; `Column.hideOnMobile` oculta).
  Um único DOM — papéis ARIA de tabela explícitos para manter a semântica.
- `mobileLayout="scroll"`: mantém a tabela com rolagem horizontal; o contêiner é uma
  `region` focável por teclado com o nome da legenda.
- Novas: `caption`, `captionVisible`, `mobileLayout`, `className`; `Column.mobileLabel`, `Column.hideOnMobile`.

### PaginationBar
`<nav aria-label="Paginação">`, botões com "Página N", `aria-current="page"`, "Página X de Y"
anunciado (`aria-live`). No mobile, Anterior/Próxima viram ícones e os alvos têm 44 px. Nova: `ariaLabel`.

### Breadcrumbs
`<nav aria-label="Trilha de navegação"><ol>…</ol></nav>`, último item com `aria-current="page"`. Nova: `className`.

---

## 4. Carregamento, feedback e acessibilidade

| Componente | Contrato |
|---|---|
| `Spinner` (novo) | `size` `xs/sm/md/lg`; `role="status"` + rótulo (`label`, padrão "Carregando…"); `decorative` esconde de leitores (uso dentro de Button) |
| `Skeleton`, `SkeletonCard` | sempre `aria-hidden`. Novos: `SkeletonText`, `SkeletonRows`, `PageSkeleton` |
| `LoadingRegion` (novo) | wrapper com `aria-busy` + texto `role="status"` só para leitores de tela |
| `EmptyState` | ícone lucide decorativo (`aria-hidden`); título `h2` (configurável com `titleAs`); novas `actionHref`, `action`, `className` |
| `Modal` | `role="dialog" aria-modal aria-labelledby` (ids únicos via `useId`), foco inicial no painel (ou `initialFocusRef` / `[data-autofocus]`), **focus trap**, **Esc**, **retorno de foco**, bloqueio de rolagem (com contagem para diálogos aninhados). Bottom sheet no mobile. Novas: `description`, `initialFocusRef`, `closeOnBackdrop`, `className` |
| `Drawer` | mesmo contrato do Modal (hook `useDialogA11y` exportado de `Modal.tsx`); agora fecha com Esc. Novas: `footer`, `description`, `initialFocusRef`, `className` |
| `ToastProvider` / `useToast` | duas regiões `aria-live` sempre montadas (sem role nos contêineres vazios): `polite` (`success`, `info`) e `assertive` (`error`, nova `warning`). Prefixo "Erro:/Sucesso:" lido. Pausa com mouse/foco. Novas: `duration` por toast, `toast()` retorna o id, `dismiss(id)` no contexto. Funciona fora de HTTPS (fallback de id) |
| `VisuallyHidden` (novo) | conteúdo só para leitores de tela (`focusable` para mostrar ao focar) |
| `SkipLink` (novo, em `VisuallyHidden.tsx`) | "Pular para o conteúdo" no `layout.tsx`; foca `#main-content` ou, nas páginas públicas, o primeiro `<main>`/`<h1>` |

Páginas de sistema:
- `src/app/{aluno,professor,funcionario}/loading.tsx` — `AppShell` da área + `PageSkeleton`.
- `src/app/not-found.tsx` — 404 amigável com links para início e catálogo.
- `layout.tsx` exporta `viewport` (sem bloquear zoom; `viewport-fit=cover` para safe areas).

### Checklist para novas telas
1. Use `AppShell`; um único `h1` (o título do `TopBar`), seções com `h2`.
2. Campos sempre com `label` (ou `hideLabel`), erros via prop `error`.
3. Botões só de ícone: `aria-label` + ícone `aria-hidden`; alvo ≥ 44 px (`size="icon"`).
4. Ícones lucide decorativos com `aria-hidden`.
5. Carregamento: `LoadingRegion` + skeletons; ações assíncronas com `Button loading`.
6. Resultado de ação: `useToast()` (`error` para falhas).
7. Teste em 360 px, com teclado (Tab/Shift+Tab/Esc) e com "reduzir movimento".
