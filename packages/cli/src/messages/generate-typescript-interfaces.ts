const FileSet = require('file-set');
import fs from 'fs';
import path from 'path';

interface RawMessage {
  type: 'String' | 'Block';
  capture: string;
}

const appBasePath = path.join(
  __dirname,
  '..',
  '..', // cli
  '..', // packages
  'app'
);

const interfaceDir = path.join(appBasePath, 'src', 'messages');

const typescriptFiles = new FileSet(
  path.join(appBasePath, 'src', 'pages', '**', '*.tsx')
);

processFiles();

function processFiles() {
  const rawBuckerts = typescriptFiles.files.map(processFile);
  const buckets: Record<string, RawMessage[]> = {};

  rawBuckerts.filter(Boolean).forEach((rawBucket: any) => {
    if (buckets[rawBucket.bucket]) {
      buckets[rawBucket.bucket].push(...rawBucket.messages);
      return;
    }
    buckets[rawBucket.bucket] = rawBucket.messages;
  });

  Object.keys(buckets).forEach((bucketName) => {
    writeFileForBucket(bucketName, buckets[bucketName]);
  });
}

function processFile(filePath: string) {
  const contents = fs.readFileSync(filePath, {
    encoding: 'utf8',
  });

  const bucket = contents.match(/createGetMessages\(\['([^\]]+)'\]\)/)?.[1];

  if (!bucket) {
    return false;
  }

  const PATTERN = /message(String|Block)\(([^)]+)/g;
  const matches = [...contents.matchAll(PATTERN)];
  const messages: RawMessage[] = matches.map((m) => ({
    type: m[1] as 'String' | 'Block',
    capture: m[2],
  }));

  return {
    bucket,
    messages,
  };
}

function writeFileForBucket(name: string, messages: RawMessage[]) {
  const uniqueMessages = messages.filter(
    (x, i) => messages.findIndex((y) => x.capture === y.capture) === i
  );

  const banner = `/* Auto generated! */
type MessageString = string;
type MessageBlock = any[];`;

  // de-dupe
  const formattedName = name[0].toUpperCase() + name.substr(1);
  const interfaces = formatInterfaces(formattedName, uniqueMessages);
  const stringKeys = formatStringKeys(formattedName, uniqueMessages);
  const blockKeys = formatBlockKeys(formattedName, uniqueMessages);

  const contents = [banner, interfaces, stringKeys, blockKeys].join('\n\n\n');

  const outputFile = path.join(interfaceDir, `${name}.type.ts`);

  fs.writeFileSync(outputFile, contents, {
    encoding: 'utf8',
  });
  console.log(`Written: ${name}.type.ts`);
}

function formatInterfaces(name: string, messages: RawMessage[]) {
  const lines = messages.map((m) => {
    return `${m.capture}: Message${m.type};`;
  });
  return [`export interface ${name} {`, ...lines, `}`].join('\n');
}

function formatStringKeys(name: string, messages: RawMessage[]) {
  const keys = messages
    .filter((x) => x.type === 'String')
    .map((x) => x.capture);
  return [`export const ${name}StringKeys = [`, keys.join(',\n'), `]`].join(
    '\n'
  );
}
function formatBlockKeys(name: string, messages: RawMessage[]) {
  const keys = messages.filter((x) => x.type === 'Block').map((x) => x.capture);
  return [`export const ${name}BlockKeys = [`, keys.join(',\n'), `]`].join(
    '\n'
  );
}
