import { expect, test } from "@playwright/test";
import { api, futureSlot,localDate, signIn, unique } from "./support";

test.describe("Professor — disponibilidade e reserva de sala", () => {
  test("consulta horários livres e solicita reserva", async ({ page, context }) => {
    await signIn(context, "professor");
    const { start } = futureSlot();
    const title = unique("E2E Aula");

    await page.goto("/professor/solicitar-sala");
    await page.getByLabel("Data da reserva").fill(localDate(start));
    await page.getByLabel("Capacidade mínima").fill("10");
    await page.getByRole("button", { name: "Consultar horários" }).click();

    const slot = page.getByRole("button", { name: /^Livre:/ }).first();
    await expect(slot).toBeVisible();
    await slot.click();

    await page.getByLabel("Título / finalidade").fill(title);
    await page.locator("input[name=course]").fill("Comunicação Social");
    await page.getByLabel("Número de alunos").fill("5");
    await page.getByRole("button", { name: "Solicitar reserva" }).click();
    await expect(page.getByRole("status").filter({ hasText: /Solicitação #\d+ registrada/ })).toBeVisible();

    const mine = await api<{ title: string; status: string }[]>("professor", "GET", "/reservas/me");
    expect(mine.find((b) => b.title === title)?.status).toBe("pending");

    await page.goto("/professor/solicitacoes");
    await expect(page.getByRole("heading", { name: "Minhas Solicitações" })).toBeVisible();
  });
});
