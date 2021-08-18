import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils';
import inTopology from './in.topo.json';
import nlTopology from './nl-vr-gm.topo.json';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { type } = req.query;

  switch (type) {
    case 'gm': {
      const result = {
        ...nlTopology,
        objects: {
          nl_features: {
            ...nlTopology.objects.nl_features,
          },
          gm_features: {
            ...nlTopology.objects.gm_features,
          },
        },
      };
      res.status(200).json(result);
    }
    case 'vr': {
      const result = {
        ...nlTopology,
        objects: {
          nl_features: {
            ...nlTopology.objects.nl_features,
          },
          vr_features: {
            ...nlTopology.objects.vr_features,
          },
        },
      };
      res.status(200).json(result);
    }
    case 'in': {
      res.status(200).json(inTopology);
    }
    default: {
      res.status(404);
    }
  }
}
