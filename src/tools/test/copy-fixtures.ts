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

filterMunicipalities();
filterRegions();

function copyFixture(name: string) {
  fs.copyFileSync(path.join(jsonBasePath, name), path.join(fixturePath, name));
}

function filterMunicipalities() {
  const filename = path.join(fixturePath, 'MUNICIPALITIES.json');
  const content = fs.readFileSync(filename, { encoding: 'utf8' });
  const data = JSON.parse(content);

  for (const prop in data) {
    if (Array.isArray(data[prop])) {
      data[prop] = data[prop].filter(
        (item: any) => item.gmcode === municipalCode
      );
    }
  }

  fs.writeFileSync(filename, JSON.stringify(data, null, '\t'), {
    encoding: 'utf8',
  });
}

function filterRegions() {
  const filename = path.join(fixturePath, 'REGIONS.json');
  const content = fs.readFileSync(filename, { encoding: 'utf8' });
  const data = JSON.parse(content);

  for (const prop in data) {
    if (Array.isArray(data[prop])) {
      data[prop] = data[prop].filter((item: any) => item.vrcode === vrcode);
    }
  }

  fs.writeFileSync(filename, JSON.stringify(data, null, '\t'), {
    encoding: 'utf8',
  });
}
