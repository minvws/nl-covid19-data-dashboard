import path from 'path';
import { Node, Project, PropertyAccessExpression, SyntaxKind } from 'ts-morph';

const project = new Project({});

// add source files
const paz = path.join(__dirname, '../../../app/src/**/*{.ts,.tsx,.json}');
project.addSourceFilesAtPaths(paz);

project.getSourceFiles().forEach((source) => {
  const identifiers = source
    ?.getDescendantsOfKind(SyntaxKind.PropertyAccessExpression)
    .filter((x) => {
      return x.getChildrenOfKind(SyntaxKind.Identifier).length > 0;
    })
    .filter((x) => {
      return (
        x.getFirstChildByKind(SyntaxKind.Identifier)?.getText() === 'siteText'
      );
    });

  if (identifiers.length) {
    console.log(`source: ${source.getFilePath()}`);
    console.dir(identifiers?.map((x) => getFullText(x)));
  }
});

function getFullText(x: PropertyAccessExpression) {
  let parent: Node | undefined = x;
  while (
    parent?.getParent()?.getKind() === SyntaxKind.PropertyAccessExpression
  ) {
    parent = parent?.getParent();
  }
  return parent?.getText();
}
