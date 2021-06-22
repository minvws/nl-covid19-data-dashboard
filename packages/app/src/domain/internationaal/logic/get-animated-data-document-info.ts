import fs from 'fs';
import path from 'path';

export function getAnimatedDataDocumentInfo(directory: string) {
  const filePath = path.join(process.cwd(), 'public', directory);

  const fileList = fs
    .readdirSync(filePath, { withFileTypes: true })
    .filter((dirEnt) => dirEnt.isFile() && dirEnt.name.endsWith('.json'))
    .sort(({ name: a }, { name: b }) => {
      const left = +a.slice(0, a.length - 5);
      const right = +b.slice(0, b.length - 5);
      return left - right;
    });

  return {
    documentCount: fileList.length,
    firstDocument: +fileList[0].name.slice(0, fileList[0].name.length - 5),
  };
}
