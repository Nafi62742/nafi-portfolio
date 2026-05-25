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
    console.error('Error: Please provide a page name.');
    process.exit(1);
  }

  const kebabName = name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  const pascalName = toPascalCase(kebabName);
  const targetDir = path.resolve(__dirname, '../src/app/pages', kebabName);

  if (fs.existsSync(targetDir)) {
    console.error(`Error: Directory already exists at ${targetDir}`);
    process.exit(1);
  }

  fs.mkdirSync(targetDir, { recursive: true });

  const tsContent = `import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { TranslateService } from '@services/translate.service';

/**
 * ${pascalName} page/section component.
 */
@Component({
  selector: 'app-${kebabName}',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './${kebabName}.html',
  styleUrl: './${kebabName}.scss'
})
export class ${pascalName}Component implements OnInit {
  /**
   * @param t - Translation service for i18n labels
   */
  constructor(
    public readonly t: TranslateService
  ) {}

  /**
   * Angular lifecycle hook.
   */
  public ngOnInit(): void {
    // Initialization logic
  }
}
`;

  const htmlContent = `<section class="${kebabName}-section" id="${kebabName}">
  <div class="max-w-[1200px] mx-auto px-6 lg:px-8 py-16">
    <h2 class="text-3xl font-bold text-text-primary mb-4">${pascalName} Works</h2>
    <p class="text-text-secondary">Welcome to the ${pascalName} page.</p>
  </div>
</section>
`;

  const scssContent = `/* ${pascalName} Styles */
.${kebabName}-section {
  position: relative;
}
`;

  fs.writeFileSync(path.join(targetDir, `${kebabName}.ts`), tsContent);
  fs.writeFileSync(path.join(targetDir, `${kebabName}.html`), htmlContent);
  fs.writeFileSync(path.join(targetDir, `${kebabName}.scss`), scssContent);

  console.log(`Successfully generated ${pascalName}Component in src/app/pages/${kebabName}`);
}

const nameArg = process.argv[2];
if (nameArg) {
  generate(nameArg);
} else {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter page/section name (kebab-case, e.g., contact-form): ', (answer) => {
    generate(answer);
    rl.close();
  });
}
