import { generateTypes } from './logic';

(async function main() {
  await generateTypes();
})().catch((err) => console.error(err));
