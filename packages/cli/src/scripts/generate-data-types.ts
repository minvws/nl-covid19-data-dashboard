import fs from 'fs';
import { compile, JSONSchema } from 'json-schema-to-typescript';
import path from 'path';
import { fileURLToPath } from 'url';
import { schemaDirectory } from '../config';
import { createValidateFunction } from '../schema';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The directory where the resulting data.d.ts file will be saved
const outputDirectory = path.join(
  __dirname,
  '..', // src
  '..', // cli
  '..', // packages
  'common',
  'src',
  'types'
);

const bannerComment =
  "/**\n* This file was automatically generated by json-schema-to-typescript.\n* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,\n* and run 'yarn generate-typescript' to regenerate this file.\n*/\n\n";

const schemaContent = fs.readdirSync(schemaDirectory);
const schemaNames = schemaContent
  .filter((item) =>
    fs.lstatSync(path.join(schemaDirectory, item)).isDirectory()
  )
  .filter((name) => name !== 'locale');

const promisedOperations = schemaNames.map(generateTypeScriptFromSchema);

Promise.all(promisedOperations).then(writeDefinitionsToFile, (err) => {
  console.error(err.message);
  process.exit(1);
});

/**
 * Loads the given schema by name and generates typescript interfaces from it.
 *
 * @param schemaName the given schema name
 * @returns A Promise that will resolve to the generated typescript
 */
async function generateTypeScriptFromSchema(schemaName: string) {
  // Sets the current working directory (cwd) to the schema directory, in order
  // for the typescript generator to properly resolve external references
  const generateOptions = {
    cwd: path.join(schemaDirectory, schemaName),
    ignoreMinAndMaxItems: true,
    bannerComment: '',
  };

  const validate = await createValidateFunction(
    '__index.json',
    path.join(schemaDirectory, schemaName)
  );

  const typeDefinition = await compile(
    validate.schema as JSONSchema,
    schemaName,
    generateOptions
  );

  console.info(`Generated typescript definitions for schema '${schemaName}'`);

  return typeDefinition;
}

function writeDefinitionsToFile(typeDefinitions: string[]) {
  const outputFile = path.join(outputDirectory, 'data.ts');

  fs.writeFileSync(
    outputFile,
    `${bannerComment}${typeDefinitions.join('\n')}`,
    {
      encoding: 'utf8',
    }
  );

  console.info(`Written typescript definitions output to file '${outputFile}'`);
}
