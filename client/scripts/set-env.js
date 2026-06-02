const { writeFileSync } = require('fs');
const { resolve } = require('path');

const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api';

const content = `export const environment = {
  production: true,
  apiBaseUrl: '${apiBaseUrl}',
};
`;

const targetPath = resolve(__dirname, '../src/app/environments/environment.prod.ts');
writeFileSync(targetPath, content);
console.log(`environment.prod.ts generated with apiBaseUrl: ${apiBaseUrl}`);
