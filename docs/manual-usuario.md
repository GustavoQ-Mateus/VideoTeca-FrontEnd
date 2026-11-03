# Manual do usuário — Videoteca UNIFOR (alunos e professores)

Versão 1.0 · outubro/2026 · Sistema web da Videoteca da Biblioteca Central.

> Este manual descreve as telas na ordem em que aparecem no menu lateral (no celular, o menu fica na barra inferior e no botão de menu do topo). Termos entre aspas são os textos exatos dos botões e campos.

## 1. Acesso ao sistema

### 1.1 Entrar
1. Abra o endereço da Videoteca e clique em **Entrar** (ou acesse `/login`).
2. Em **Perfil de acesso**, escolha **Aluno** ou **Professor**.
3. Preencha **Matrícula** (aluno) ou **Matrícula ou SIAPE** (professor). O e-mail institucional também é aceito.
4. Digite a **Senha** e clique em **Entrar**. O ícone de olho mostra/oculta a senha.
5. Você será levado ao seu painel: `/aluno` ou `/professor`.

Mensagens comuns:
- **Credenciais inválidas** — matrícula/e-mail ou senha incorretos.
- **Este usuário não tem perfil de …** — o perfil escolhido não corresponde à sua conta; selecione o perfil correto.
- Muitas tentativas seguidas bloqueiam o login por alguns minutos (proteção contra ataques). Aguarde e tente de novo.

### 1.2 Sessão e segurança
- A sessão expira após 24 horas; ao expirar, qualquer página protegida leva de volta ao login.
- Cada perfil só acessa a própria área: um aluno que abrir um endereço de professor ou funcionário é redirecionado para o seu painel.
- Para sair, use **Sair** no rodapé do menu lateral. Em computadores compartilhados, sempre saia ao terminar.

### 1.3 Páginas públicas (sem login)
- **Catálogo** (`/catalogo`): consulta ao acervo.
- **Eventos** (`/eventos`): programação de sessões e cineclubes publicados.
- **Sobre** (`/sobre`) e **Política de Privacidade** (`/privacidade`).

---

## 2. Aluno

### 2.1 Dashboard (`/aluno`)
Resumo com reservas ativas, empréstimos, eventos inscritos e próximos eventos. Os cartões levam às telas correspondentes.

### 2.2 Catálogo (`/aluno/catalogo`)
1. Use **Buscar filmes no acervo** para pesquisar por título, diretor ou gênero.
2. Refine com **Filtrar por gênero** e **Ordenar por** (A–Z, Mais recentes, Mais procurados).
3. Clique em um filme para abrir o painel **Detalhes do filme** (sinopse, direção, elenco, mídia, localização no acervo).
4. Clique em **Reservar** para solicitar o exemplar. A reserva aparece em **Minhas Reservas**.

### 2.3 Minhas Reservas (`/aluno/reservas`)
- **Reservas Ativas**: reservas aguardando retirada, com o prazo para buscar o exemplar no balcão.
- **Histórico**: reservas concluídas, canceladas ou expiradas.
- Reservas não retiradas no prazo expiram automaticamente.

### 2.4 Empréstimos (`/aluno/emprestimos`)
Lista os empréstimos em aberto com a data de devolução e o status. Itens atrasados aparecem como **Pendência de devolução**. A devolução é feita no balcão da Videoteca.

### 2.5 Eventos (`/aluno/eventos`)
1. Filtre por **Tipo de evento** (Sessão, Cineclube, Debate, Mostra).
2. Abra um evento para ver data, local, filme e vagas.
3. Clique em **Inscrever-se** e depois em **Confirmar**. Após a inscrição, é exibido um QR Code — apresente-o no check-in do evento.
4. Para desistir, cancele a inscrição na mesma tela (libera a vaga).

### 2.6 Favoritos e Notificações
- **Favoritos** (`/aluno/favoritos`): títulos salvos para consultar depois.
- **Notificações** (`/aluno/notificacoes`): avisos de reserva pronta, prazos, atrasos e eventos. Clique para marcar como lida.

### 2.7 Perfil (`/aluno/perfil`)
- **Dados cadastrais**: nome, matrícula, curso, e-mail e telefone. A matrícula não pode ser alterada pelo usuário; correções são feitas pela equipe da Videoteca.
- **Notificações**: escolha os tipos de aviso que deseja receber.
- **Privacidade e dados pessoais**: veja a seção 4.

