#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(process.argv[2] ?? "");
if (!process.argv[2]) {
  console.error("usage: node extrovert/release/validate-plugin.mjs <exported-extrovert-skills-root>");
  process.exit(2);
}

const errors = [];
const readJson = (path) => {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    errors.push(`${path}: ${error instanceof Error ? error.message : String(error)}`);
    return {};
  }
};

const pluginRoot = join(root, "plugins", "extrovert");
const marketplace = readJson(join(root, ".agents", "plugins", "marketplace.json"));
const manifest = readJson(join(pluginRoot, ".codex-plugin", "plugin.json"));
const mcp = readJson(join(pluginRoot, ".mcp.json"));
const inventory = readJson(join(root, "skills.sh.json"));

if (marketplace.name !== "extrovert") errors.push("marketplace name must be extrovert");
const entry = marketplace.plugins?.find?.((candidate) => candidate?.name === "extrovert");
if (entry?.source?.path !== "./plugins/extrovert") errors.push("marketplace must point at ./plugins/extrovert");
if (entry?.policy?.installation !== "AVAILABLE") errors.push("plugin installation policy must be AVAILABLE");
if (entry?.policy?.authentication !== "ON_INSTALL") errors.push("plugin authentication policy must be ON_INSTALL");

if (manifest.name !== "extrovert") errors.push("plugin manifest name must be extrovert");
if (manifest.skills !== "./skills/") errors.push("plugin skills path must be ./skills/");
if (manifest.mcpServers !== "./.mcp.json") errors.push("plugin MCP path must be ./.mcp.json");
if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(manifest.version ?? "")) {
  errors.push("plugin version must be strict semver");
}

const server = mcp.mcpServers?.extrovert;
if (server?.type !== "stdio" || server?.command !== "npx") {
  errors.push("plugin must launch the published Extrovert stdio server through npx");
}
if (JSON.stringify(server?.args) !== JSON.stringify(["-y", "@extrovert.dev/mcp@next"])) {
  errors.push("plugin MCP args drifted from @extrovert.dev/mcp@next");
}
if (server?.env && Object.keys(server.env).length) errors.push("plugin must not embed credentials in MCP env");

const expected = [...(inventory.skills ?? [])].sort();
const skillsRoot = join(pluginRoot, "skills");
const actual = existsSync(skillsRoot)
  ? readdirSync(skillsRoot).filter((name) => existsSync(join(skillsRoot, name, "SKILL.md"))).sort()
  : [];
if (JSON.stringify(actual) !== JSON.stringify(expected)) {
  errors.push(`plugin skill inventory mismatch; expected ${expected.join(", ")}; found ${actual.join(", ")}`);
}

if (errors.length) {
  console.error(`Extrovert plugin validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`validated Extrovert Codex marketplace plugin with ${actual.length} skills`);
