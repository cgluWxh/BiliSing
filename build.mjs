import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const srcDir = "static/js_src/";
const outDir = "static/";
const filesToBuild = ["bilising.user.js", "scripts.js"];

function build(file) {
  const src = path.join(srcDir, file);
  const out = path.join(outDir, file);
  const content = fs.readFileSync(src, "utf8");

  // 提取 ==UserScript== 块
  const metaMatch = content.match(/\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/);
  const metaBlock = metaMatch ? metaMatch[0] : "";

  // 临时写一个没有 meta 的版本给 babel 编译
  const tmpFile = src + ".tmp.js";
  const contentWithoutMeta = metaMatch ? content.slice(metaMatch.index + metaMatch[0].length) : content;
  fs.writeFileSync(tmpFile, contentWithoutMeta);

  try {
    execSync(`npx babel ${tmpFile} -o ${out}`);
    console.log(`Compiled ${file} at ${new Date().toLocaleTimeString()}`);
  } catch (err) {
    console.error(`Error compiling ${file}:`, err.message);
  } finally {
    if (fs.existsSync(tmpFile)) {
      fs.unlinkSync(tmpFile);
    }
  }

  // 把 meta 插回最前面
  if (metaBlock) {
    const compiled = fs.readFileSync(out, "utf8");
    const deps = fs.readFileSync(path.join(srcDir, "deps.js"), "utf8");
    fs.writeFileSync(out, metaBlock + "\n\n" + deps + "\n\n" + compiled);
  }
}

const isWatch = process.argv.includes("--watch") || process.argv.includes("-w");

if (isWatch) {
  console.log("Watching for changes in " + srcDir + "...");
  filesToBuild.forEach(file => build(file)); // Initial build
  
  fs.watch(srcDir, (eventType, filename) => {
    if (filesToBuild.includes(filename) || filename === "deps.js") {
      console.log(`File ${filename} changed (${eventType}), rebuilding...`);
      filesToBuild.forEach(file => build(file));
    }
  });
} else {
  filesToBuild.forEach(file => build(file));
}
