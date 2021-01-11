import fs from 'fs';
import path from 'path';
import { compile, JSONSchema } from 'json-schema-to-typescript';
import { createValidateFunction } from './validator/create-validate-function';
import { schemaDirectory } from './validator/config';

// The directory where the resulting data.d.ts file will be saved
const outputPath = path.join(
  __dirname,
  '..', // tools
  '..', // packages
  'app',
  'src',
  'types'
);

const bannerComment =
  "/* tslint:disable */\n/**\n* This file was automatically generated by json-schema-to-typescript.\n* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,\n* and run 'yarn generate-typescript' to regenerate this file.\n*/\n\n";

const schemaContent = fs.readdirSync(schemaDirectory);
const schemaNames = schemaContent.filter((item) =>
  fs.lstatSync(path.join(schemaDirectory, item)).isDirectory()
);

const promises = schemaNames.map(generateTypeScriptFromSchema);

Promise.all(promises).then((result) => {
  saveDefinitionsFile(result.join('\n'));
});

/**
 * Loads the given schema by name and generates typescript interfaces from it.
 *
 * @param schemaName the given schema name
 * @returns A Promise that will resolve to the generated typescript
 */
function generateTypeScriptFromSchema(schemaName: string) {
  // Sets the current working directory (cwd) to the schema directory, in order
  // for the typescript generator to properly resolve external references
  const generateOptions = {
    cwd: path.join(schemaDirectory, schemaName),
    ignoreMinAndMaxItems: true,
    bannerComment: '',
  };

  return createValidateFunction(
    path.join(schemaDirectory, schemaName, `__index.json`)
  ).then((validate) => {
    return compile(
      validate.schema as JSONSchema,
      schemaName,
      generateOptions
    ).then((typeDefinitions) => {
      console.info(
        `Generated typescript definitions for schema '${schemaName}'`
      );
      return typeDefinitions;
    });
  });
}

function saveDefinitionsFile(typeDefinitions: string) {
  const outputFile = path.join(outputPath, 'data.d.ts');
  fs.writeFileSync(outputFile, `${bannerComment}${typeDefinitions}`, {
    encoding: 'utf8',
  });
  console.info(`Written typescript definitions output to file '${outputFile}'`);
}
