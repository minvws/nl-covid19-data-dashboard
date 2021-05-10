import { unflatten } from 'flat';
import fs from 'fs';
import get from 'lodash/get';
import path from 'path';
import { isDefined } from 'ts-is-present';
import { Node, Project, PropertyAssignment, SyntaxKind } from 'ts-morph';

type LocaleData = string | Record<string, string>;
type LocaleFile = Record<string, LocaleData>;

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

const NlOriginal = JSON.parse(
  fs.readFileSync(path.join(APP_LOCALE_DIR, 'nl.json'), {
    encoding: 'utf-8',
  })
);
const EnOriginal = JSON.parse(
  fs.readFileSync(path.join(APP_LOCALE_DIR, 'en.json'), {
    encoding: 'utf-8',
  })
);

const sourceFile = project.getSourceFile('nl.json');

const propertyAssignmentNodes: PropertyAssignment[] = (
  sourceFile?.getDescendantsOfKind(SyntaxKind.PropertyAssignment) ??
  ([] as PropertyAssignment[])
)
  // each assignment always has at least one reference (the one in the file where its written),
  // so here we only want the ones that have more than one ref. (The ones who are referenced in some other file(s))
  .filter((x: PropertyAssignment) => x.findReferences().length > 1);

const newLocaleObjects = propertyAssignmentNodes
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
  .reduce(
    (aggr, propertyPath) => {
      const NlValue = get(NlOriginal, propertyPath);
      const EnValue = get(EnOriginal, propertyPath);
      if (isDefined(NlValue)) {
        aggr.nl[propertyPath] = NlValue;
        aggr.en[propertyPath] = EnValue;
      }
      return aggr;
    },
    { nl: {}, en: {} } as {
      nl: LocaleFile;
      en: LocaleFile;
    }
  );

const newJson: {
  nl: LocaleFile;
  en: LocaleFile;
} = unflatten(newLocaleObjects, {
  object: true,
});

fs.writeFileSync(
  path.join(APP_LOCALE_DIR, 'nl_stripped.json'),
  JSON.stringify(newJson.nl, null, 2),
  { encoding: 'utf-8' }
);

fs.writeFileSync(
  path.join(APP_LOCALE_DIR, 'en_stripped.json'),
  JSON.stringify(newJson.en, null, 2),
  { encoding: 'utf-8' }
);

/**
 * Takes a property assignment and walks up the parent tree to create a property chain.
 * I.e. myObject.property1.property2.property3
 */
function createFullPropertyChain(assignment: PropertyAssignment) {
  const result = [assignment.getName()];
  let node: Node | undefined = assignment.getParent();

  while (node) {
    if (node.getKind() === SyntaxKind.PropertyAssignment) {
      result.push((node as PropertyAssignment).getName());
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
