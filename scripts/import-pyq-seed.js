/**
 * One-time: build js/sites/pyq-default.js from pyq/script.js
 * Run: node scripts/import-pyq-seed.js
 */
const fs = require("fs");
const path = require("path");

const scriptPath = path.join(__dirname, "..", "pyq", "script.js");
const outPath = path.join(__dirname, "..", "js", "sites", "pyq-default.js");
const src = fs.readFileSync(scriptPath, "utf8");

let cut = src.indexOf("/* ============================================================\r\n   DOM Ready");
if (cut < 0) cut = src.indexOf("/* ============================================================\n   DOM Ready");
if (cut < 0) cut = src.indexOf("DOM Ready");
if (cut < 0) {
  console.error("Could not find DOM Ready marker in pyq/script.js");
  process.exit(1);
}

const chunk = src.slice(0, cut);
const PYQ_DATA = extractArray(chunk, "PYQ_DATA");
const EXAM_DETAILS_DATA = extractObject(chunk, "EXAM_DETAILS_DATA");

const papers = PYQ_DATA.map(function (p, idx) {
  return {
    id: "pyq_" + idx,
    title: p.title || "",
    year: String(p.year || ""),
    class: String(p.class || ""),
    subject: p.subject || "",
    exam: p.exam || "",
    view: p.view || "#",
    download: p.download || "#"
  };
});

const examNames = {};
papers.forEach(function (p) {
  examNames[p.exam] = true;
});
const exams = Object.keys(examNames).sort().map(function (name) {
  return { name: name, active: true };
});

const payload = {
  papers: papers,
  examDetails: EXAM_DETAILS_DATA,
  exams: exams
};

const body =
  "/**\n * PYQ Hub default content (generated from pyq/script.js).\n */\n" +
  "window.GV_PYQ_DEFAULT_CONTENT = " +
  JSON.stringify(payload, null, 2) +
  ";\n";

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, body, "utf8");
console.log("Wrote", outPath, "—", papers.length, "papers,", exams.length, "exams");

function extractArray(text, name) {
  const start = text.indexOf("const " + name + " = [");
  if (start < 0) throw new Error(name + " array not found");
  let i = text.indexOf("[", start);
  let depth = 0;
  for (let j = i; j < text.length; j++) {
    const c = text[j];
    if (c === "[") depth++;
    if (c === "]") {
      depth--;
      if (depth === 0) {
        return Function("return " + text.slice(i, j + 1))();
      }
    }
  }
  throw new Error("Could not parse " + name);
}

function extractObject(text, name) {
  const start = text.indexOf("const " + name + " = {");
  if (start < 0) throw new Error(name + " object not found");
  let i = text.indexOf("{", start);
  let depth = 0;
  for (let j = i; j < text.length; j++) {
    const c = text[j];
    if (c === "{") depth++;
    if (c === "}") {
      depth--;
      if (depth === 0) {
        const raw = text.slice(i, j + 1);
        return Function("return " + raw)();
      }
    }
  }
  throw new Error("Could not parse " + name);
}
