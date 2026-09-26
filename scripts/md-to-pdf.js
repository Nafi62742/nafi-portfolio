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
 * Robust Markdown-to-HTML parser with full table, list, code block, and GFM support.
 */
function parseMarkdown(md) {
  const lines = md.split(/\r?\n/);
  let html = [];
  let inTable = false;
  let inList = false;
  let inOrderedList = false;
  let inBlockquote = false;
  let inCodeBlock = false;
  let codeBlockLang = '';
  let codeBlockLines = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Handle fenced code blocks (```)
    if (line.trim().startsWith('```')) {
      if (!inCodeBlock) {
        if (inTable) { html.push('</tbody></table></div>'); inTable = false; }
        if (inList) { html.push('</ul>'); inList = false; }
        if (inOrderedList) { html.push('</ol>'); inOrderedList = false; }
        if (inBlockquote) { html.push('</blockquote>'); inBlockquote = false; }

        inCodeBlock = true;
        codeBlockLang = line.trim().replace(/^```/, '').trim();
        codeBlockLines = [];
        continue;
      } else {
        inCodeBlock = false;
        const escapedCode = codeBlockLines
          .join('\n')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        html.push(`<div class="code-block-wrapper"><div class="code-header">${codeBlockLang ? codeBlockLang.toUpperCase() : 'CODE'}</div><pre><code class="language-${codeBlockLang}">${escapedCode}</code></pre></div>`);
        continue;
      }
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    // Blank line
    if (!line.trim()) {
      if (inTable) { html.push('</tbody></table></div>'); inTable = false; }
      if (inList) { html.push('</ul>'); inList = false; }
      if (inOrderedList) { html.push('</ol>'); inOrderedList = false; }
      if (inBlockquote) { html.push('</blockquote>'); inBlockquote = false; }
      continue;
    }

    // Markdown Horizontal Rule (---, ***, ___)
    if (/^(\*{3,}|-{3,}|_{3,})$/.test(line.trim())) {
      if (inTable) { html.push('</tbody></table></div>'); inTable = false; }
      if (inList) { html.push('</ul>'); inList = false; }
      if (inOrderedList) { html.push('</ol>'); inOrderedList = false; }
      if (inBlockquote) { html.push('</blockquote>'); inBlockquote = false; }
      html.push('<hr class="divider">');
      continue;
    }

    // Blockquotes
    if (line.startsWith('>')) {
      if (!inBlockquote) {
        if (inTable) { html.push('</tbody></table></div>'); inTable = false; }
        if (inList) { html.push('</ul>'); inList = false; }
        if (inOrderedList) { html.push('</ol>'); inOrderedList = false; }
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
        if (inOrderedList) { html.push('</ol>'); inOrderedList = false; }
        html.push('<div class="table-wrapper"><table><thead><tr>');
        cells.forEach(c => html.push(`<th>${formatInline(c)}</th>`));
        html.push('</tr></thead><tbody>');
        inTable = true;
      } else {
        html.push('<tr>');
        cells.forEach((c, idx) => {
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
      if (inOrderedList) { html.push('</ol>'); inOrderedList = false; }
      const level = headingMatch[1].length;
      const text = formatInline(headingMatch[2]);
      
      if (text.includes('﷽') || text.includes('بِسْمِ اللَّهِ')) {
        html.push(`<div class="bismillah-header"><div class="bismillah-text">${text}</div></div>`);
      } else {
        html.push(`<h${level} class="heading-${level}">${text}</h${level}>`);
      }
      continue;
    }

    // Task list / Checkbox items (- [ ] or - [x])
    const taskMatch = line.match(/^(\s*)[-*•]\s+\[([ xX])\]\s+(.*)$/);
    if (taskMatch) {
      if (!inList) {
        html.push('<ul class="custom-list task-list">');
        inList = true;
      }
      const isChecked = taskMatch[2].toLowerCase() === 'x';
      html.push(`<li class="task-item"><span class="checkbox">${isChecked ? '☑' : '☐'}</span> ${formatInline(taskMatch[3])}</li>`);
      continue;
    }

    // Ordered Lists (1., 2., etc.)
    const orderedListMatch = line.match(/^(\s*)\d+\.\s+(.*)$/);
    if (orderedListMatch) {
      if (!inOrderedList) {
        if (inList) { html.push('</ul>'); inList = false; }
        html.push('<ol class="custom-ordered-list">');
        inOrderedList = true;
      }
      html.push(`<li>${formatInline(orderedListMatch[2])}</li>`);
      continue;
    } else if (inOrderedList) {
      html.push('</ol>');
      inOrderedList = false;
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

    // Display Math Equations ($$...$$)
    if (line.trim().startsWith('$$') && line.trim().endsWith('$$') && line.trim().length > 4) {
      let math = line.trim().slice(2, -2).trim();
      let formattedMath = formatMathFormula(math);
      html.push(`<div class="math-display">${formattedMath}</div>`);
      continue;
    }

    // Standard Paragraph
    html.push(`<p>${formatInline(line)}</p>`);
  }

  if (inCodeBlock) {
    const escapedCode = codeBlockLines.join('\n').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    html.push(`<div class="code-block-wrapper"><pre><code>${escapedCode}</code></pre></div>`);
  }
  if (inTable) html.push('</tbody></table></div>');
  if (inList) html.push('</ul>');
  if (inOrderedList) html.push('</ol>');
  if (inBlockquote) html.push('</blockquote>');

  return html.join('\n');
}

/**
 * Parses inline markdown tags: bold, italic, links, codes, badges, math.
 */
function formatInline(text) {
  let res = text
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/_([^_]+)_/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Fast & reliable inline math replacement (no external CDN dependency)
  res = res
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\$H_0\$/g, '<em>H</em><sub>0</sub>')
    .replace(/\$H_1\$/g, '<em>H</em><sub>1</sub>')
    .replace(/\$\\alpha\$/g, '&alpha;')
    .replace(/\$\\beta\$/g, '&beta;')
    .replace(/\$1-\\beta\$/g, '1 &minus; &beta;')
    .replace(/\$1-\\alpha\/2\$/g, '1 &minus; &alpha;/2')
    .replace(/Z_\{1-\\alpha\/2\}/g, 'Z<sub>1&minus;&alpha;/2</sub>')
    .replace(/Z_\{1-\\beta\}/g, 'Z<sub>1&minus;&beta;</sub>')
    .replace(/\$\\mu_A\$/g, '&mu;<sub>A</sub>')
    .replace(/\$\\mu_B\$/g, '&mu;<sub>B</sub>')
    .replace(/\\mu_A/g, '&mu;<sub>A</sub>')
    .replace(/\\mu_B/g, '&mu;<sub>B</sub>')
    .replace(/\\neq/g, '&ne;')
    .replace(/\\cdot/g, '&middot;')
    .replace(/\\times/g, '&times;')
    .replace(/\\propto/g, '&prop;')
    .replace(/\\approx/g, '&asymp;')
    .replace(/\\ge/g, '&ge;')
    .replace(/\\le/g, '&le;')
    .replace(/\\chi\^2/g, '&chi;<sup>2</sup>')
    .replace(/\$\\chi\^2\$/g, '&chi;<sup>2</sup>')
    .replace(/\$p_1\$/g, '<em>p</em><sub>1</sub>')
    .replace(/\$p_2\$/g, '<em>p</em><sub>2</sub>')
    .replace(/p_1/g, '<em>p</em><sub>1</sub>')
    .replace(/p_2/g, '<em>p</em><sub>2</sub>')
    .replace(/\\bar\{p\}/g, '<em>p̄</em>')
    .replace(/\$\\bar\{p\}\$/g, '<em>p̄</em>')
    .replace(/\\delta/g, '&delta;')
    .replace(/\$\\delta\$/g, '&delta;')
    .replace(/\$p < \\alpha\$/g, '<em>p</em> &lt; &alpha;')
    .replace(/\$p < 0\.05\$/g, '<em>p</em> &lt; 0.05')
    .replace(/\$p < 0\.001\$/g, '<em>p</em> &lt; 0.001')
    .replace(/\$p\$-value/g, '<em>p</em>-value')
    .replace(/30\%\\text\{--\}40\%/g, '30%–40%')
    .replace(/\$([A-Za-z0-9_+\-=/%\s,.:=<>]+)\$/g, '<em>$1</em>');

  return res;
}

/**
 * Formats LaTeX display math into clean HTML representations.
 */
function formatMathFormula(math) {
  let m = math;
  // \text{...} -> plain text
  m = m.replace(/\\text\{([^}]+)\}/g, '$1');

  // Fractions: \frac{num}{den} -> structured fraction
  m = m.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '<span class="fraction"><span class="numerator">$1</span><span class="denominator">$2</span></span>');

  // Clean common symbols
  m = m
    .replace(/\\sum/g, '&sum;')
    .replace(/\\cdot/g, '&middot;')
    .replace(/\\times/g, '&times;')
    .replace(/\\propto/g, '&prop;')
    .replace(/\\approx/g, '&asymp;')
    .replace(/Z_\{1-\\alpha\/2\}/g, 'Z<sub>1&minus;&alpha;/2</sub>')
    .replace(/Z_\{1-\\beta\}/g, 'Z<sub>1&minus;&beta;</sub>')
    .replace(/\\bar\{p\}/g, '<em>p̄</em>')
    .replace(/n_\{per variant\}/g, '<em>n</em><sub>per variant</sub>')
    .replace(/n_\{([^}]+)\}/g, '<em>n</em><sub>$1</sub>')
    .replace(/\\chi\^2/g, '&chi;<sup>2</sup>')
    .replace(/\^2/g, '<sup>2</sup>')
    .replace(/_1/g, '<sub>1</sub>')
    .replace(/_2/g, '<sub>2</sub>')
    .replace(/_i/g, '<sub>i</sub>');

  return m;
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
      margin: 14mm 16mm 14mm 16mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1a1a1a;
      background-color: #ffffff;
      line-height: 1.55;
      font-size: 9pt;
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
      margin-bottom: 6px;
    }

    .bismillah-text {
      font-size: 16pt;
      font-weight: bold;
      color: #0f172a;
      letter-spacing: 0.5px;
    }

    h1.heading-1 {
      font-size: 16pt;
      color: #0f172a;
      letter-spacing: -0.3px;
      margin-top: 4px;
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 2px solid #2563eb;
      font-weight: 700;
    }

    h2.heading-2 {
      font-size: 12pt;
      color: #1e293b;
      border-bottom: 1.5px solid #cbd5e1;
      padding-bottom: 3px;
      margin-top: 14px;
      margin-bottom: 8px;
      font-weight: 700;
      page-break-after: avoid;
    }

    h3.heading-3 {
      font-size: 10.5pt;
      color: #334155;
      margin-top: 10px;
      margin-bottom: 5px;
      font-weight: 600;
      page-break-after: avoid;
    }

    h4.heading-4 {
      font-size: 9.5pt;
      color: #475569;
      margin-top: 8px;
      margin-bottom: 4px;
      font-weight: 600;
      page-break-after: avoid;
    }

    p {
      margin-bottom: 6px;
      color: #334155;
      text-align: justify;
    }

    a {
      color: #2563eb;
      text-decoration: none;
    }

    .divider {
      height: 1px;
      background-color: #e2e8f0;
      border: none;
      margin: 10px 0 12px 0;
    }

    /* TABLES */
    .table-wrapper {
      margin: 8px 0 10px 0;
      page-break-inside: avoid;
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8.5pt;
      margin-bottom: 4px;
    }

    th, td {
      border: 1px solid #cbd5e1;
      padding: 5.5px 8px;
      text-align: left;
      vertical-align: top;
    }

    th {
      background-color: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
    }

    tr:nth-child(even) td {
      background-color: #f8fafc;
    }

    td.field-label {
      width: 25%;
      font-weight: 600;
      color: #1e293b;
      background-color: #f1f5f9;
    }

    /* LISTS */
    ul.custom-list {
      list-style-type: disc;
      padding-left: 20px;
      margin-bottom: 8px;
      page-break-inside: avoid;
    }

    ol.custom-ordered-list {
      padding-left: 20px;
      margin-bottom: 8px;
      page-break-inside: avoid;
    }

    ul.custom-list li, ol.custom-ordered-list li {
      margin-bottom: 3px;
      font-size: 8.8pt;
      color: #334155;
    }

    ul.task-list {
      list-style-type: none;
      padding-left: 4px;
    }

    .task-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .task-item .checkbox {
      font-size: 11pt;
      color: #2563eb;
    }

    /* BLOCKQUOTES */
    blockquote {
      background-color: #f8fafc;
      border-left: 3.5px solid #2563eb;
      padding: 6px 12px;
      margin: 8px 0;
      font-size: 8.8pt;
      color: #334155;
      page-break-inside: avoid;
      border-radius: 0 4px 4px 0;
    }

    /* CODE BLOCKS */
    .code-block-wrapper {
      margin: 8px 0 10px 0;
      background-color: #0f172a;
      border-radius: 5px;
      border: 1px solid #1e293b;
      page-break-inside: avoid;
      overflow: hidden;
    }

    .code-header {
      background-color: #1e293b;
      color: #94a3b8;
      font-size: 7.5pt;
      font-weight: 700;
      letter-spacing: 0.5px;
      padding: 3px 10px;
      border-bottom: 1px solid #334155;
    }

    pre {
      padding: 8px 12px;
      margin: 0;
      overflow-x: auto;
      line-height: 1.4;
    }

    code {
      font-family: Consolas, Monaco, "Courier New", Courier, monospace;
      font-size: 8pt;
    }

    pre code {
      color: #f1f5f9;
      background: transparent;
      padding: 0;
      border: none;
    }

    p code, li code, td code {
      font-size: 8.2pt;
      background: #f1f5f9;
      color: #0f172a;
      padding: 1.5px 4px;
      border-radius: 3px;
      border: 1px solid #e2e8f0;
    }

    /* MATH BLOCKS */
    .math-display {
      text-align: center;
      margin: 10px 0;
      padding: 8px 12px;
      font-size: 10pt;
      font-weight: 500;
      color: #0f172a;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      page-break-inside: avoid;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 6px;
    }

    .fraction {
      display: inline-flex;
      flex-direction: column;
      vertical-align: middle;
      text-align: center;
      padding: 0 4px;
      font-size: 0.9em;
    }

    .fraction .numerator {
      border-bottom: 1.5px solid #0f172a;
      padding-bottom: 2px;
    }

    .fraction .denominator {
      padding-top: 2px;
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
