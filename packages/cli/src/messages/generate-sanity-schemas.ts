import fs from 'fs';
import path from 'path';

// The directory where the resulting data.d.ts file will be saved
const outputDirectory = path.join(
  __dirname,
  '..', // messages
  '..', // cli
  '..', // packages
  'cms',
  'src',
  'schemas',
  'messages'
);

const appBasePath = path.join(
  __dirname,
  '..',
  '..', // cli
  '..', // packages
  'app'
);

interface RawMessage {
  type: 'String' | 'Block';
  name: string;
}

const appMessagesDirectory = path.join(appBasePath, 'src', 'messages');

const messageInterfaces = fs.readdirSync(appMessagesDirectory);

const promisedOperations = messageInterfaces.map((fileName) =>
  generateSchemaForInterface(appMessagesDirectory, fileName)
);

Promise.all(promisedOperations).then(writeDefinitionsToFile, (err) => {
  console.error(err.message);
  process.exit(1);
});

function generateSchemaForInterface(dir: string, fileName: string) {
  const contents = fs.readFileSync(path.join(dir, fileName), {
    encoding: 'utf8',
  });
  const PATTERN = /([a-zA-Z_]+|'[a-zA-Z0-9:_]+')(?::\sMessage(String|Block))/g;
  const matches = [...contents.matchAll(PATTERN)];
  const messages = matches.map((m) => ({
    type: m[2] as 'String' | 'Block',
    name: m[1],
  }));

  const schema = getSchemaCode(messages);

  const newFileName = fileName.split('.')[0] + '.ts';

  const outputFile = path.join(outputDirectory, newFileName);
  fs.writeFileSync(outputFile, schema, {
    encoding: 'utf8',
  });
  console.log(`Written: ${newFileName}`);
  return Promise.resolve(schema);
}

function writeDefinitionsToFile(a: any) {}

function getSchemaCode(messages: RawMessage[]) {
  const fieldsetNames = getFieldsetNames(messages);
  const fields = getSchemaFields(messages);
  const fieldsets = getSchemaFieldssets(fieldsetNames);

  return `
  /* AUTO GENERATED ; DO NOT EDIT MANUALLY*/
  const MESSAGES = {
    name: 'messages',
    type: 'object',
    fieldsets: [
      ${fieldsets.join(',')}
    ] ,
    fields: [

      ${fields.join(',')}
    ]
  }
  export default MESSAGES;
    `;
}

function getSchemaFields(messages: RawMessage[]) {
  return messages.map((m) => {
    return `        {
      fieldset: '${m.name
        .replace(/'/g, '')
        .split(':')[0]
        .replace(/[^a-zA-Z0-9_]/g, '_')}',
      name: '${m.name.replace(/'/g, '').replace(/[^a-zA-Z0-9_]/g, '_')}',
      type: 'locale${m.type}',
    }`;
  });
}
function getSchemaFieldssets(fieldsetNames: string[]) {
  return fieldsetNames.map((f) => {
    return `{
      title: '${f.replace(/[^a-zA-Z0-9_]/g, ' ')}',
      name: '${f.replace(/[^a-zA-Z0-9_]/g, '_')}',
      options: {
        collapsible: true,
        collapsed: true,
      },
    }`;
  });
}

function getFieldsetNames(messages: RawMessage[]) {
  return messages
    .map((m) => {
      return m.name.replace(/'/g, '').split(':')[0];
    })
    .filter((elm, i, arr) => {
      return arr.indexOf(elm) === i;
    });
}
