import path from 'path';
import { Project, SyntaxKind } from 'ts-morph';

const project = new Project({});

// add source files
// ../../../app/src/**/*{.ts,.tsx,.json}
const paz = path.join(__dirname, 'test.ts');
project.addSourceFilesAtPaths(paz);

project.getSourceFiles().forEach((source) => {
  const identifiers = source?.getDescendantsOfKind(
    SyntaxKind.PropertyAccessExpression
  );
  //.filter((x) => x.getText().startsWith('siteText'));

  if (identifiers.length) {
    identifiers.forEach((x) => {
      const refs = x.findReferences();
      console.log(refs.length);
    });
    console.log(`source: ${source.getFilePath()}`);
    console.dir(identifiers?.map((x) => x.getType().getText()));
    console.dir(identifiers?.map((x) => x.getText()));
  }
});
