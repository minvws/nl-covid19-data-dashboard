import fs from 'fs';
import path from 'path';
import { jsonBasePath } from '../validator/base-paths';

const fixturePath = path.join(__dirname, '..', '..', 'pages-tests', 'fixtures');

const municipalCode = 'GM0363';
const vrcode = 'VR13';

const fixtures = [
  `${municipalCode}.json`,
  'MUNICIPALITIES.json',
  'RANGES.json',
  'NL.json',
  'REGIONS.json',
  `${vrcode}.json`,
];

fixtures.forEach(copyFixture);

function copyFixture(name: string) {
  fs.copyFileSync(path.join(jsonBasePath, name), path.join(fixturePath, name));
}
