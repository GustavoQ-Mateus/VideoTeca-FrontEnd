# Manual do funcionário e administrador — Videoteca UNIFOR

Versão 1.0 · outubro/2026. Público: equipe da Videoteca (perfil **Funcionário**) e administradores (perfil **admin**, que acessa a mesma área `/funcionario`).

> Os nomes entre aspas são os textos exatos das telas. Para alunos e professores, veja `manual-usuario.md`.

## 1. Acesso

1. Acesse `/login`, selecione **Funcionário**, informe o **Login** (e-mail institucional ou registro funcional) e a **Senha**, e clique em **Entrar**.
2. Você cai no **Dashboard Administrativo** (`/funcionario`).
3. A área `/funcionario/*` só abre para funcionários e administradores; outros perfis são redirecionados para o próprio painel. A sessão expira em 24 h.
4. Tentativas repetidas de login com senha errada bloqueiam temporariamente o acesso (limite de tentativas).
5. Contas de alunos e professores são criadas pela equipe; apenas administradores criam contas de equipe.

## 2. Dashboard (`/funcionario`)
Indicadores: **Total do Acervo**, **Empréstimos Ativos**, **Itens em Atraso**, **Reservas Pendentes**, **Solicitações Pendentes**, **Próximos Eventos**. Use **Acesso rápido** para as operações do dia e **Ver atrasos** para cobrar devoluções.

## 3. Acervo de filmes e direitos autorais (`/funcionario/acervo`)

### 3.1 Cadastrar ou editar filme
1. Clique em **Cadastrar filme** (ou em **Editar** no cartão do filme).
2. Preencha **Título** (obrigatório), **Ano**, **Diretor**, **Gênero**, **Duração**, **Classificação indicativa** e **Sinopse**.
3. **Cartaz** (opcional): PNG, JPEG ou WebP até 5 MB. A imagem é redimensionada e convertida automaticamente.
4. Preencha o grupo **Direitos autorais e autorização de exibição** (seção 3.2).
5. Clique em **Salvar filme**.

### 3.2 Direitos autorais
| Campo | Como preencher |
|---|---|
| **Status da autorização** | **Pendente** (padrão; ainda não verificado), **Autorizado** (há licença/contrato), **Negado** (o titular recusou) ou **Domínio público**. |
| **Titular dos direitos** | Distribuidora, produtora ou detentor da licença. **Obrigatório** quando o status é Autorizado. |
| **Tipo de licença** | Exibição pública, Uso educacional, Cessão gratuita ou Outro. |
| **Validade da autorização** | Data final da licença. Em branco = sem prazo. Não pode estar no passado para filmes autorizados. Não se aplica a domínio público. |
| **Observações sobre os direitos** | Número do contrato, restrições (ex.: “somente sessões gratuitas”), contato do titular. |

O cartão de cada filme mostra o selo **Direitos: …** e, quando houver, titular, licença e validade. Use **Filtrar por direitos** para listar, por exemplo, só os filmes **Pendentes** que precisam de revisão.

Filmes cadastrados antes desta versão ficaram com status **Pendente** e precisam ser revisados antes de novas publicações.

### 3.3 Comprovantes de autorização
O painel **Comprovantes de autorização** aparece abaixo do formulário quando um filme está aberto para edição (ao cadastrar um filme como Autorizado, o painel aparece logo após salvar).

1. Em **Anexar comprovante**, escolha o arquivo — **PDF, PNG ou JPEG, até 10 MB** (contrato, e-mail de autorização digitalizado, termo de cessão).
2. Clique em **Enviar comprovante**. O arquivo aparece na lista com tamanho, data e quem enviou.
3. **Baixar** faz o download do arquivo original; **Remover** exclui o comprovante (pede confirmação).

O sistema confere o conteúdo real do arquivo: arquivos renomeados (ex.: um `.exe` chamado `.pdf`) são recusados.

### 3.4 Excluir filme
**Excluir** remove o filme do acervo ativo (pede confirmação). Não é permitido enquanto houver sessões futuras publicadas — despublique-as antes.

### 3.5 Exemplares
Em `/funcionario/acervo/[id]/copias` ficam os exemplares físicos (código, patrimônio, estado) usados nos empréstimos de balcão.

## 4. Filmes e sessões (`/funcionario/eventos`)

### 4.1 Criar sessão
1. Clique em **Criar sessão**.
2. Informe **Título da sessão**, **Filme**, **Sala**, **Início**, **Fim**, **Vagas** (até a capacidade da sala) e **Descrição**.
3. **Salvar sessão** cria a sessão como **Rascunho** — ela ainda não aparece para o público.

### 4.2 Publicar e despublicar
- **Publicar** coloca a sessão na programação pública e reserva o horário da sala.
- **Despublicar** retira a sessão da programação (sempre permitido).

A publicação é **bloqueada** quando:
- o filme está **Pendente** ou **Negado**;
- a **validade da autorização** termina antes do fim da sessão;
- o filme está **Autorizado** mas **não tem comprovante anexado**;
- a sessão já passou.

Quando isso acontece, aparece o aviso **Publicação bloqueada por direitos autorais** com o motivo e o link **Regularizar no acervo**, que abre diretamente o filme para edição. Corrija o status/validade, anexe o comprovante, volte a **Filmes e sessões** e clique em **Publicar** novamente.

