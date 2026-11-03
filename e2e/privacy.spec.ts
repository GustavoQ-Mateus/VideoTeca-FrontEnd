import fs from "node:fs";
import { expect, test } from "@playwright/test";
import { PASSWORD, USERS, api, apiLogin, signIn } from "./support";

test.describe("Aluno — privacidade (LGPD)", () => {
  test("acessa a política, aceita e exporta os próprios dados", async ({ page, context }) => {
    await signIn(context, "aluno");
    await page.goto("/aluno/perfil");
    const panel = page.getByRole("region", { name: "Privacidade e dados pessoais" });
    await expect(panel).toBeVisible();

    const accept = panel.getByRole("button", { name: "Li e aceito a política de privacidade" });
    if (await accept.isVisible()) {
      await accept.click();
      await expect(panel.getByText("Aceite registrado")).toBeVisible();
    }
    await expect(panel.getByText(/Você aceitou a versão/)).toBeVisible();

    const downloadEvent = page.waitForEvent("download");
    await panel.getByRole("button", { name: "Baixar meus dados" }).click();
    const download = await downloadEvent;
    expect(download.suggestedFilename()).toBe("meus-dados.json");
    const file = await download.path();
    const text = fs.readFileSync(file, "utf8");
    expect(() => JSON.parse(text)).not.toThrow();
    expect(text).toContain(USERS.aluno.email);

    await panel.getByRole("link", { name: "Política de Privacidade" }).click();
    await expect(page).toHaveURL(/\/privacidade$/);
    await expect(page.getByRole("heading", { name: /Seus direitos/ })).toBeVisible();
  });

  test("exclusão é recusada com pendências (409) e concluída depois", async ({ page, context }) => {
    // Disposable student, so the seed accounts are never anonymized.
    const id = Date.now().toString(36);
    const email = `e2e-${id}@edu.unifor.br`;
    const registration = `E2E${id}`.slice(0, 40);
    await api("funcionario", "POST", "/auth/register", {
      email,
      password: PASSWORD,
      full_name: "Aluno Descartável E2E",
      role: "aluno",
      registration,
      course: "Cinema e Audiovisual",
    });
    const student = await apiLogin(email, "aluno");

    // Open equipment withdrawal blocks the deletion.
    const equipment = await api<{ id: number }>("funcionario", "POST", "/staff/equipment", {
      name: `E2E Cabo ${id}`,
      category: "Acessórios",
      quantity: 1,
    });
    const loan = await api<{ id: number }>("funcionario", "POST", "/staff/equipment/loans", {
      equipment_id: equipment.id,
      registration,
      quantity: 1,
      due_at: new Date(Date.now() + 86_400_000).toISOString(),
    });

    await signIn(context, student);
    await page.goto("/aluno/perfil");
    const panel = page.getByRole("region", { name: "Privacidade e dados pessoais" });
    const confirmDeletion = async () => {
      await panel.getByRole("button", { name: "Solicitar exclusão" }).click();
      const confirm = panel.getByRole("button", { name: "Confirmar exclusão" });
      await expect(confirm).toBeDisabled();
      await panel.getByLabel(/Digite EXCLUIR/).fill("EXCLUIR");
      await confirm.click();
    };

    await confirmDeletion();
    await expect(panel.getByRole("alert")).toContainText(/retirada|empréstimo|reserva/i);

    await api("funcionario", "POST", `/staff/equipment/loans/${loan.id}/return`, {
      condition: "good",
      damaged_quantity: 0,
      notes: "",
    });

    await panel.getByRole("button", { name: "Cancelar" }).click();
    await confirmDeletion();
    await expect(panel.getByText("Conta excluída")).toBeVisible();
    await page.waitForURL((u) => u.pathname === "/");
    // Anonymized account can no longer log in.
    await expect(apiLogin(email, "aluno")).rejects.toThrow();
  });
});