---

## 3. Professor

### 3.1 Dashboard (`/professor`)
Totais de solicitações (ativas, aprovadas), **Últimas Solicitações** e **Ações rápidas** para pedir filme ou sala.

### 3.2 Solicitar Sala (`/professor/solicitar-sala`)
Consulta de disponibilidade e reserva de sala de exibição:
1. Em **Encontre um horário livre**, informe **Data da reserva**, **Capacidade mínima** e, se precisar, **Recursos necessários** separados por vírgula (ex.: `projetor, som surround`).
2. Clique em **Consultar horários**. Para cada sala compatível aparecem os botões **Livre: hh:mm–hh:mm**.
3. Clique no horário desejado. O formulário da sala abre com **Início** e **Fim** preenchidos (você pode ajustá-los dentro da janela livre).
4. Preencha **Título / finalidade**, **Curso**, **Número de alunos** (até a capacidade da sala) e, opcionalmente, **Observações**. A **Matrícula** vem do seu cadastro.
5. Clique em **Solicitar reserva**. A mensagem **Solicitação #N registrada** confirma o pedido; o horário fica bloqueado enquanto a equipe analisa.

Regras: o horário precisa ser futuro, o fim deve ser posterior ao início e não pode haver conflito com outra reserva ou sessão na sala. Se outra pessoa reservar o mesmo horário antes de você, a tela informa o conflito — consulte novamente.

### 3.3 Solicitar Filme (`/professor/solicitar-filme`)
1. Escolha o **Filme** e a **Data de uso**.
2. Descreva em **Observações / Objetivo pedagógico** como o filme será usado.
3. Envie. A equipe separa o exemplar para a data.

### 3.4 Solicitações (`/professor/solicitacoes`)
Acompanhe o status (Em análise, Aprovado, Recusado) de cada pedido de filme ou sala.

### 3.5 Histórico (`/professor/historico`)
Registro de sessões e usos de sala/filmes por disciplina, com opção de **Exportar relatório**.

### 3.6 Perfil (`/professor/perfil`)
Dados do professor, preferência de avisos e o painel **Privacidade e dados pessoais** (seção 4).

---

## 4. Privacidade e proteção de dados (LGPD)

A política completa está em **Política de Privacidade** (`/privacidade`), acessível sem login. Ela informa os dados coletados, finalidades, base legal, retenção, seus direitos e o contato do encarregado (DPO).

No seu **Perfil**, o painel **Privacidade e dados pessoais** oferece:

1. **Aceite da política** — se aparecer “Você ainda não aceitou a versão …”, leia a política e clique em **Li e aceito a política de privacidade**. A data do aceite fica registrada. Quando a política mudar de versão, o aceite será solicitado novamente.
2. **Baixar meus dados** — gera o arquivo `meus-dados.json` com seu cadastro, reservas, empréstimos, retiradas de equipamento, solicitações e consentimentos (direito de acesso e portabilidade).
3. **Excluir minha conta**:
   1. Clique em **Solicitar exclusão**.
   2. Digite `EXCLUIR` no campo de confirmação e clique em **Confirmar exclusão**.
   3. Se houver empréstimo, retirada de equipamento ou reserva futura em aberto, a exclusão é recusada e a mensagem explica o motivo — regularize a pendência e tente de novo.
   4. Concluída a exclusão, seu nome, e-mail, telefone e matrícula são anonimizados, a sessão é encerrada e não é mais possível entrar com a conta. O histórico do acervo é mantido apenas de forma anônima.

Dúvidas ou outros pedidos (correção de dados, informação sobre compartilhamento): contate o encarregado indicado na política.

---

## 5. Problemas frequentes

| Situação | O que fazer |
|---|---|
| Voltei para o login sem querer | A sessão expirou ou o perfil não tem acesso àquela página. Entre novamente. |
| “Tempo de resposta excedido” | A operação pode ter sido registrada. Confira **Minhas Reservas**/**Solicitações** antes de reenviar. |
| “Não foi possível conectar” | Verifique a internet e tente de novo. |
| Horário que eu vi livre deu conflito | Outra reserva foi feita antes. Clique em **Consultar horários** de novo. |
| Não consigo excluir a conta | Há pendência (empréstimo, retirada ou reserva futura). Regularize no balcão. |
