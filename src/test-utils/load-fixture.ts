import fs from 'fs';
import path from 'path';

const publicFolder = path.join(__dirname, '../../../public/json/');
const fixtureFolder = path.join(__dirname, '../../src/pages-tests/fixtures');

export function loadFixture<T>(name: string): T {
  let fixturePath = path.join(publicFolder, name);

  if (!fs.existsSync(fixturePath)) {
    fixturePath = path.join(fixtureFolder, name);
  }

  if (!fs.existsSync(fixturePath)) {
    throw Error(`Fixture not found: ${fixturePath}`);
  }

  const content = fs.readFileSync(fixturePath, { encoding: 'utf8' });

  return JSON.parse(content) as T;
}
