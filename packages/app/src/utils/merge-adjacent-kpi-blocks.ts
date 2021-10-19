import { RichContentBlock } from '~/types/cms';
/**
 * Due to technical limitations in Sanity it is impossible to add an array of
 * custom blocks (nested arrays are not allowed).
 *
 * This function detects adjacent kpiConfiguration blocks and creates a
 * special kpiConfigurations (note the 's' at the end there) block.
 */
export function mergeAdjacentKpiBlocks(blocks: RichContentBlock[]) {
  const result: RichContentBlock[] = [];
  for (let i = 0, ii = blocks.length; i < ii; i++) {
    let block = blocks[i];
    if (
      block._type === 'kpiConfiguration' &&
      blocks[i + 1]?._type === 'kpiConfiguration'
    ) {
      block = {
        _type: 'kpiConfigurations',
        configs: [block, blocks[i + 1]],
      } as any;
      i++;
    }
    result.push(block);
  }
  return result;
}
