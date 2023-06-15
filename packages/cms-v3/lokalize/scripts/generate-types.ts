import { generateTypesUtility } from '../utils/generate-types-utility';

(async () => {
  await generateTypesUtility();
})().catch((error) => console.error(error));
