#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, lstatSync, readFileSync, readdirSync } from "node:fs";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import { assertAsciiGuidance, guidanceText } from "../tools/check-agent-guidance.mjs";

const root = resolve(process.argv[2] ?? "");
if (!process.argv[2]) throw new Error("usage: validate-plugin.mjs <exported-extrovert-skills-root>");
const errors = [];
const check = (condition, reason) => { if (!condition) errors.push(reason); };
const readJSON = (path) => { try { return JSON.parse(readFileSync(path, "utf8")); } catch (error) { errors.push(`${path}: ${error.message}`); return {}; } };
function files(root) {
  if (!existsSync(root)) return [];
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const path = join(root, entry.name);
    if (lstatSync(path).isSymbolicLink()) { errors.push(`symlink forbidden: ${path}`); return []; }
    return entry.isDirectory() ? files(path) : [path];
  }).sort();
}
function digest(root) {
  const hash = createHash("sha256");
  for (const path of files(root)) hash.update(relative(root, path).replaceAll("\\", "/")).update("\0").update(readFileSync(path)).update("\0");
  return hash.digest("hex");
}
const same = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
const inventory = readJSON(join(root, "plugin-inventory.json"));
const codex = readJSON(join(root, ".agents/plugins/marketplace.json"));
const claude = readJSON(join(root, ".claude-plugin/marketplace.json"));
const standalone = readJSON(join(root, "skills.sh.json"));
const fullToolNames = readJSON(join(root, "plugins/extrovert/capabilities.json")).tools ?? [];
check(codex.name === "extrovert" && claude.name === "extrovert", "preserve extrovert marketplace names");
check(inventory.schema_version === 1, "unsupported plugin inventory schema");
check(same(inventory.standalone_skills ?? [], standalone.skills ?? []), "standalone inventory drift");
check(same((inventory.packages ?? []).map((p) => p.name), ["extrovert", "extrovert-full", "extrovert-assistant"]), "expected legacy and two hosted wrappers");
check(same(codex.plugins?.map((p) => p.name) ?? [], (inventory.packages ?? []).map((p) => p.name)), "Codex marketplace inventory drift");
check(same(claude.plugins?.map((p) => p.name) ?? [], (inventory.packages ?? []).filter((p) => p.claude).map((p) => p.name)), "Claude marketplace inventory drift");
const actualStandalone = readdirSync(root).filter((name) => existsSync(join(root, name, "SKILL.md")));
check(same(actualStandalone, inventory.standalone_skills ?? []), "root standalone skill directories drift");
for (const pkg of inventory.packages ?? []) {
  const pluginRoot = join(root, "plugins", pkg.name);
  const manifest = readJSON(join(pluginRoot, ".codex-plugin/plugin.json"));
  const mcp = readJSON(join(pluginRoot, ".mcp.json"));
  const capabilities = readJSON(join(pluginRoot, "capabilities.json"));
  const catalog = readJSON(join(pluginRoot, "tool-catalog.json"));
  check(same(catalog.tools?.map((t) => t.name) ?? [], capabilities.tools ?? []), `${pkg.name}: runtime catalog mismatch`);
  check(catalog.serverVersion === pkg.version, `${pkg.name}: runtime catalog version mismatch`);
  for (const tool of catalog.tools ?? []) check(tool.title && tool.inputSchema && tool.annotations, `${pkg.name}/${tool.name}: incomplete review metadata`);
  const entry = codex.plugins?.find((p) => p.name === pkg.name);
  check(entry?.source?.path === `./plugins/${pkg.name}`, `${pkg.name}: Codex source path`);
  check(entry?.policy?.installation === "AVAILABLE" && entry?.policy?.authentication === "ON_INSTALL", `${pkg.name}: install/auth policies`);
  check(entry?.category === "Productivity", `${pkg.name}: category`);
  check(manifest.name === pkg.name && manifest.version === pkg.version, `${pkg.name}: name/version drift`);
  check(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(pkg.version ?? ""), `${pkg.name}: strict semver required`);
  check(manifest.skills === "./skills/" && manifest.mcpServers === "./.mcp.json", `${pkg.name}: self-contained paths required`);
  check(capabilities.profile === pkg.profile && capabilities.version === pkg.version, `${pkg.name}: capability metadata drift`);
  check(digest(pluginRoot) === pkg.sha256, `${pkg.name}: plugin digest mismatch`);
  const expectedServer = pkg.transport === "stdio"
    ? { type: "stdio", command: "npx", args: ["-y", "@extrovert.dev/mcp@next"] }
    : { type: "http", url: `https://mcp.extrovert.dev${pkg.profile === "assistant" ? "/assistant/mcp" : "/mcp"}` };
  check(JSON.stringify(mcp) === JSON.stringify({ mcpServers: { extrovert: expectedServer } }), `${pkg.name}: unexpected transport, fields or credentials`);
  const skillRoot = join(pluginRoot, "skills");
  const actualSkills = existsSync(skillRoot) ? readdirSync(skillRoot).filter((name) => existsSync(join(skillRoot, name, "SKILL.md"))) : [];
  check(same(actualSkills, pkg.skills), `${pkg.name}: skill inventory mismatch`);
  if (pkg.profile === "full") check(same(pkg.skills, standalone.skills ?? []), `${pkg.name}: missing full skill`);
  else {
    check(same(pkg.skills, ["extrovert-connect", "extrovert-manage-inboxes", "extrovert-read-inbox", "extrovert-send-email", "extrovert-writing-rules", "wait-for-otp", "extrovert-support"]), "assistant seven-skill inventory mismatch");
    check(!capabilities.tools?.some((name) => /commerce|administrative|signup|activation|enrollment|webhook|export_email_config|quote_domain|request_domain_purchase|request_plan_change|offboard_domain|get_job/.test(name)), "assistant includes excluded tools");
  }
  if (pkg.claude) {
    const cm = readJSON(join(pluginRoot, ".claude-plugin/plugin.json"));
    check(cm.name === pkg.name && cm.version === pkg.version, `${pkg.name}: Claude name/version mismatch`);
    check(cm.mcpServers === "./.mcp.json" && cm.skills === "./skills/", `${pkg.name}: Claude paths`);
    check(!cm.interface, `${pkg.name}: unsupported Claude interface metadata`);
    check(claude.plugins?.find((p) => p.name === pkg.name)?.source === `./plugins/${pkg.name}`, `${pkg.name}: Claude source path`);
  }
  for (const name of actualSkills) {
    const dir = join(skillRoot, name);
    const skill = readFileSync(join(dir, "SKILL.md"), "utf8");
    check(skill.startsWith(`---\nname: ${name}\n`), `${pkg.name}/${name}: frontmatter name`);
    check(skill.includes(`  version: "${pkg.version}"`), `${pkg.name}/${name}: skill version drift`);
    check(digest(dir) === capabilities.skills?.[name]?.sha256, `${pkg.name}/${name}: skill digest mismatch`);
    check((capabilities.skills?.[name]?.mcp_tools ?? []).every((t) => capabilities.tools?.includes(t)), `${pkg.name}/${name}: references an excluded tool`);
    for (const path of files(dir)) {
      check([".md", ".json", ".yaml"].includes(extname(path)), `${path}: non-prose asset in skill`);
      const source = readFileSync(path, "utf8");
      try { assertAsciiGuidance(guidanceText(readFileSync(path), path), path); }
      catch (error) { check(false, error.message); }
      check(!/\[TODO:|\{\{(?:shared|include):/.test(source), `${path}: unfinished template`);
      for (const match of source.matchAll(/\]\(([^)]+)\)/g)) {
        const link = match[1].split("#")[0];
        if (!link || /^(https?:|mailto:)/.test(link)) continue;
        const target = resolve(dirname(path), link);
        check(target.startsWith(`${dir}${sep}`) && existsSync(target), `${path}: escaping/broken reference ${link}`);
      }
      if (pkg.profile === "assistant") {
        for (const tool of fullToolNames) {
          if (new RegExp(`\\b${tool}\\b`).test(source)) check(capabilities.tools.includes(tool), `${path}: excluded tool reference ${tool}`);
        }
        check(!/llms\.txt|agent-contract\.json|npx\s|\bextrovert-admin\b|\bextrovert-full\b|\bextrovert-sdk\b|\bconfigure-himalaya\b|\bextrovert\s+tool\s|\/v1\/|Full account control/.test(source), `${path}: full-only instruction or bypass reference`);
      }
    }
  }
  for (const path of files(pluginRoot)) {
    const rel = relative(pluginRoot, path);
    check(rel.startsWith("skills/") || [".codex-plugin/plugin.json", ".claude-plugin/plugin.json", ".mcp.json", "capabilities.json", "tool-catalog.json"].includes(rel), `${pkg.name}: undeclared file ${rel}`);
    check(!/(^|\/)(?:scripts|hooks|node_modules|\.env|evals|artifacts)(\/|$)/.test(rel), `${pkg.name}: forbidden file ${rel}`);
    check(!/\b(?:pk_agent_|ev_access_|ev_credential_)[A-Za-z0-9]{12,}/.test(readFileSync(path, "utf8")), `${pkg.name}: credential-shaped content ${rel}`);
  }
}
if (errors.length) {
  console.error(`Extrovert plugin validation failed with ${errors.length} error(s):\n${errors.map((e) => `- ${e}`).join("\n")}`);
  process.exit(1);
}
console.log(`validated ${inventory.packages.length} plugin wrappers, two profiles, and ${actualStandalone.length} standalone skills`);
