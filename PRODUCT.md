# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Uso equilibrado entre dois públicos principais (confirmado pelo usuário, 03/11/2026):

- **Alunos da UNIFOR** — consultam o catálogo do acervo audiovisual disponível na Videoteca, a programação de sessões/eventos, fazem reservas de filmes e acompanham empréstimos e notificações. Uso frequente no celular, fora do balcão.
- **Funcionários da Videoteca (e admin)** — operam a parte administrativa no computador: acervo e cópias, cadastro de filmes com direitos autorais e comprovantes, sessões e publicação na programação, reservas de salas, retirada/devolução de equipamentos, ocorrências, usuários e relatórios.
- **Professores** — consultam disponibilidade e solicitam reserva de salas com dados da turma, e pedem filmes; acompanham o histórico das solicitações.

## Product Purpose

Sistema de gestão da Videoteca da Universidade de Fortaleza: torna visível e reservável o acervo audiovisual, organiza a programação de exibições (cineclube, sessões) e dá ao funcionário uma operação de balcão confiável (empréstimos, devoluções, salas, equipamentos), com regras de negócio aplicadas no servidor (anticonflito de horário, estoque, autorização de exibição). Sucesso: o aluno encontra rápido o que está disponível e consegue reservar; o funcionário registra cada operação sem erro nem retrabalho.

## Positioning

É a ferramenta própria da Videoteca da UNIFOR: catálogo e programação reais do acervo da instituição, com controle de direitos de exibição e operação de balcão integrados num só sistema, por perfil (aluno, professor, funcionário).

## Operating Context

- Projeto acadêmico do curso de ADS (UNIFOR), desenvolvido em sprints por um time de 4 pessoas; será apresentado e avaliado.
- Funcionário: desktop, sessões longas de trabalho, operações repetitivas de balcão.
- Aluno: celular, consultas rápidas entre aulas; também desktop.
- Professor: desktop/celular para solicitar salas com antecedência.
- Homologação publicada na AWS (CloudFront → Fargate → Aurora), em pt-BR.

## Capabilities and Constraints

- Stack existente: Next.js 16 (App Router) + React 19 + Tailwind v4 + lucide-react; API FastAPI em `/api/v1`. Autenticação JWT (cookie `vt_token`) com áreas `/aluno`, `/professor`, `/funcionario`.
- Funcionalidades existentes que o redesenho deve preservar: catálogo e detalhe de filme, favoritos, reservas e empréstimos de filmes, eventos/sessões com inscrição e presença, disponibilidade e reserva de salas (calendário + filtros), solicitações de professor, retirada/devolução de equipamentos com avaria e ocorrências, CRUD de filmes com cartaz, direitos autorais (status, titular, licença, validade, comprovantes) e bloqueio de publicação, privacidade/LGPD (aceite, exportar dados, exclusão), relatórios.
- Interface em português do Brasil; datas/horários no fuso de Fortaleza.
- Acessibilidade e responsividade (360px → desktop) já fazem parte dos requisitos (T20).

## Brand Commitments

- **Marca UNIFOR obrigatória** (confirmado pelo usuário).
- Restrições visuais binding definidas pelo usuário (03/11/2026), com uma referência de app de treino enviada como exemplo de estilo:
  - fundo **branco puro**;
  - **azul UNIFOR `#004AF7`** (amostrado da referência) como cor da marca;
  - cantos arredondados de **4px**;
  - **sem sombras e sem blur**;
  - **evitar modais**: fluxos em página/inline; modal apenas onde for realmente necessário;
  - seguir todas as regras anti "AI slop".
- Logo oficial da UNIFOR **não está no projeto** — usar assinatura tipográfica até o usuário fornecer o arquivo oficial; não desenhar um logo falso.

## Evidence on Hand

- Dados são fictícios de desenvolvimento (`VideoTeca-BackEnd/db/seed/seed_dev.sql`): filmes, cópias, salas, eventos, usuários de demonstração.
- Não existem depoimentos, números de uso, parceiros ou métricas reais — não fabricar.
- Política de privacidade com campos `[A PREENCHER PELA UNIFOR]`.

## Product Principles

1. Disponibilidade primeiro: o que pode ser retirado, reservado ou assistido agora vem antes de qualquer outra coisa.
2. Cada perfil vê só o seu trabalho; o funcionário opera rápido e sem ambiguidade.
3. Regra de negócio explícita na interface: bloqueios (conflito, estoque, direitos) explicam o motivo e o caminho para resolver.
4. Institucional e sóbrio: é um serviço da universidade, não uma vitrine de marketing.

## Accessibility & Inclusion

WCAG 2.1 AA: contraste, foco visível, navegação por teclado, alvos de toque ≥ 44px, `prefers-reduced-motion`, sem rolagem horizontal em 360px.
