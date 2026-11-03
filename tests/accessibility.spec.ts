import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("key desktop and mobile screens meet WCAG 2.1 AA automated checks", async ({
  page,
}) => {
  const reports: { screen: string; violations: unknown[] }[] = [];
  for (const role of [
    "Landelijk beheerder",
    "Deelnemer",
    "Maatschappelijk Sportcoach",
  ]) {
    await page.goto("/");
    await page.getByRole("button", { name: new RegExp(role) }).click();
    if (role !== "Landelijk beheerder")
      await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.locator("#content > div")).toHaveCSS("opacity", "1");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    reports.push({
      screen: role,
      violations: results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      })),
    });
  }
  await test
    .info()
    .attach("accessibility-report", {
      body: JSON.stringify(reports, null, 2),
      contentType: "application/json",
    });
  expect(reports.flatMap((r) => r.violations)).toEqual([]);
});
