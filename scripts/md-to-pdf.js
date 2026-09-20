#!/usr/bin/env node

/**
 * Markdown to PDF Converter Script
 * Converts any .md (Markdown) file into a beautifully styled, print-ready PDF using Headless Chrome/Edge.
 *
 * Usage:
 *   node scripts/md-to-pdf.js [path/to/file.md] [path/to/output.pdf]
 *
 * Examples:
 *   node scripts/md-to-pdf.js bio/biodata.md
 *   node scripts/md-to-pdf.js bio/biodata.md bio/biodata.pdf
 *   npm run md:pdf -- bio/biodata.md
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// 1. Browser Detection Paths for Windows/macOS/Linux
const BROWSER_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium'
];

function findBrowser() {
  for (const p of BROWSER_PATHS) {
    if (p && fs.existsSync(p)) return p;
  }
  return null;
}

/**
 * Robust Markdown-to-HTML parser with full table, list, and GFM support.
 */
function parseMarkdown(md) {
  const lines = md.split(/\r?\n/);
  let html = [];
  let inTable = false;
  let inList = false;
  let inBlockquote = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Blank line
    if (!line.trim()) {
      if (inTable) { html.push('</tbody></table></div>'); inTable = false; }
      if (inList) { html.push('</ul>'); inList = false; }
      if (inBlockquote) { html.push('</blockquote>'); inBlockquote = false; }
      continue;
    }

    // Markdown Horizontal Rule (---, ***, ___)
    if (/^(\*{3,}|-{3,}|_{3,})$/.test(line.trim())) {
      if (inTable) { html.push('</tbody></table></div>'); inTable = false; }
      if (inList) { html.push('</ul>'); inList = false; }
      if (inBlockquote) { html.push('</blockquote>'); inBlockquote = false; }
      html.push('<hr class="divider">');
      continue;
    }

    // Blockquotes
    if (line.startsWith('>')) {
      if (!inBlockquote) {
        if (inTable) { html.push('</tbody></table></div>'); inTable = false; }
        if (inList) { html.push('</ul>'); inList = false; }
        html.push('<blockquote>');
        inBlockquote = true;
      }
      const quoteText = line.replace(/^>\s?/, '');
      html.push(`<p>${formatInline(quoteText)}</p>`);
      continue;
    } else if (inBlockquote) {
      html.push('</blockquote>');
      inBlockquote = false;
    }

    // Markdown Table Row
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const cells = line.trim().split('|').slice(1, -1).map(c => c.trim());
      
      // Check if next or current line is table separator (| --- | --- |)
      if (cells.every(c => /^:?-+:?$/.test(c))) {
        continue; // delimiter row
      }

      if (!inTable) {
        if (inList) { html.push('</ul>'); inList = false; }
        html.push('<div class="table-wrapper"><table><thead><tr>');
        cells.forEach(c => html.push(`<th>${formatInline(c)}</th>`));
        html.push('</tr></thead><tbody>');
        inTable = true;
      } else {
        html.push('<tr>');
        cells.forEach((c, idx) => {
          // Add class if first column is typically a field label
          const isLabel = idx === 0 && cells.length === 2;
          html.push(`<td${isLabel ? ' class="field-label"' : ''}>${formatInline(c)}</td>`);
        });
        html.push('</tr>');
      }
      continue;
    } else if (inTable) {
      html.push('</tbody></table></div>');
      inTable = false;
    }

    // Headings (#, ##, ###, ####, #####)
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      if (inList) { html.push('</ul>'); inList = false; }
      const level = headingMatch[1].length;
      const text = formatInline(headingMatch[2]);
      
      // Special styling for Bismillah header or main titles
      if (text.includes('﷽') || text.includes('بِسْمِ اللَّهِ')) {
        html.push(`<div class="bismillah-header"><div class="bismillah-text">${text}</div></div>`);
      } else {
        html.push(`<h${level} class="heading-${level}">${text}</h${level}>`);
      }
      continue;
    }

    // Unordered Lists (-, *, •)
    const listMatch = line.match(/^(\s*)[-*•]\s+(.*)$/);
    if (listMatch) {
      if (!inList) {
        html.push('<ul class="custom-list">');
        inList = true;
      }
      html.push(`<li>${formatInline(listMatch[2])}</li>`);
      continue;
    } else if (inList) {
      html.push('</ul>');
      inList = false;
    }

    // Standard Paragraph
    html.push(`<p>${formatInline(line)}</p>`);
  }

  if (inTable) html.push('</tbody></table></div>');
  if (inList) html.push('</ul>');
  if (inBlockquote) html.push('</blockquote>');

  return html.join('\n');
}

/**
 * Parses inline markdown tags: bold, italic, links, codes, badges.
 */
