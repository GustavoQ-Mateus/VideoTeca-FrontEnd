import type { Metadata } from "next";
import Link from "next/link";
import { Film } from "lucide-react";

// Keep in sync with POLICY_VERSION in the API (app/routers/privacy.py).
const POLICY_VERSION = "2026-10";

export const metadata: Metadata = {
  title: "Política de Privacidade · Videoteca Unifor",
  description:
    "Como a Videoteca Unifor coleta, usa, armazena e protege dados pessoais (LGPD).",
};

/** Text the institution must fill in before going to production. */
function Pending({ children }: { children: React.ReactNode }) {
  return (
    <mark className="rounded bg-amber-100 px-1 text-amber-900">
      [A PREENCHER PELA UNIFOR: {children}]
    </mark>
  );
}

const DATA = [
  {
    category: "Identificação e contato",
    items: "Nome completo, e-mail institucional, matrícula/SIAPE, curso e telefone.",
    purpose: "Autenticar o acesso, identificar o solicitante e enviar avisos sobre reservas, prazos e eventos.",
    basis: "Execução de políticas institucionais e de serviço ao vínculo acadêmico (art. 7º, V e IX; art. 23 da LGPD).",
  },
  {
    category: "Credenciais",
    items: "Senha (armazenada apenas como hash bcrypt) e token de sessão.",
    purpose: "Segurança do acesso.",
    basis: "Legítimo interesse e segurança (art. 7º, IX; art. 46).",
  },
  {
    category: "Uso do serviço",
    items: "Reservas e empréstimos de filmes, retiradas de equipamentos, solicitações de sala, inscrições e presença em eventos, notificações.",
    purpose: "Prestar o serviço, controlar o acervo e o patrimônio, emitir certificados e cumprir prazos de devolução.",
    basis: "Execução do serviço e cumprimento de obrigação legal/regulatória quanto ao patrimônio público e acadêmico (art. 7º, II e V).",
  },
  {
    category: "Registros técnicos",
    items: "Data/hora, rota acessada, código de resposta e identificador da requisição (sem conteúdo de formulários ou senhas).",
    purpose: "Segurança, auditoria e diagnóstico de falhas.",
    basis: "Legítimo interesse e Marco Civil da Internet (Lei 12.965/2014, art. 15).",
  },
  {
    category: "Consentimentos",
    items: "Versão da política aceita e data do aceite.",
    purpose: "Comprovar a ciência desta política.",
    basis: "Art. 8º e art. 37 da LGPD (registro das operações).",
  },
];

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-6 px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#0066B3]">
              <Film className="h-4 w-4 text-white" aria-hidden />
            </div>
            <span className="text-sm font-bold text-[#003A70]">
              Videoteca Unifor
            </span>
          </Link>
          <nav aria-label="Navegação" className="ml-auto flex gap-4 text-sm">
            <Link href="/catalogo" className="text-[#667085] hover:text-[#172033]">
              Catálogo
            </Link>
            <Link href="/login" className="font-medium text-[#0066B3]">
              Entrar
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-10 px-6 py-12 leading-relaxed text-[#172033]">
        <div>
          <h1 className="text-3xl font-bold">Política de Privacidade</h1>
          <p className="mt-2 text-sm text-[#667085]">
            Versão {POLICY_VERSION} · Lei Geral de Proteção de Dados Pessoais
            (Lei 13.709/2018)
          </p>
          <p className="mt-4">
            Esta política explica como o sistema da Videoteca da Universidade
            de Fortaleza (UNIFOR) trata dados pessoais de alunos, professores e
            funcionários. O controlador dos dados é a{" "}
            <Pending>razão social e CNPJ da Fundação Edson Queiroz / UNIFOR</Pending>.
          </p>
        </div>

        <section aria-labelledby="dados">
          <h2 id="dados" className="text-xl font-semibold">
            1. Dados coletados, finalidade e base legal
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">
                Categorias de dados pessoais, finalidade e base legal
              </caption>
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F5F7FA]">
                  <th scope="col" className="p-3">Categoria</th>
                  <th scope="col" className="p-3">Dados</th>
                  <th scope="col" className="p-3">Finalidade</th>
                  <th scope="col" className="p-3">Base legal</th>
                </tr>
              </thead>
              <tbody>
                {DATA.map((row) => (
                  <tr key={row.category} className="border-b border-[#E2E8F0] align-top">
                    <th scope="row" className="p-3 font-medium">{row.category}</th>
                    <td className="p-3">{row.items}</td>
                    <td className="p-3">{row.purpose}</td>
                    <td className="p-3">{row.basis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4">
            Não coletamos dados sensíveis (art. 5º, II) nem utilizamos os dados
            para publicidade ou decisões automatizadas. Os comprovantes de
            direitos autorais anexados por funcionários referem-se a obras e
            titulares (empresas), não a usuários do sistema.
          </p>
        </section>

        <section aria-labelledby="compartilhamento">
          <h2 id="compartilhamento" className="text-xl font-semibold">
            2. Compartilhamento
          </h2>
          <p className="mt-3">
            Os dados são acessados apenas pela equipe da Videoteca e pela área
            de tecnologia da UNIFOR, na medida necessária. São armazenados em
            infraestrutura de nuvem contratada (operador){" "}
            <Pending>provedor e região de hospedagem, ex.: AWS sa-east-1</Pending>.
            Não vendemos nem cedemos dados a terceiros. Poderá haver
            compartilhamento por determinação legal ou judicial.
          </p>
        </section>

        <section aria-labelledby="retencao">
          <h2 id="retencao" className="text-xl font-semibold">
            3. Retenção
          </h2>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>
              Cadastro: enquanto durar o vínculo com a UNIFOR e{" "}
              <Pending>prazo após o desligamento</Pending>.
            </li>
            <li>
              Histórico de empréstimos, reservas e retiradas:{" "}
              <Pending>prazo de guarda definido pela política de patrimônio</Pending>;
              após a exclusão da conta é mantido apenas de forma anonimizada.
            </li>
            <li>
              Registros técnicos de acesso: no mínimo 6 meses (Marco Civil),{" "}
              <Pending>prazo máximo</Pending>.
            </li>
          </ul>
        </section>

        <section aria-labelledby="direitos">
          <h2 id="direitos" className="text-xl font-semibold">
            4. Seus direitos (art. 18 da LGPD)
          </h2>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>Confirmação da existência de tratamento e acesso aos dados;</li>
            <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
            <li>Portabilidade e cópia dos dados em formato estruturado;</li>
            <li>Anonimização, bloqueio ou eliminação de dados desnecessários;</li>
            <li>Informação sobre compartilhamento e revogação do consentimento.</li>
          </ul>
          <p className="mt-3">
            Pelo próprio sistema, em <strong>Meu perfil → Privacidade e dados
            pessoais</strong>, você pode baixar seus dados (arquivo JSON) e
            solicitar a exclusão da conta. A exclusão só é concluída quando não
            há empréstimos, retiradas de equipamento ou reservas futuras em
            aberto; ela anonimiza nome, e-mail, telefone e matrícula e mantém
            apenas o histórico agregado necessário ao controle do acervo.
          </p>
        </section>

        <section aria-labelledby="seguranca">
          <h2 id="seguranca" className="text-xl font-semibold">
            5. Segurança
          </h2>
          <p className="mt-3">
            Utilizamos conexão criptografada (HTTPS), senhas com hash, controle
            de acesso por perfil, limite de tentativas de login e registros de
            auditoria. Incidentes de segurança que possam gerar risco
            relevante serão comunicados à ANPD e aos titulares (art. 48).
          </p>
        </section>

        <section aria-labelledby="contato">
          <h2 id="contato" className="text-xl font-semibold">
            6. Encarregado (DPO) e contato
          </h2>
          <ul className="mt-3 space-y-1">
            <li>
              Encarregado: <Pending>nome do encarregado de dados</Pending>
            </li>
            <li>
              E-mail: <Pending>e-mail do encarregado, ex.: privacidade@unifor.br</Pending>
            </li>
            <li>
              Endereço: Av. Washington Soares, 1321 — Edson Queiroz,
              Fortaleza/CE
            </li>
          </ul>
          <p className="mt-3">
            Você também pode apresentar reclamação à Autoridade Nacional de
            Proteção de Dados (ANPD).
          </p>
        </section>

        <section aria-labelledby="alteracoes">
          <h2 id="alteracoes" className="text-xl font-semibold">
            7. Alterações desta política
          </h2>
          <p className="mt-3">
            Quando esta política mudar, a versão será atualizada e o aceite
            será solicitado novamente no seu perfil.
          </p>
        </section>
      </main>
    </div>
  );
}
