import prompts from 'prompts';
import sanityConfig from '../sanity.json';

export async function getConfig() {
  const dataset = await getDataset();
  const projectId = sanityConfig.api.projectId;

  return { dataset, projectId };
}

async function getDataset() {
  let sanityDataset = process.env.SANITY_DATASET;

  if (!sanityDataset) {
    sanityDataset = (
      await prompts([
        {
          type: 'select',
          name: 'dataset',
          message: 'Select dataset to export',
          choices: [
            { title: 'development', value: 'development' },
            { title: 'production', value: 'production' },
          ],
          initial: 0,
        },
      ])
    ).dataset;
  }

  if (!isValidDataset(sanityDataset)) {
    throw new Error(`Unknown dataset ${sanityDataset}`);
  }

  return sanityDataset;
}

function isValidDataset(dataset: unknown): dataset is 'development' | 'production' {
  return ['development', 'production'].includes(dataset as string);
}
