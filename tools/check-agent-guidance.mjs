#!/usr/bin/env node
/** ASCII is an authored-guidance policy, never a restriction on customer data. */
import { existsSync, lstatSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export function guidanceText(bytes, label = "guidance") {
  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) throw new Error(`${label}: UTF-8 BOM is not permitted`);
  try { return new TextDecoder("utf-8", { fatal: true }).decode(bytes); }
  catch { throw new Error(`${label}: invalid UTF-8`); }
}

export function assertAsciiGuidance(text, label = "guidance") {
  const match = /[^\t\n\r\x20-\x7e]/u.exec(text);
  if (match) {
    const line = text.slice(0, match.index).split("\n").length;
    throw new Error(`${label}:${line}: non-ASCII authored guidance U+${match[0].codePointAt(0).toString(16).toUpperCase()}`);
  }
  return text;
}

const punctuation = new Map([
  ["\u2018", "'"], ["\u2019", "'"], ["\u201c", '"'], ["\u201d", '"'],
  ["\u2013", "-"], ["\u2014", " - "], ["\u2026", "..."], ["\u00a0", " "],
  ["\u2192", "->"], ["\u2190", "<-"], ["\u2194", "<->"],
  ["\u2264", "<="], ["\u2265", ">="], ["\u00b1", "+/-"], ["\u00b7", " / "],
  ["\u00a9", "(c)"],
  ["\u2514", "+"], ["\u251c", "+"], ["\u2500", "-"], ["\u2502", "|"],
]);
export function asciiPunctuation(text) {
  return [...text].map(character => punctuation.get(character) ?? character).join("");
}

export function guidanceFiles(root) {
  if (lstatSync(root).isSymbolicLink()) throw new Error(`symlink forbidden: ${root}`);
  if (!lstatSync(root).isDirectory()) return [root];
  return readdirSync(root).flatMap(name => guidanceFiles(join(root, name)))
    .filter(path => [".md", ".mdx", ".txt", ".json", ".yaml"].includes(extname(path))).sort();
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const args = process.argv.slice(2);
  const fix = args.includes("--fix-punctuation");
  const selected = args.filter(arg => !arg.startsWith("--"));
  const manifest = JSON.parse(readFileSync(join(root, "skills/skills.json"), "utf8"));
  const paths = selected.length ? selected.map(path => resolve(path)) : [
    ...manifest.skills.map(name => join(root, "skills", name)),
    join(root, "docs/src/llms.txt"), join(root, "docs/src/content/docs"),
    join(root, "release/assistant"),
    join(root, "agent-prompts.json"), join(root, "mcp/README.md"),
    join(root, "sdk/ts/README.md"), join(root, "skills/README.md"),
    join(root, "release/templates/js-README.md"),
  ];
  const files = [...new Set(paths.flatMap(path => existsSync(path) ? guidanceFiles(path) : (() => { throw new Error(`Missing guidance source: ${path}`); })()))];
  const errors = [];
  let changed = 0;
  for (const path of files) {
    try {
      const original = guidanceText(readFileSync(path), path);
      const text = fix ? asciiPunctuation(original) : original;
      assertAsciiGuidance(text, path);
      if (text !== original) { writeFileSync(path, text); changed++; }
    } catch (error) { errors.push(error.message); }
  }
  if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; }
  else console.log(`ASCII authored guidance passed (${files.length} files${fix ? `; ${changed} normalized` : ""}). Customer content is not scanned.`);
}
