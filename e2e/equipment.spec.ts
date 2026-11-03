import { expect, test } from "@playwright/test";
import { USERS, localDateTime, signIn, unique } from "./support";

test.describe("Funcionário — retirada e devolução de equipamento", () => {
  test("cadastra, registra retirada e devolução", async ({ page, context }) => {
    await signIn(context, "funcionario");
    const name = unique("E2E Projetor");

    await page.goto("/funcionario/equipamentos");
    await page.getByText("Cadastrar equipamento").click();
    await page.locator("input[name=name]").fill(name);
    await page.getByLabel("Categoria").fill("Projeção");
    await page.getByLabel("Quantidade total").fill("2");
    await page.getByRole("button", { name: "Cadastrar", exact: true }).click();
    await expect(page.getByText("Equipamento cadastrado.")).toBeVisible();

    const due = new Date(Date.now() + 3 * 24 * 3600_000);
    const option = page.locator("select[name=equipment_id] option", { hasText: name });
    await page.locator("select[name=equipment_id]").selectOption({ value: (await option.getAttribute("value"))! });
    await page.getByLabel("Matrícula do solicitante").fill(USERS.aluno.registration);
    await page.locator("form", { hasText: "Registrar retirada" }).locator("input[name=quantity]").fill("1");
    await page.getByLabel("Prazo de devolução").fill(localDateTime(due));
    await page.getByRole("button", { name: "Confirmar retirada" }).click();
    await expect(page.getByText("Retirada registrada.")).toBeVisible();
    await expect(option).toContainText("1 disponíveis");

    await page.locator("main a[href=\"/funcionario/equipamentos/devolucoes\"]").click();
    const loan = page.getByRole("article").filter({ hasText: name });
    await loan.getByRole("button", { name: /Registrar devolução/ }).click();
    await page.getByLabel("Estado do equipamento").selectOption("good");
    await page.getByRole("button", { name: "Confirmar devolução" }).click();
    await expect(page.getByText("Devolução registrada e estoque atualizado.")).toBeVisible();
    await expect(page.getByRole("article").filter({ hasText: name })).toHaveCount(0);
  });
});
