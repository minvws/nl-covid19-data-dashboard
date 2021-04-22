import { unflatten } from 'flat';
import fs from 'fs';
import get from 'lodash/get';
import path from 'path';
import { Node, Project, PropertyAssignment, SyntaxKind } from 'ts-morph';

const project = new Project({
  tsConfigFilePath: path.join(__dirname, '../../../app/tsconfig.json'),
});

const original = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../../app/src/locale/nl.json'), {
    encoding: 'utf-8',
  })
);

const sourceFile = project.getSourceFile('nl.json');

const propertyAssignmentNodes = sourceFile
  ?.getDescendantsOfKind(SyntaxKind.PropertyAssignment)
  .filter((x) => x.findReferences().length > 1);

const newObject = propertyAssignmentNodes
  ?.map((x) => getFullPath(x))
  .reduce((aggr, chain) => {
    console.log(chain);
    const value = get(original, chain);
    if (typeof value === 'string') {
      aggr[chain] = value;
    }
    return aggr;
  }, {} as any);

const newJson = unflatten(newObject, { object: true });
fs.writeFileSync(
  path.join(__dirname, 'output.json'),
  JSON.stringify(newJson, null, 2),
  { encoding: 'utf-8' }
);

function getFullPath(pa: PropertyAssignment) {
  const result = [pa.getName()];
  let node: Node | undefined = pa.getParent();
  while (node) {
    if (node.getKind() === SyntaxKind.PropertyAssignment) {
      result.push((node as PropertyAssignment).getName());
    }
    node = node?.getParent();
  }
  return result
    .map((x) => x.substr(1, x.length - 2))
    .reverse()
    .join('.');
}
