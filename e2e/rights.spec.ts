import { expect, test } from "@playwright/test";
import {
  PDF_PROOF,
  api,
  createFilm,
  createSession,
  localDate,
  signIn,
  unique,
} from "./support";

test.describe("Funcionário — direitos autorais e publicação", () => {
  test.beforeEach(async ({ context }) => {
    await signIn(context, "funcionario");
  });

  test("cadastra filme autorizado com comprovante e publica a sessão", async ({ page }) => {
    const title = unique("E2E Autorizado");
    const validUntil = new Date();
    validUntil.setFullYear(validUntil.getFullYear() + 3);

    await page.goto("/funcionario/acervo");
    await page.getByRole("button", { name: "Cadastrar filme" }).click();
    await page.locator("input[name=title]").fill(title);
    await page.getByLabel("Ano").fill("1999");
    await page.getByLabel("Status da autorização").selectOption("authorized");
    await page.getByLabel("Titular dos direitos").fill("Distribuidora E2E Ltda.");
    await page.getByLabel("Tipo de licença").selectOption("exibicao_publica");
    await page.getByLabel("Validade da autorização").fill(localDate(validUntil));
    await page.getByLabel("Observações sobre os direitos").fill("Contrato 123/2026");
    await page.getByRole("button", { name: "Salvar filme" }).click();

    await expect(page.getByText("Anexe o comprovante de autorização abaixo")).toBeVisible();
    const proofs = page.getByRole("region", { name: "Comprovantes de autorização" });
    await expect(proofs.getByText("Nenhum comprovante anexado.")).toBeVisible();
    await proofs.getByLabel("Anexar comprovante").setInputFiles(PDF_PROOF);
    await proofs.getByRole("button", { name: "Enviar comprovante" }).click();
    await expect(proofs.getByText(PDF_PROOF.name, { exact: true })).toBeVisible();

    // Download keeps working through the authenticated fetch.
    const download = page.waitForEvent("download");
    await proofs.getByRole("button", { name: `Baixar ${PDF_PROOF.name}` }).click();
    expect((await download).suggestedFilename()).toBe(PDF_PROOF.name);

    // Badge on the listing.
    const card = page.getByRole("article").filter({ hasText: title });
    await expect(card.getByText("Direitos: Autorizado")).toBeVisible();

    const films = await api<{ id: number; title: string }[]>("funcionario", "GET", "/staff/films");
    const film = films.find((f) => f.title === title)!;
    const session = await createSession(film.id);

    await page.goto("/funcionario/eventos");
    const item = page.getByRole("article").filter({ hasText: session.title });
    await item.getByRole("button", { name: "Publicar", exact: true }).click();
    await expect(item.getByText("Publicado", { exact: true })).toBeVisible();
    await expect(item.getByRole("button", { name: "Despublicar" })).toBeVisible();
  });

  test("bloqueia publicação sem autorização e orienta a regularizar", async ({ page }) => {
    const film = await createFilm({ rights_status: "pending" });
    const session = await createSession(film.id);

    await page.goto("/funcionario/eventos");
    const item = page.getByRole("article").filter({ hasText: session.title });
    await item.getByRole("button", { name: "Publicar", exact: true }).click();
    const alert = item.getByRole("alert");
    await expect(alert).toContainText("Publicação bloqueada por direitos autorais");
    await expect(alert).toContainText("autorização");
    await expect(item.getByText("Rascunho", { exact: true })).toBeVisible();

    await alert.getByRole("link", { name: "Regularizar no acervo" }).click();
    await expect(page).toHaveURL(new RegExp(`/funcionario/acervo\\?filme=${film.id}`));
    await expect(page.getByRole("heading", { name: "Editar filme" })).toBeVisible();
    await expect(page.locator("input[name=title]")).toHaveValue(film.title);
  });

  test("filme autorizado sem comprovante também é bloqueado", async ({ page }) => {
    const film = await createFilm({
      rights_status: "authorized",
      rights_holder: "Titular E2E",
      license_type: "educacional",
    });
    const session = await createSession(film.id);
    await page.goto("/funcionario/eventos");
    const item = page.getByRole("article").filter({ hasText: session.title });
    await item.getByRole("button", { name: "Publicar", exact: true }).click();
    await expect(item.getByRole("alert")).toContainText("comprovante");
  });

  test("valida comprovante no cliente (tipo e tamanho)", async ({ page }) => {
    const film = await createFilm({ rights_status: "pending" });
    await page.goto(`/funcionario/acervo?filme=${film.id}`);
    const proofs = page.getByRole("region", { name: "Comprovantes de autorização" });
    await proofs.getByLabel("Anexar comprovante").setInputFiles({
      name: "falso.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("isto não é um PDF"),
    });
    await proofs.getByRole("button", { name: "Enviar comprovante" }).click();
    await expect(proofs.getByRole("alert")).toContainText("PDF, PNG ou JPEG");
    await proofs.getByLabel("Anexar comprovante").setInputFiles({
      name: "grande.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.concat([Buffer.from("%PDF-1.4\n"), Buffer.alloc(10 * 1024 * 1024)]),
    });
    await proofs.getByRole("button", { name: "Enviar comprovante" }).click();
    await expect(proofs.getByRole("alert")).toContainText("10 MB");
  });
});
