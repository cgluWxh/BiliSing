import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const srcDir = "static/js_src/";
const outDir = "static/";

for (const file of ["bilising.user.js", "scripts.js"]) {
  const src = path.join(srcDir, file);
  const out = path.join(outDir, file);
  const content = fs.readFileSync(src, "utf8");

  // 提取 ==UserScript== 块
  const metaMatch = content.match(/\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/);
  const metaBlock = metaMatch ? metaMatch[0] + "\n" : "";

  // 临时写一个没有 meta 的版本给 babel 编译
  const tmpFile = src + ".tmp.js";
  fs.writeFileSync(tmpFile, metaMatch ? content.slice(metaMatch.index + metaMatch[0].length) : content);

  execSync(`npx babel ${tmpFile} -o ${out}`);
  fs.unlinkSync(tmpFile);

  // 把 meta 插回最前面
  if (metaBlock) {
    const compiled = fs.readFileSync(out, "utf8");
    const deps = fs.readFileSync(`${srcDir}deps.js`);
    fs.writeFileSync(out, metaBlock + "\n" + deps + "\n" + compiled);
  }
}