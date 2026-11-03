# Deploy do FrontEnd — AWS Amplify Hosting

Tarefa **T24.3** (publicação da versão de produção; hospedagem prevista na T27).
Build definido em [`amplify.yml`](../amplify.yml). O runbook da API (Terraform,
migrations, rollback) fica no BackEnd: `docs/RELEASE.md`.

## 1. Arquitetura

```
Navegador ──HTTPS──▶ Amplify (Next.js SSR + estáticos em CDN)
     │
     └──HTTPS──▶ API (NEXT_PUBLIC_API_URL) ──▶ ALB ──▶ ECS Fargate ──▶ Aurora
```

- O Next.js roda em modo SSR (rotas protegidas por `src/middleware.ts`), por isso
  o app no Amplify usa a plataforma **WEB_COMPUTE** (detectada automaticamente
  ao conectar o repositório).
- `NEXT_PUBLIC_API_URL` é **embutida no bundle no momento do build**: mudar a
  variável exige um novo build (Redeploy this version).

## 2. Criar o app (uma vez)

1. Console AWS (conta `765656213653`, região `us-east-1`) → **Amplify** →
   *Create new app* → **GitHub** → autorizar a GitHub App do Amplify só para o
   repositório `GustavoQ-Mateus/VideoTeca-FrontEnd`.
2. Branch de produção: `main`. O Amplify lê o `amplify.yml` da raiz.
3. *Advanced settings* → **Environment variables**:

| Variável | Branch | Valor |
|----------|--------|-------|
| `NEXT_PUBLIC_API_URL` | `main` (produção) | URL **HTTPS** pública da API, sem barra final |
| `NEXT_PUBLIC_API_URL` | `developer` / previews | URL da API de homologação |

4. *Save and deploy*. A URL inicial é `https://main.<app-id>.amplifyapp.com`.
5. No BackEnd, cadastre essa URL (e o domínio próprio, se houver) em
   `CORS_ORIGINS` do environment GitHub `production` e faça um deploy da API —
   sem isso o navegador bloqueia as chamadas (CORS).

Via CLI (alternativa, PowerShell):

```powershell
$env:AWS_PROFILE = "prdal-gustavo"
aws amplify create-app --name videoteca-frontend --platform WEB_COMPUTE `
  --repository https://github.com/GustavoQ-Mateus/VideoTeca-FrontEnd `
  --access-token <token-github-fine-grained-somente-leitura>
aws amplify create-branch --app-id <app-id> --branch-name main --stage PRODUCTION `
  --environment-variables NEXT_PUBLIC_API_URL=https://api.exemplo.unifor.br
```

O token do GitHub é usado só na criação; prefira o fluxo do console (GitHub App).

## 3. HTTPS e domínio

- O Amplify sempre serve HTTPS (certificado gerenciado em `*.amplifyapp.com`).
- **Domínio próprio**: Amplify → *Hosting* → *Custom domains* → *Add domain*.
  Com o domínio no Route 53 os registros são criados automaticamente; em DNS
  externo, crie o CNAME de validação do certificado e o CNAME/ALIAS indicado.
  O certificado ACM é emitido e renovado pelo Amplify; HTTP redireciona para
  HTTPS.
- **A API também precisa de HTTPS.** Hoje o ALB da API tem apenas listener
  HTTP:80; página HTTPS chamando API HTTP é bloqueada pelo navegador (*mixed
  content*). Opções, em ordem de preferência:
  1. domínio para a API (ex.: `api.videoteca…`) + certificado ACM + listener
     443 no ALB;
  2. CloudFront na frente do ALB (HTTPS em `*.cloudfront.net`, sem domínio);
  3. enquanto nenhuma das duas existir, o deploy só funciona para testes locais.

## 4. Previews por branch e PR

- **Auto branch detection** (App settings → Branch settings): padrão `feature/*`
  e `developer`; cada branch ganha `https://<branch>.<app-id>.amplifyapp.com`.
- **Pull request previews** (Previews → Enable): cada PR para `main`/`developer`
  gera uma URL temporária, removida ao fechar o PR. Só habilite para
  repositório privado ou com aprovação, pois o build roda código do PR.
- Previews usam as variáveis da branch de destino; aponte-as para a API de
  homologação, nunca para a de produção com dados reais.
- Proteja previews com senha (*Access control* → usuário/senha por branch).
- Lembre de incluir as URLs de preview em `CORS_ORIGINS` da API de homologação.

## 5. Publicar uma versão

1. Merge em `main` → o Amplify faz build e deploy automáticos (sem downtime;
   a versão anterior segue no ar até o novo build terminar).
2. Conferir: login dos três perfis, catálogo com cartazes, área do funcionário,
   página `/privacidade`.
3. Versão: tag `vX.Y.Z` no repositório (mesma versão da API quando forem
   publicadas juntas).

## 6. Rollback

Amplify → app → branch `main` → *Deployments* → escolha o deploy anterior →
**Redeploy this version**. Não exige novo build. Se o problema for a variável
`NEXT_PUBLIC_API_URL`, corrija-a e redeploy (aí sim há build novo).

## 7. Custos

Amplify Hosting cobra por minuto de build (~US$ 0,01/min), GB servido
(~US$ 0,15/GB) e requisições/tempo de SSR; o *free tier* de 12 meses cobre
1.000 min de build e 15 GB/mês. Para o volume da videoteca a estimativa é de
**US$ 0–5/mês**. Cada preview de PR consome minutos de build.

## 8. Observações

- `next.config.ts` usa `output: "standalone"` para a imagem Docker
  (`Dockerfile`); o Amplify ignora o standalone e empacota o `.next` próprio.
- Confirme, ao criar o app, que a versão do Next.js em uso é suportada pela
  plataforma de compute do Amplify. Se não for, a alternativa é publicar a
  imagem do `Dockerfile` (ECS Fargate/App Runner) com `NEXT_PUBLIC_API_URL`
  como `--build-arg`.
- Nenhum segredo vai para o front: tudo que começa com `NEXT_PUBLIC_` é público.