Filmes em **Domínio público** podem ser publicados sem comprovante.

### 4.3 Presença
Em `/funcionario/eventos/[id]/presenca`, marque **Presente** para cada inscrito no check-in (leitura do QR Code do aluno ou busca por matrícula).

## 5. Empréstimos de filmes

| Tela | Uso |
|---|---|
| **Empréstimos** (`/funcionario/emprestimos`) | **Registrar empréstimo**: informe **Matrícula do aluno** e **Código do exemplar**. A lista **Empréstimos em aberto** mostra prazos; **Devolver** encerra o empréstimo. |
| **Devoluções** (`/funcionario/devolucoes`) | **Localizar Item** pelo **Código do item**, registrar observações e confirmar. |
| **Reservas** (`/funcionario/reservas`) | Reservas feitas pelos alunos; **Confirmar** quando o exemplar estiver separado para retirada. |

## 6. Equipamentos

### 6.1 Retirada (`/funcionario/equipamentos`)
1. Para cadastrar um item novo, abra **Cadastrar equipamento**, informe **Nome**, **Categoria** e **Quantidade total** e clique em **Cadastrar**.
2. Em **Registrar retirada**, escolha o **Equipamento** (a lista mostra quantos estão disponíveis), informe a **Matrícula do solicitante**, a **Quantidade** e o **Prazo de devolução** (futuro).
3. Clique em **Confirmar retirada**. Se não houver unidades suficientes, o sistema informa “Quantidade indisponível”.

### 6.2 Devolução (`/funcionario/equipamentos/devolucoes`)
1. Clique em **Registrar devolução #N** na retirada correspondente.
2. Em **Estado do equipamento**, escolha **Bom estado** ou **Com avaria**. Com avaria, informe **Unidades avariadas** e descreva o dano em **Observações** (obrigatório).
3. Clique em **Confirmar devolução**. O estoque é atualizado; unidades avariadas ficam indisponíveis.

### 6.3 Atrasos e avarias (`/funcionario/equipamentos/ocorrencias`)
Lista retiradas vencidas e devoluções com avaria para cobrança e manutenção.

## 7. Salas e solicitações de professores

- **Salas** (`/funcionario/salas`): salas, capacidade e recursos; **Abrir agenda** mostra a ocupação.
- **Agenda de salas** (`/funcionario/salas/agenda`): visão por hora das reservas e sessões; **Nova reserva** para reservas internas.
- **Solicitações** (`/funcionario/solicitacoes-professores`): pedidos de sala e de filme feitos por professores. Revise, registre uma **Observação interna** se necessário e clique em **Aprovar** ou **Recusar**. O horário da sala fica bloqueado desde o pedido até a decisão.

## 8. Usuários, relatórios e configurações

- **Usuários** (`/funcionario/usuarios`): consulta por nome, matrícula, curso e perfil, com o número de empréstimos ativos.
- **Relatórios** (`/funcionario/relatorios`): acervo por gênero, filmes mais emprestados e uso de salas.
- **Configurações** (`/funcionario/configuracoes`): **Regras de empréstimo** (prazo padrão, limite de itens por aluno, limite de reservas ativas, prazo para retirada) e **Notificações automáticas**. Clique em **Salvar parâmetros**.

## 9. Privacidade e LGPD — responsabilidades da equipe

- A **Política de Privacidade** pública está em `/privacidade`. Antes da produção, a UNIFOR deve preencher os campos destacados **[A PREENCHER PELA UNIFOR: …]** (controlador, operador de nuvem, prazos de retenção, encarregado/DPO).
- Cada usuário pode, no próprio **Perfil**, aceitar a política, **Baixar meus dados** e **Solicitar exclusão**. A exclusão é recusada enquanto houver empréstimo, retirada de equipamento ou reserva futura em aberto — oriente o usuário a regularizar a pendência no balcão.
- A exclusão anonimiza a conta (nome “Usuário removido”, e-mail e telefone apagados) e mantém apenas o histórico agregado. Não é possível reverter.
- Pedidos que chegarem por outros canais (e-mail, balcão) devem ser encaminhados ao encarregado; não exporte dados de terceiros por conta própria.
- Exporte relatórios apenas com os dados necessários; não compartilhe listas de usuários fora da instituição.
- Comprovantes de direitos podem conter dados de contato de representantes do titular: baixe-os só quando necessário e não os envie por canais públicos.

## 10. Problemas frequentes

| Mensagem | Causa e solução |
|---|---|
| Filme sem autorização de exibição válida para esta sessão | Status não é Autorizado/Domínio público, ou validade termina antes da sessão. Use **Regularizar no acervo**. |
| Anexe o comprovante de autorização antes de publicar | Filme Autorizado sem comprovante. Anexe em **Comprovantes de autorização**. |
| Informe o titular dos direitos… | Status Autorizado exige **Titular dos direitos**. |
| A validade da autorização já expirou | Atualize a data ou o status do filme. |
| Envie um arquivo PDF, PNG ou JPEG válido / máximo 10 MB | Converta o comprovante ou reduza a digitalização. |
| Despublique as sessões futuras antes de excluir o filme | Despublique em **Filmes e sessões** e tente de novo. |
| Quantidade indisponível | Não há unidades livres do equipamento; consulte as devoluções pendentes. |
| Matrícula não encontrada | Confira a matrícula em **Usuários**. |
