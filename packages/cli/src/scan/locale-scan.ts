import { unflatten } from 'flat';
import fs from 'fs';
import get from 'lodash/get';
import path from 'path';
import { Node, Project, PropertyAssignment, SyntaxKind } from 'ts-morph';

const project = new Project({
  tsConfigFilePath: path.join(__dirname, '../../../app/tsconfig.json'),
});

const NlOriginal = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../../app/src/locale/nl.json'), {
    encoding: 'utf-8',
  })
);
const EnOriginal = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../../app/src/locale/en.json'), {
    encoding: 'utf-8',
  })
);

const sourceFile = project.getSourceFile('nl.json');

const propertyAssignmentNodes: PropertyAssignment[] = (
  sourceFile?.getDescendantsOfKind(SyntaxKind.PropertyAssignment) ?? []
).filter((x) => x.findReferences().length > 1);

//const objectLiterals = sourceFile?.getDescendantsOfKind(SyntaxKind.ObjectLiteralExpression).map(x => x.)

const newLocaleObjects = propertyAssignmentNodes
  ?.map((x) => getFullPath(x))
  .filter(
    (x, _i, l) =>
      l.findIndex((y) => y.startsWith(x) && y.length > x.length) === -1
  )
  .sort()
  .reduce(
    (aggr, chain) => {
      console.log(chain);
      const NlValue = get(NlOriginal, chain);
      const EnValue = get(EnOriginal, chain);
      if (typeof NlValue === 'string') {
        aggr.nl[chain] = NlValue;
        aggr.en[chain] = EnValue;
      } else {
        aggr.rest.push(chain);
      }
      return aggr;
    },
    { nl: {}, en: {}, rest: [] } as any
  );

newLocaleObjects.rest.forEach((key: string) => {
  if (!newLocaleObjects.nl[key]) {
    newLocaleObjects.nl[key] = get(NlOriginal, key);
  }
  if (!newLocaleObjects.en[key]) {
    newLocaleObjects.en[key] = get(EnOriginal, key);
  }
});

delete newLocaleObjects.rest;

const newJson: any = unflatten(newLocaleObjects, { object: true });
fs.writeFileSync(
  path.join(__dirname, 'nl.json'),
  JSON.stringify(newJson.nl, null, 2),
  { encoding: 'utf-8' }
);
fs.writeFileSync(
  path.join(__dirname, 'en.json'),
  JSON.stringify(newJson.en, null, 2),
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
  const fullName = result
    .map((x) => x.substr(1, x.length - 2))
    .reverse()
    .join('.');

  return fullName;
}