function formatInline(text) {
  return text
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/_([^_]+)_/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

/**
 * Wraps parsed HTML inside a clean, modern print-ready document shell.
 */
function buildFullHtml(title, bodyContent) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    @page {
      size: A4;
      margin: 12mm 15mm 12mm 15mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: Arial, "Helvetica Neue", Helvetica, "Segoe UI", sans-serif;
      color: #000000;
      background-color: #ffffff;
      line-height: 1.45;
      font-size: 9.5pt;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .container {
      max-width: 100%;
      margin: 0 auto;
    }

    /* BISMILLAH & TITLES */
    .bismillah-header {
      text-align: center;
      margin-bottom: 4px;
    }

    .bismillah-text {
      font-size: 15pt;
      font-weight: bold;
      color: #000000;
      letter-spacing: 0.5px;
    }

    h1.heading-1 {
      font-size: 14pt;
      color: #000000;
      text-align: center;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
      text-transform: uppercase;
      font-weight: bold;
    }

    h2.heading-2 {
      font-size: 10pt;
      color: #000000;
      border-bottom: 1px solid #000000;
      padding-bottom: 2px;
      margin-top: 12px;
      margin-bottom: 6px;
      text-transform: uppercase;
      font-weight: bold;
      page-break-after: avoid;
    }

    h3.heading-3 {
      font-size: 9.5pt;
      color: #000000;
      text-align: center;
      margin-bottom: 6px;
      font-weight: bold;
    }

    h4.heading-4 {
      font-size: 9pt;
      color: #000000;
      margin-top: 6px;
      margin-bottom: 3px;
      font-weight: bold;
    }

    p {
      margin-bottom: 4px;
      color: #000000;
      text-align: justify;
    }

    a {
      color: #000000;
      text-decoration: underline;
    }

    .divider {
      height: 1px;
      background-color: #000000;
      border: none;
      margin: 6px 0 10px 0;
    }

    /* TABLES */
    .table-wrapper {
      margin-bottom: 6px;
      page-break-inside: avoid;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9pt;
      margin-bottom: 4px;
    }

    th, td {
      border: 1px solid #000000;
      padding: 4.5px 7px;
      text-align: left;
      vertical-align: top;
    }

    th {
      background-color: #f0f0f0;
      color: #000000;
      font-weight: bold;
    }

    td.field-label {
      width: 25%;
      font-weight: bold;
      color: #000000;
      background-color: #f9f9f9;
    }

    /* LISTS */
    ul.custom-list {
      list-style-type: square;
      padding-left: 18px;
      margin-bottom: 6px;
      page-break-inside: avoid;
    }

    ul.custom-list li {
      margin-bottom: 2.5px;
      font-size: 9pt;
      color: #000000;
    }

    /* BLOCKQUOTES */
    blockquote {
      background-color: #ffffff;
      border-left: 3px solid #000000;
      padding: 4px 8px;
      margin: 6px 0;
      font-size: 9pt;
      color: #000000;
      page-break-inside: avoid;
    }

    code {
      font-family: monospace;
      font-size: 8.5pt;
      background: #f0f0f0;
      padding: 1px 3px;
      border: 1px solid #ccc;
    }
  </style>
</head>
<body>
  <div class="container">
    ${bodyContent}
  </div>
</body>
</html>`;
}

/**
 * Main conversion function
 */
async function convert(mdFilePath, outPdfPath) {
  const resolvedMd = path.resolve(process.cwd(), mdFilePath);
  if (!fs.existsSync(resolvedMd)) {
    console.error(`❌ Input Markdown file not found: ${resolvedMd}`);
    process.exit(1);
  }

  const defaultPdfName = path.basename(resolvedMd, path.extname(resolvedMd)) + '.pdf';
  const resolvedPdf = outPdfPath
    ? path.resolve(process.cwd(), outPdfPath)
    : path.join(path.dirname(resolvedMd), defaultPdfName);

  console.log(`\n📄 Converting Markdown to PDF:`);
  console.log(`   Source: ${resolvedMd}`);
  console.log(`   Target: ${resolvedPdf}\n`);

  const browserPath = findBrowser();
  if (!browserPath) {
    console.error('❌ Could not locate Chrome or Microsoft Edge on your machine.');
    console.error('   Please ensure Google Chrome or Edge is installed.');
    process.exit(1);
  }

  console.log(`🌐 Using Browser Engine: ${path.basename(browserPath)}`);

  // 1. Read Markdown & Convert to HTML
  const mdContent = fs.readFileSync(resolvedMd, 'utf8');
  const bodyHtml = parseMarkdown(mdContent);
  const docTitle = path.basename(resolvedMd, path.extname(resolvedMd));
  const fullHtml = buildFullHtml(docTitle, bodyHtml);

  // 2. Save temporary HTML file
  const tempHtmlPath = path.join(path.dirname(resolvedPdf), `_temp_${Date.now()}.html`);
  fs.writeFileSync(tempHtmlPath, fullHtml, 'utf8');

  try {
    // 3. Print to PDF via Headless Browser
    const fileUrl = 'file:///' + tempHtmlPath.replace(/\\/g, '/');
    const args = [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--disable-extensions',
      `--print-to-pdf=${resolvedPdf}`,
      '--no-pdf-header-footer',
      fileUrl
    ];

    const result = spawnSync(browserPath, args, { stdio: 'inherit' });

    if (fs.existsSync(resolvedPdf)) {
      const stats = fs.statSync(resolvedPdf);
      const kb = (stats.size / 1024).toFixed(1);
      console.log(`\n✅ PDF generated successfully!`);
      console.log(`   📁 Output: ${resolvedPdf} (${kb} KB)\n`);
    } else {
      console.error('❌ Failed to produce PDF output.');
      if (result.error) console.error(result.error);
      process.exit(1);
    }
  } finally {
    // Clean up temporary HTML
    if (fs.existsSync(tempHtmlPath)) {
      fs.unlinkSync(tempHtmlPath);
    }
  }
}

// CLI Argument Handling
const args = process.argv.slice(2);
const mdInput = args[0] || 'bio/biodata.md';
const pdfOutput = args[1];

convert(mdInput, pdfOutput).catch(err => {
  console.error('Fatal Error:', err);
  process.exit(1);
});
