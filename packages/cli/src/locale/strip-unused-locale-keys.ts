import { appendTextMutation } from '@corona-dashboard/cms/src/lokalize/logic/mutations';
import { flatten, unflatten } from 'flat';
import fs from 'fs';
import { difference } from 'lodash';
import get from 'lodash/get';
import path from 'path';
import { isDefined } from 'ts-is-present';
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

const APP_LOCALE_DIR = path.join(__dirname, '../../../app/src/locale');

const project = new Project({
  tsConfigFilePath: path.join(__dirname, '../../../app/tsconfig.json'),
});

const texts = JSON.parse(
  fs.readFileSync(path.join(APP_LOCALE_DIR, 'nl_export.json'), {
    encoding: 'utf-8',
  })
);

const sourceFile = project.getSourceFile('nl_export.json');

const flatStrippedTexts = sourceFile
  ?.getDescendantsOfKind(SyntaxKind.PropertyAssignment)
  /**
   * each assignment always has at least one reference (the one in the file
   * where its written), so here we only want the ones that have more than one
   * ref. (The ones who are referenced in some other file(s))
   */
  .filter((x: PropertyAssignment) => x.findReferences().length > 1)
  .map((x) => createFullPropertyChain(x))
  .concat(whitelist)
  // Only keep the deepest paths:
  .filter(
    (subject, _i, list) =>
      list.findIndex(
        (y) => y.startsWith(`${subject}.`) && y.length > subject.length + 1
      ) === -1
  )
  .sort()
  .reduce<Record<string, unknown>>((aggr, propertyPath) => {
    const text = get(texts, propertyPath);
    if (isDefined(text)) {
      aggr[propertyPath] = text;
    }
    return aggr;
  }, {});

const newTexts = unflatten(flatStrippedTexts, { object: true });

const obsoleteKeys = difference(
  Object.keys(flatten(texts)),
  Object.keys(flatten(newTexts))
).sort();

for (const key of obsoleteKeys) {
  const text = texts[key];
  const isRootvalue = typeof text === 'string' || Array.isArray(text);

  appendTextMutation('delete', isRootvalue ? `__root.${key}` : key);
}

console.log(`Marked ${obsoleteKeys.length} documents for deletion`);

/**
 * Takes a property assignment and walks up the parent tree to create a property chain.
 * I.e. myObject.property1.property2.property3
 */
function createFullPropertyChain(assignment: PropertyAssignment) {
  const result = [assignment.getName()];
  let node: Node | undefined = assignment.getParent();

  while (node) {
    if (nodeIsPropertyAssignment(node)) {
      result.push(node.getName());
    }
    node = node?.getParent();
  }

  return (
    result
      //json properties are wrapped in quotes, so here we remove the first and last chars
      .map((x) => x.substr(1, x.length - 2))
      .reverse()
      .join('.')
  );
}

function nodeIsPropertyAssignment(node: Node): node is PropertyAssignment {
  return node.getKind() === SyntaxKind.PropertyAssignment;
}
