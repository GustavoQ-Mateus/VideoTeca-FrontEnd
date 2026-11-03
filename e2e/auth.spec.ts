import { expect, test } from "@playwright/test";
import { PASSWORD, USERS, expectPath, fakeJwt, signIn, type Role } from "./support";

const LABEL: Record<Role, string> = {
  aluno: "Aluno",
  professor: "Professor",
  funcionario: "Funcionário",
};

test.describe("Login por perfil", () => {
  for (const role of Object.keys(USERS) as Role[]) {
    test(`${role} entra e cai na sua área`, async ({ page }) => {
      await page.goto("/login");
      await page.getByRole("button", { name: LABEL[role], exact: true }).click();
      await page.locator("#matricula").fill(USERS[role].email);
      await page.locator("#senha").fill(PASSWORD);
      await page.getByRole("button", { name: "Entrar", exact: true }).click();
      await expectPath(page, USERS[role].home);
      const cookies = await page.context().cookies();
      expect(cookies.some((c) => c.name === "vt_token" && c.value)).toBeTruthy();
    });
  }

  test("senha errada mostra erro e permanece no login", async ({ page }) => {
    await page.goto("/login");
    await page.locator("#matricula").fill(USERS.aluno.email);
    await page.locator("#senha").fill("senha-errada");
    await page.getByRole("button", { name: "Entrar", exact: true }).click();
    await expect(page.getByRole("alert").filter({ hasText: /credenciais|inválid/i })).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("Rotas protegidas", () => {
  test("sem sessão redireciona para /login?next=", async ({ page }) => {
    await page.goto("/funcionario/acervo");
    await expectPath(page, "/login");
    expect(new URL(page.url()).searchParams.get("next")).toBe("/funcionario/acervo");
  });

  test("perfil errado volta para a própria área", async ({ page, context }) => {
    await signIn(context, "aluno");
    await page.goto("/funcionario");
    await expectPath(page, "/aluno");
    await page.goto("/professor/solicitar-sala");
    await expectPath(page, "/aluno");
  });

  test("token expirado redireciona para o login", async ({ page, context }) => {
    const exp = Math.floor(Date.now() / 1000) - 60;
    await context.addCookies([
      {
        name: "vt_token",
        value: fakeJwt({ sub: "x", role: "aluno", exp }),
        url: process.env.E2E_BASE_URL ?? "http://localhost:3000",
      },
    ]);
    await page.goto("/aluno/reservas");
    await expectPath(page, "/login");
    expect(new URL(page.url()).searchParams.get("next")).toBe("/aluno/reservas");
  });

  test("token adulterado não acessa a API", async ({ page, context }) => {
    // The middleware lets a well-formed token through; the API must refuse it.
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const forged = { token: fakeJwt({ sub: "33333333-3333-3333-3333-333333333333", role: "funcionario", exp }), user: { name: "Forjado", role: "funcionario" } };
    await signIn(context, forged);
    await page.goto("/funcionario/acervo");
    await expect(page.getByRole("alert").first()).toBeVisible();
    await expect(page.getByText("Direitos:")).toHaveCount(0);
  });

  test("páginas públicas e cabeçalhos de segurança", async ({ page }) => {
    const res = await page.goto("/privacidade");
    expect(res?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1, name: "Política de Privacidade" })).toBeVisible();
    const headers = res!.headers();
    expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    await page.goto("/catalogo");
    await expect(page).toHaveURL(/\/catalogo/);
  });
});
