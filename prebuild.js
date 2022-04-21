const fs = require('fs');
const package = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

fs.writeFileSync(
  'src/environments/version-info.ts',
  `export const versionInfo = {
  version: '${package.version}',
  libVersion: '${package.dependencies["@jbouduin/holidays-lib"].replace('^', '')}'
}`);
