import { test, expect, Page } from "@playwright/test";
async function choose(page: Page, role: string) {
  await page.goto("/");
  await page.getByRole("button", { name: new RegExp(role) }).click();
  await expect(page.locator(".topbar")).toBeVisible();
}
async function switchTo(page: Page, role: string) {
  await page.locator(".role-trigger").click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: new RegExp(role) })
    .click();
}
async function state(page: Page) {
  return page.evaluate(() =>
    JSON.parse(localStorage.getItem("life-goals-demo-v1") || "null"),
  );
}
test("A: course creation, QR registration, unified participant and refresh persistence", async ({
  page,
}) => {
  await choose(page, "Regionale coördinator");
  await page.getByRole("link", { name: "Opleidingen", exact: true }).click();
  await page.getByRole("button", { name: "Nieuwe opleiding" }).click();
  await page
    .getByLabel("Titel van de opleiding")
    .fill("MDT Amsterdam — wintergroep");
  await page.getByLabel("Locatie", { exact: true }).fill("Sportcentrum Sloten");
  await page
    .getByLabel("Beschrijving", { exact: true })
    .fill("Samen talenten ontdekken tijdens sport.");
  await page.getByRole("button", { name: "Opleiding aanmaken" }).click();
  await expect(
    page.getByRole("heading", {
      name: "MDT Amsterdam — wintergroep",
      exact: true,
    }),
  ).toBeVisible();
  const courseUrl = page.url();
  const qr = page.getByAltText("QR-code naar de aanmeldpagina");
  await expect(qr).toBeVisible();
  expect(
    await qr.evaluate((el: HTMLImageElement) => el.naturalWidth),
  ).toBeGreaterThan(100);
  await page.getByRole("link", { name: "Aanmeldpagina openen" }).click();
  await page.getByLabel("Kies een demodeelnemer").selectOption("");
  await page
    .getByLabel("Fictieve naam", { exact: true })
    .fill("Alex Voorbeeld");
  await page.getByLabel("Fictief e-mailadres").fill("alex@example.invalid");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Ik doe mee" }).click();
  await expect(
    page.getByRole("heading", { name: "Je staat op de lijst!" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Terug naar de coördinator" }).click();
  await expect(page.getByText("Alex Voorbeeld", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText("Alex Voorbeeld", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Deelnemers", exact: true }).click();
  await page.getByLabel("Zoek deelnemers").fill("Alex Voorbeeld");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  expect((await state(page)).courses).toHaveLength(6);
  await page.goto(courseUrl);
  await page.getByRole("link", { name: "Aanmeldpagina openen" }).click();
  await page
    .getByLabel("Kies een demodeelnemer")
    .selectOption({ label: "Alex Voorbeeld" });
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Ik doe mee" }).click();
  await expect(page.locator('.error[role="alert"]')).toContainText(
    "al aangemeld",
  );
});
test("B: trainer checklist immediately updates participant portfolio and timeline", async ({
  page,
}) => {
  await choose(page, "Opleider");
  await page
    .locator(".course-card")
    .filter({ hasText: "MDT Set Your Life Goals" })
    .click();
  await page
    .getByRole("button", { name: "Voortgangsmatrix", exact: true })
    .click();
  await page
    .getByRole("button", {
      name: "Samira El Amrani: Portfolio-opdracht — In behandeling",
      exact: true,
    })
    .click();
  await expect(
    page.getByRole("button", {
      name: "Samira El Amrani: Portfolio-opdracht — Afgerond",
      exact: true,
    }),
  ).toBeVisible();
  await switchTo(page, "Deelnemer");
  await page.getByRole("link", { name: "Mijn leerreis", exact: true }).click();
  await expect(
    page.locator(".checklist-row").filter({ hasText: "Portfolio-opdracht" }),
  ).toContainText("Afgerond");
  await page.getByRole("button", { name: "Tijdlijn", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Een nieuwe stap afgerond" }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.locator(".checklist-row").filter({ hasText: "Portfolio-opdracht" }),
  ).toContainText("Afgerond");
});
test("C: one-tap coach attendance updates participant profile and aggregate reporting", async ({
  page,
}) => {
  await choose(page, "Maatschappelijk Sportcoach");
  await page.getByRole("link", { name: "Aanwezigheid registreren" }).click();
  await page
    .getByRole("button", { name: "Samira El Amrani aanwezig", exact: true })
    .click();
  await expect(
    page.getByRole("button", {
      name: "Samira El Amrani aanwezig",
      exact: true,
    }),
  ).toHaveAttribute("aria-pressed", "true");
  const d = await state(page);
  expect(d.sessions.find((s: any) => s.id === "s0-6").attendance.p0).toBe(
    "present",
  );
  const present = d.sessions.reduce(
    (sum: number, s: any) =>
      sum + Object.values(s.attendance).filter((v) => v === "present").length,
    0,
  );
  await switchTo(page, "Landelijk beheerder");
  await page
    .getByRole("link", { name: "Life Goals Monitor", exact: true })
    .click();
  await expect(
    page
      .locator(".stat")
      .filter({ hasText: "Bijgewoonde momenten" })
      .locator(".stat-value"),
  ).toHaveText(String(present));
  await page.goto("/hub/deelnemers/p0");
  await page.getByRole("button", { name: "Aanwezigheid", exact: true }).click();
  await expect(page.locator(".activity-row").first()).toContainText(
    "Samen voetballen",
  );
  await expect(page.locator(".activity-row").first()).toContainText("Aanwezig");
});
test("D: participant and coach volunteer with one identity and appear in event roster", async ({
  page,
}) => {
  await choose(page, "Deelnemer");
  await page.getByRole("link", { name: "Ontdek waar je kunt helpen" }).click();
  await page
    .locator(".event-card")
    .first()
    .getByRole("button", { name: "Ik help mee" })
    .click();
  await expect(
    page
      .locator(".event-card")
      .first()
      .getByRole("button", { name: "Je helpt mee" }),
  ).toBeDisabled();
  await switchTo(page, "Maatschappelijk Sportcoach");
  await page
    .getByRole("link", { name: "Samen meehelpen", exact: true })
    .click();
  await page
    .locator(".event-card")
    .first()
    .getByRole("button", { name: "Ik help mee" })
    .click();
  await switchTo(page, "Landelijk beheerder");
  await page
    .getByRole("link", { name: "Events & vrijwilligers", exact: true })
    .click();
  await expect(
    page
      .locator(".event-card")
      .first()
      .getByRole("link", { name: "Samira El Amrani" }),
  ).toBeVisible();
  await expect(
    page
      .locator(".event-card")
      .first()
      .getByRole("link", { name: "Milan de Groot" }),
  ).toBeVisible();
  const d = await state(page);
  expect(d.people.find((p: any) => p.id === "p1").roles).toEqual([
    "Deelnemer",
    "Coach",
    "Vrijwilliger",
  ]);
  expect(d.people).toHaveLength(39);
});
test("E: regional monitor filters match seeded people, attendance and courses", async ({
  page,
}) => {
  await choose(page, "Landelijk beheerder");
  await page
    .getByRole("link", { name: "Life Goals Monitor", exact: true })
    .click();
  for (const [region, total] of [
    ["Amsterdam", 20],
    ["Utrecht", 8],
    ["Rotterdam", 8],
    ["Alle regio’s", 36],
  ] as const) {
    await page.getByLabel("Regio", { exact: true }).selectOption(region);
    await expect(
      page
        .locator(".stat")
        .filter({ hasText: "Unieke deelnemers" })
        .locator(".stat-value"),
    ).toHaveText(String(total));
    await expect(page.locator("tbody tr")).toHaveCount(
      region === "Alle regio’s" ? 3 : 1,
    );
  }
  await page.screenshot({
    path: "test-results/monitor-desktop.png",
    fullPage: true,
  });
});
test("demo reset restores original data and existing browser tabs receive changes", async ({
  page,
  context,
}) => {
  await choose(page, "Maatschappelijk Sportcoach");
  await page.getByRole("link", { name: "Aanwezigheid registreren" }).click();
  const second = await context.newPage();
  await second.goto("/coach/activiteiten/a0");
  await expect(
    second.getByRole("button", {
      name: "Samira El Amrani aanwezig",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Samira El Amrani aanwezig", exact: true })
    .click();
  await expect(
    second.getByRole("button", {
      name: "Samira El Amrani aanwezig",
      exact: true,
    }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "Reset demogegevens", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Reset demogegevens", exact: true })
    .click();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Hé Milan, klaar voor vandaag?" }),
  ).toBeVisible();
  const d = await state(page);
  expect(d.people).toHaveLength(39);
  expect(d.courses).toHaveLength(5);
  expect(d.sessions.find((s: any) => s.id === "s0-6").attendance).toEqual({});
  await expect(
    second.getByRole("button", {
      name: "Samira El Amrani aanwezig",
      exact: true,
    }),
  ).toHaveAttribute("aria-pressed", "false");
});
test("mobile participant and coach flows fit screen, menus and dialogs remain usable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await choose(page, "Deelnemer");
  await expect(page.locator("#content > div")).toHaveCSS("opacity", "1");
  await page.screenshot({
    path: "test-results/participant-mobile.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
  await page.getByRole("button", { name: "Menu openen" }).click();
  await page.getByRole("link", { name: "Mijn leerreis", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Mijn leerreis", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
  await switchTo(page, "Maatschappelijk Sportcoach");
  await page.getByRole("link", { name: "Aanwezigheid registreren" }).click();
  await page
    .getByRole("button", { name: "Samira El Amrani aanwezig", exact: true })
    .click();
  await page.screenshot({
    path: "test-results/coach-mobile.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
});
test("desktop visual smoke, image/font loading, keyboard and known deep links", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Eén verhaal/ }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/welcome-desktop.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: /Landelijk beheerder/ }).click();
  await expect(
    page.getByRole("heading", { name: "Goedemorgen, Noor" }),
  ).toBeVisible();
  await expect(page.locator("#content > div")).toHaveCSS("opacity", "1");
  await page.screenshot({
    path: "test-results/dashboard-desktop.png",
    fullPage: false,
  });
  const badImages = await page
    .locator("img")
    .evaluateAll(
      (images) =>
        images.filter(
          (i) =>
            !(i as HTMLImageElement).complete ||
            (i as HTMLImageElement).naturalWidth === 0,
        ).length,
    );
  expect(badImages).toBe(0);
  await page.goto("/hub/deelnemers/p0");
  await expect(
    page.getByRole("heading", { name: "Samira El Amrani", exact: true }),
  ).toBeVisible();
  await expect(page.locator("#content > div")).toHaveCSS("opacity", "1");
  await page.screenshot({
    path: "test-results/journey-desktop.png",
    fullPage: true,
  });
  await page.goto("/hub/opleidingen");
  await page.getByRole("button", { name: "Nieuwe opleiding" }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  expect(errors).toEqual([]);
});
