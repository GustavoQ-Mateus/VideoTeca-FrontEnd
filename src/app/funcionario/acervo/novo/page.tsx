"use client";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { COURSES } from "@/lib/constants";

const STAFF = { name: "Carla Nogueira", course: "Funcionária" };

export default function NovoMaterialPage() {
  return (
    <AppShell role="funcionario" title="Cadastrar material" user={STAFF}>
      <div className="max-w-4xl space-y-6">
        <div className="flex gap-2">
          <Link href="/funcionario/acervo">
            <Button variant="ghost" size="sm">
              Voltar ao acervo
            </Button>
          </Link>
        </div>
        <div className="bg-white rounded-[18px] border border-[#E2E8F0] p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Título" required className="md:col-span-2" />
          <Input label="Título original" />
          <Input label="Ano" type="number" />
          <Input label="Diretor" className="md:col-span-2" />
          <Textarea label="Sinopse" rows={4} className="md:col-span-2" />
          <Input label="Elenco" className="md:col-span-2" />
          <Input label="País" />
          <Select label="Gênero">
            <option>Drama</option>
            <option>Comédia</option>
            <option>Documentário</option>
          </Select>
          <Input label="Duração (min)" type="number" />
          <Select label="Classificação indicativa">
            <option>Livre</option>
            <option>12+</option>
            <option>14+</option>
            <option>16+</option>
            <option>18+</option>
          </Select>
          <Input label="Idioma" defaultValue="Português" />
          <Input label="Legendas" />
          <Select label="Tipo de mídia">
            <option>DVD</option>
            <option>Blu-ray</option>
            <option>Digital</option>
          </Select>
          <Input label="Código interno" />
          <Input label="Localização física" className="md:col-span-2" />
          <Input label="Quantidade" type="number" defaultValue={1} />
          <Select label="Curso relacionado (opcional)" className="md:col-span-2">
            <option value="">—</option>
            {COURSES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
          <Textarea label="Observações" rows={3} className="md:col-span-2" />
        </div>
        <div className="flex gap-2">
          <Button>Salvar e adicionar cópias</Button>
          <Button variant="outline">Salvar rascunho</Button>
        </div>
      </div>
    </AppShell>
  );
}
