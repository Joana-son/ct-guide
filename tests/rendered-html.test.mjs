import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { after, before, test } from "node:test";

let worker;

before(async () => {
  process.env.WRANGLER_SEND_METRICS = "false";
  process.env.WRANGLER_LOG_PATH = ".wrangler/logs";
  const { unstable_dev } = await import("wrangler");

  // Exercise the real Cloudflare build rather than importing it as a Node module.
  worker = await unstable_dev(
    fileURLToPath(new URL("../dist/server/index.js", import.meta.url)),
    {
      config: fileURLToPath(new URL("../dist/server/wrangler.json", import.meta.url)),
      local: true,
      port: 0,
      inspectorPort: 0,
      bundle: false,
      persist: false,
      logLevel: "error",
      experimental: {
        disableExperimentalWarning: true,
        disableDevRegistry: true,
        enableContainers: false,
        watch: false,
      },
    },
  );
}, { timeout: 60_000 });

after(async () => {
  await worker?.stop();
});

for (const [path, label, mode] of [
  ["/", "조영검사", "general"],
  ["/contrast", "조영검사", "general"],
  ["/noncontrast", "비조영검사", "noncontrast"],
  ["/pediatric", "소아검사", "pediatric"],
]) {
  test(`${path} renders the correct exam guide and loadable browser assets`, async () => {
    const response = await worker.fetch(path);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
    const html = await response.text();
    assert.match(html, /<h1[^>]*>CT 검사 가이드<\/h1>/);
    assert.ok(html.includes(`class="intro-mode-label">${label}</p>`));
    assert.ok(html.includes(`<option value="${mode}" selected=""`));
    assert.match(html, /시작하기/);
    assert.doesNotMatch(html, /Building your site|Your site is taking shape/);

    const scripts = [...html.matchAll(/<script\b[^>]*src="([^"]+)"/g)].map((m) => m[1]);
    const styles = [...html.matchAll(/<link\b(?=[^>]*rel="stylesheet")[^>]*href="([^"]+)"/g)].map((m) => m[1]);
    assert.ok(scripts.length > 0, "Navigation needs client JavaScript");
    assert.ok(styles.length > 0, "Guide styles must be included");
    for (const assetPath of [...scripts, ...styles]) {
      const asset = await worker.fetch(assetPath);
      assert.equal(asset.status, 200, assetPath);
      assert.match(asset.headers.get("content-type") ?? "", /javascript|css/i, assetPath);
      await asset.arrayBuffer();
    }
  });
}

test("serves the patient guide images after the dependency update", async () => {
  for (const path of [
    "/smc-logo.png",
    "/ct-guide-machine.jpg",
    "/siemens-ct.webp",
    "/ct-scan.gif",
    "/noncontrast-ct.gif",
    "/ct-monitoring-scene-korean.webp",
    "/ct-monitoring-scene-pediatric.webp",
    "/plain-shirt.webp",
    "/plain-pants.webp",
  ]) {
    const response = await worker.fetch(path);
    assert.equal(response.status, 200, path);
    assert.match(response.headers.get("content-type") ?? "", /^image\//, path);
    assert.ok((await response.arrayBuffer()).byteLength > 0, path);
  }
});

test("does not expose project configuration or source files", async () => {
  for (const path of ["/.env", "/package.json", "/app/page.tsx", "/not-an-exam-guide"]) {
    const response = await worker.fetch(path);
    assert.equal(response.status, 404, path);
    await response.text();
  }
});
