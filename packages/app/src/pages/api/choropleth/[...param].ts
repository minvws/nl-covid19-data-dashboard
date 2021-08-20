import Konva from 'konva-node';
import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils';
import { dataUrltoBlob } from '~/utils/api/data-url-to-blob';
import { hash } from '~/utils/api/hash';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { param } = req.query;

  const stage = new Konva.Stage({
    container: 'div',
    width: 500,
    height: 500,
  });

  const dataUrl = stage.toDataURL();
  const blob = dataUrltoBlob(dataUrl);
  const eTag = hash(dataUrl);

  send(res, blob, eTag);
}

function send(res: NextApiResponse, blob: Buffer, eTag: string) {
  res.setHeader('Cache-Control', 'public, no-cache');
  res.setHeader('ETag', eTag);
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Vary', 'Accept-Encoding');

  res.status(200);
  res.end(blob);
}
