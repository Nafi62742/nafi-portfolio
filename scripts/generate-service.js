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
    console.error('Error: Please provide a service name.');
    process.exit(1);
  }

  const kebabName = name.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/\.service$/, '');
  const pascalName = toPascalCase(kebabName);
  const targetFile = path.resolve(__dirname, '../src/app/services', `${kebabName}.service.ts`);

  if (fs.existsSync(targetFile)) {
    console.error(`Error: Service already exists at ${targetFile}`);
    process.exit(1);
  }

  const tsContent = `import { Injectable } from '@angular/core';

/**
 * Service responsible for ${pascalName} management.
 */
@Injectable({
  providedIn: 'root'
})
export class ${pascalName}Service {
}
`;

  fs.writeFileSync(targetFile, tsContent);

  console.log(`Successfully generated ${pascalName}Service in src/app/services/${kebabName}.service.ts`);
}

const nameArg = process.argv[2];
if (nameArg) {
  generate(nameArg);
} else {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter service name (kebab-case, e.g., tracking): ', (answer) => {
    generate(answer);
    rl.close();
  });
}
