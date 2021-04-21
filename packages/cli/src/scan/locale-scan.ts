import path from 'path';
import { Project } from 'ts-morph';

const project = new Project({});

// add source files
project.addSourceFilesAtPaths(path.join(__dirname, '../../../app/src/**/*.ts'));

const sourceFile = project.getSourceFile('intl-context.ts');

const func = sourceFile?.getVariableDeclaration('IntlContext');

console.dir(func?.getInitializer());

/*const declarations = sourceFile?.getVariableDeclarations();

declarations?.[0].forEachChild((x) => console.log(x.print()));

const reference = declarations?.[0].findReferencesAsNodes();

//console.dir(reference?.[0]);*/
