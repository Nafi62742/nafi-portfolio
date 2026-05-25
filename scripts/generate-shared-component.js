const fs = require('fs');
const path = require('path');
const readline = require('readline');

function toPascalCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

function generate(name) {
  if (!name) {
    console.error('Error: Please provide a component name.');
    process.exit(1);
  }

  const kebabName = name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  const pascalName = toPascalCase(kebabName);
  const targetDir = path.resolve(__dirname, '../src/app/shared-components', kebabName);

  if (fs.existsSync(targetDir)) {
    console.error(`Error: Directory already exists at ${targetDir}`);
    process.exit(1);
  }

  fs.mkdirSync(targetDir, { recursive: true });

  const tsContent = `import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

/**
 * ${pascalName} shared component.
 */
@Component({
  selector: 'app-${kebabName}',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './${kebabName}.html',
  styleUrl: './${kebabName}.scss'
})
export class ${pascalName}Component {
}
`;

  const htmlContent = `<div class="${kebabName}-root">
  <p>${pascalName} shared component works!</p>
</div>
`;

  const scssContent = `/* ${pascalName} Shared Component Styles */
.${kebabName}-root {
  display: block;
}
`;

  fs.writeFileSync(path.join(targetDir, `${kebabName}.ts`), tsContent);
  fs.writeFileSync(path.join(targetDir, `${kebabName}.html`), htmlContent);
  fs.writeFileSync(path.join(targetDir, `${kebabName}.scss`), scssContent);

  console.log(`Successfully generated ${pascalName}Component in src/app/shared-components/${kebabName}`);
}

const nameArg = process.argv[2];
if (nameArg) {
  generate(nameArg);
} else {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter shared component name (kebab-case, e.g., button-primary): ', (answer) => {
    generate(answer);
    rl.close();
  });
}
