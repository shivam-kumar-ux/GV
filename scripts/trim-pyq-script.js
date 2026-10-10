const fs = require("fs");
const p = "pyq/script.js";
const src = fs.readFileSync(p, "utf8");
let cut = src.indexOf("/* ============================================================\n   DOM Ready");
if (cut < 0) cut = src.indexOf("DOM Ready");
const tail = src.slice(cut);
const head = [
  "/* PYQ Hub — UI script (data from js/pyq-loader.js + pyq-default.js) */",
  "",
  "var PYQ_DATA = window.PYQ_DATA || [];",
  "var EXAM_DETAILS_DATA = window.EXAM_DETAILS_DATA || {};",
  "",
  "window.gvPyqApplyContent = function (raw) {",
  "  if (window.GVPyqLoader && window.GVPyqLoader.apply) window.GVPyqLoader.apply(raw);",
  "  if (typeof renderPYQs === 'function') renderPYQs(PYQ_DATA);",
  "};",
  ""
].join("\n");
fs.writeFileSync(p, head + tail);
console.log("Updated", p);
