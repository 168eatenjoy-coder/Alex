import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'dist');
const htmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(htmlPath)) {
  console.error("No built index.html found. Run vite build first.");
  process.exit(1);
}

let html = fs.readFileSync(htmlPath, 'utf-8');

// 1. Find and inline stylesheet links
const linkRegex = /<link[^>]*href="\/assets\/([^"]+\.css)"[^>]*>/g;
html = html.replace(linkRegex, (match, cssFile) => {
  const cssPath = path.join(distDir, 'assets', cssFile);
  if (fs.existsSync(cssPath)) {
    const cssContent = fs.readFileSync(cssPath, 'utf-8');
    return `<style>\n${cssContent}\n</style>`;
  }
  return match;
});

// 2. Find and inline JavaScript bundles
const scriptRegex = /<script[^>]*src="\/(src\/main\.tsx|assets\/[^"]+\.js)"[^>]*><\/script>/g;
html = html.replace(scriptRegex, (match, jsFile) => {
  const jsPath = path.join(distDir, jsFile.startsWith('src') ? '' : 'assets', jsFile.replace('src/', 'src/'));
  const actualPath = jsFile.startsWith('src') ? path.join(process.cwd(), jsFile) : path.join(distDir, 'assets', jsFile.split('/').pop());
  
  if (fs.existsSync(actualPath)) {
    const jsContent = fs.readFileSync(actualPath, 'utf-8');
    return `<script type="module">\n${jsContent}\n</script>`;
  }
  return match;
});

// 3. Make image references friendly for local runtime (change direct absolute paths to local/relative)
html = html.replace(/"\/product.jpg"/g, '"./product.jpg"');
html = html.replace(/"\/hks_demo.jpg"/g, '"./hks_demo.jpg"');
html = html.replace(/"\/data.jpg"/g, '"./data.jpg"');
html = html.replace(/"\/install.jpg"/g, '"./install.jpg"');
html = html.replace(/"\/src\/assets\/images\/product.jpg"/g, '"./product.jpg"');

// Save the unified standalone file to dist/index_standalone.html and public/index_standalone.html
const outputPath = path.join(distDir, 'index_standalone.html');
const publicOutputPath = path.join(process.cwd(), 'public', 'index_standalone.html');

fs.writeFileSync(outputPath, html);
fs.writeFileSync(publicOutputPath, html);
console.log('Successfully generated standalone file at dist/index_standalone.html & public/index_standalone.html!');
