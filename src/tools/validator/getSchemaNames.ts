import path from 'path';
import fs from 'fs';

/**
 * The fully qualified path to the schema root directory
 */
export const schemaDirectory = path.join(__dirname, '..', '..', '..', 'schema');

/**
 * Retrieves a list of available schema names.
 * @returns {array} The list of schema names
 */
export function getSchemaNames(): string[] {
  const contents = fs.readdirSync(schemaDirectory);
  return contents.filter((item) =>
    fs.lstatSync(path.join(schemaDirectory, item)).isDirectory()
  );
}
