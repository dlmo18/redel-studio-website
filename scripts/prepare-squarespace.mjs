import fs from "node:fs";
import path from "node:path";

const [, , outDir, baseUrl] = process.argv;

if (!outDir || !baseUrl) {
  console.error("Uso: node scripts/prepare-squarespace.mjs <outDir> <baseUrl>");
  process.exit(1);
}

const indexPath = path.join(outDir, "index.html");

if (!fs.existsSync(indexPath)) {
  console.error(`No existe ${indexPath}`);
  process.exit(1);
}

let html = fs.readFileSync(indexPath, "utf8");
const normalizedBase = baseUrl.replace(/\/$/, "");

// Reescribe rutas absolutas del export de Next a un prefijo estático externo.
html = html
  .replaceAll('href="/_next/', `href="${normalizedBase}/_next/`)
  .replaceAll('src="/_next/', `src="${normalizedBase}/_next/`)
  .replaceAll('href="/images/', `href="${normalizedBase}/images/`)
  .replaceAll('src="/images/', `src="${normalizedBase}/images/`)
  .replaceAll('href="/fonts/', `href="${normalizedBase}/fonts/`)
  .replaceAll('src="/fonts/', `src="${normalizedBase}/fonts/`)
  .replaceAll('href="/placeholder', `href="${normalizedBase}/placeholder`)
  .replaceAll('src="/placeholder', `src="${normalizedBase}/placeholder`)
  .replaceAll('href="/content.json"', `href="${normalizedBase}/content.json"`)
  .replaceAll('src="/content.json"', `src="${normalizedBase}/content.json"`);

fs.writeFileSync(indexPath, html, "utf8");
console.log("index.html actualizado para baseUrl:", normalizedBase);
