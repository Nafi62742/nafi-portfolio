const fs = require('fs');

let content = fs.readFileSync('src/styles.scss', 'utf8');
content = content.replace(/\r\n/g, '\n');

// Replace the duplicated paper-grain block
const badBlockPattern = /\[data-theme="dark"\] \.paper-grain,\s*\[data-theme="slate"\] \.paper-grain,[\s\S]*?\.paper-grain\s*\{\s*mix-blend-mode:\s*screen;\s*opacity:\s*0\.022;\s*\}/;

const goodBlock = `[data-theme="dark"] .paper-grain,
[data-theme="slate"] .paper-grain {
  mix-blend-mode: screen;
  opacity: 0.022;
}`;

content = content.replace(badBlockPattern, goodBlock);
fs.writeFileSync('src/styles.scss', content.replace(/\n/g, '\r\n'), 'utf8');
console.log('Done fixing styles.scss');
