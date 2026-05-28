import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const buildDir = path.join(__dirname, '../build');
const indexPath = path.join(buildDir, 'index.html');

let html = fs.readFileSync(indexPath, 'utf-8');

// Inline CSS files
html = html.replace(/<link rel="stylesheet" href="([^"]+)">/g, (match, href) => {
	const cssPath = path.join(buildDir, href);
	if (fs.existsSync(cssPath)) {
		const css = fs.readFileSync(cssPath, 'utf-8');
		return `<style>${css}</style>`;
	}
	return match;
});

// Inline JavaScript files
html = html.replace(/<script[^>]*src="([^"]+)"[^>]*><\/script>/g, (match, src) => {
	const jsPath = path.join(buildDir, src);
	if (fs.existsSync(jsPath)) {
		const js = fs.readFileSync(jsPath, 'utf-8');
		return `<script>${js}</script>`;
	}
	return match;
});

// Write the inlined HTML
const outputPath = path.join(buildDir, 'index.html');
fs.writeFileSync(outputPath, html);

const newSize = fs.statSync(outputPath).size;
console.log(`✅ Built single HTML file`);
console.log(`📦 File size: ${(newSize / 1024).toFixed(2)} KB`);
console.log(`📁 Location: ${outputPath}`);
