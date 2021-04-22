import { unflatten } from 'flat';
import fs from 'fs';
import get from 'lodash/get';
import path from 'path';
import { Node, Project, PropertyAssignment, SyntaxKind } from 'ts-morph';

// These keys aren't directly referenced in the code base, so we add them manually here
const whitelist = [
  'choropleth.tested_overall',
  'choropleth.escalation_levels',
  'choropleth.hospital_nice',
  'choropleth.nursing_home',
  'choropleth.disability_care',
  'choropleth.elderly_at_home',
  'choropleth.sewer',
  'choropleth.behavior',
];

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

const newLocaleObjects = propertyAssignmentNodes
  ?.map((x) => createFullPropertyChain(x))
  .concat(whitelist)
  .filter(
    (x, _i, l) =>
      l.findIndex((y) => y.startsWith(`${x}.`) && y.length > x.length + 1) ===
      -1
  )
  .sort()
  .reduce(
    (aggr, chain) => {
      const NlValue = get(NlOriginal, chain);
      const EnValue = get(EnOriginal, chain);
      if (NlValue !== undefined) {
        aggr.nl[chain] = NlValue;
        aggr.en[chain] = EnValue;
      }
      return aggr;
    },
    { nl: {}, en: {} } as any
  );

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

function createFullPropertyChain(assignment: PropertyAssignment) {
  const result = [assignment.getName()];
  let node: Node | undefined = assignment.getParent();

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
