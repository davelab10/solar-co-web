import { existsSync, readFileSync } from "node:fs";

const requiredFiles = ["index.html", "styles.css", "script.js"];
const missing = requiredFiles.filter((file) => !existsSync(file));

if (missing.length) {
  console.error(`Missing required files: ${missing.join(", ")}`);
  process.exit(1);
}

const html = readFileSync("index.html", "utf8");
const css = readFileSync("styles.css", "utf8");
const js = readFileSync("script.js", "utf8");

if (!html.includes("id=\"quote\"") || !html.includes("id=\"system\"")) {
  console.error("Required homepage anchors are missing.");
  process.exit(1);
}

if ([html, css, js].some((source) => source.includes("—"))) {
  console.error("Em dash found in authored source.");
  process.exit(1);
}

console.log("Build check passed: homepage sources and anchors are present.");
