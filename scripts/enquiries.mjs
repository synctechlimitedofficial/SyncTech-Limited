#!/usr/bin/env node
/**
 * Reads the local enquiry log and prints it.
 *
 *   npm run enquiries            # newest 20, readable
 *   npm run enquiries -- --all   # everything
 *   npm run enquiries -- --json  # raw JSON, for piping into jq
 *   npm run enquiries -- --csv   # spreadsheet-friendly
 */
import { readFile } from "node:fs/promises";
import path from "node:path";

const LOG = path.resolve(
  process.cwd(),
  process.env.ENQUIRY_LOG_DIR || ".data",
  "project-requests.jsonl",
);

const args = process.argv.slice(2);
const wants = (flag) => args.includes(flag);

let raw;
try {
  raw = await readFile(LOG, "utf8");
} catch {
  console.log(`No enquiries yet — nothing at ${LOG}`);
  process.exit(0);
}

const rows = raw
  .split("\n")
  .filter(Boolean)
  .map((line, i) => {
    try {
      return JSON.parse(line);
    } catch {
      console.warn(`! skipped unparseable line ${i + 1}`);
      return null;
    }
  })
  .filter(Boolean)
  .reverse();

const shown = wants("--all") ? rows : rows.slice(0, 20);

if (wants("--json")) {
  console.log(JSON.stringify(shown, null, 2));
  process.exit(0);
}

if (wants("--csv")) {
  const cols = [
    "reference", "receivedAt", "fullName", "companyName", "email", "phone",
    "service", "projectType", "budget", "contactMethod", "description",
  ];
  const cell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  console.log(cols.join(","));
  for (const row of shown) console.log(cols.map((c) => cell(row[c])).join(","));
  process.exit(0);
}

console.log(`\n${rows.length} enquiry(ies) total — showing ${shown.length}\n`);

for (const row of shown) {
  const when = new Date(row.receivedAt).toLocaleString();
  console.log("─".repeat(66));
  console.log(`${row.reference}   ${when}`);
  console.log(`${row.fullName}${row.companyName ? ` · ${row.companyName}` : ""}`);
  console.log(`${row.email}${row.phone ? ` · ${row.phone}` : ""}  (prefers ${row.contactMethod})`);
  console.log(`Service : ${row.service}`);
  if (row.projectType) console.log(`Type    : ${row.projectType}`);
  if (row.budget) console.log(`Budget  : ${row.budget}`);
  console.log(`\n${row.description}\n`);
}
