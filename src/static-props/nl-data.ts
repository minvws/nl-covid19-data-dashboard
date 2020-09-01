import fs from 'fs';
import path from 'path';

import { NationalLayoutProps } from 'components/layout/NationalLayout';

interface IProps {
  props: NationalLayoutProps;
}

export default function getNlData(): IProps {
  const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');

  return {
    props: {
      data: JSON.parse(fileContents),
    },
  };
}
