import path from 'path';
import { Identifier, Node, Project, SyntaxKind } from 'ts-morph';

const project = new Project({});

// add source files

project.addSourceFilesAtPaths(path.join(__dirname, 'test.ts'));

project.getSourceFiles().forEach((source, index) => {
  const identifier = source
    ?.getDescendantsOfKind(SyntaxKind.Identifier)
    .filter((x) => {
      return x.getText() === 'siteText' || hasAncestor(x);
    })
    .filter((x) => x.getParent().getKindName() === 'PropertyAccessExpression');

  if (identifier.length) {
    console.log(`source: ${source.getBaseName()}`);
    console.dir(identifier?.map((x) => formatFull(x)));
  }
});

function formatFull(identifier: Identifier) {
  let current: Node | undefined = identifier.getParent();
  while (current && current.getKindName() === 'Identifier') {
    current = current.getParent();
  }
  return current?.getText();
}

function hasAncestor(identifier: Identifier) {
  let current: Node | undefined = identifier.getParent();
  while (current && current.getKindName() === 'Identifier') {
    current = current.getParent();
  }
  return current?.getText() === 'siteText';
}
