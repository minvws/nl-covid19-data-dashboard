import path from 'path';
import { Identifier, Node, Project, SyntaxKind } from 'ts-morph';

const project = new Project({});

// add source files

project.addSourceFilesAtPaths(path.join(__dirname, 'test.ts'));

project.getSourceFiles().forEach((source, index) => {
  const identifiers = source
    ?.getDescendantsOfKind(SyntaxKind.Identifier)
    .filter((x) => {
      return x.getText() === 'siteText' || hasAncestor(x);
    })
    .filter((x) => x.getParent().getKindName() === 'PropertyAccessExpression');

  if (identifiers.length) {
    console.log(`source: ${source.getBaseName()}`);
    console.dir(identifiers);
    console.dir(identifiers?.map((x) => x.getFullText()));
  }
});

function formatFull(identifier: Identifier) {
  const result = [identifier.getText()];
  let current: Node | undefined = identifier.getParent();
  while (current?.getKindName() === 'Identifier') {
    current = current.getParent();
    if (current) {
      result.push(current.getText());
    }
  }
  return result.reverse().join('.');
}

function hasAncestor(identifier: Identifier) {
  let current: Node | undefined = identifier.getParent();
  while (current?.getKindName() === 'Identifier') {
    current = current.getParent();
  }
  const result = current?.getText() === 'siteText';
  console.log(result);
  return result;
}
