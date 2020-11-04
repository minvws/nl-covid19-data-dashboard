// Props type needs to be imported from lineChart directly because charts only works with
// default export.
import {
  MultipleLineChart,
  MultipleLineChartProps,
} from '~/components/lineChart/multipleLineChart.tsx';
import { Spacer } from './base';
import { Tile } from './layout';
import { Metadata, MetadataProps } from './metadata';

interface MultipleLineChartTileProps extends MultipleLineChartProps {
  metadata: MetadataProps;
}

export function MultipleLineChartTile({
  metadata,
  ...chartProps
}: MultipleLineChartTileProps) {
  return (
    <Tile
      /**
       * The mb here could alternatively be applied using a <Spacer/> in the
       * page markup. It's a choice, whether we like to include the bottom
       * margin on all our commonly used components or keep everything flexible
       * and use spacers in the context where the component is used.
       */
      mb={4}
      /**
       * The ml and mr negative margins should not be part of this component
       * ideally, but are the results of the page layout having paddings even on
       * small screens. We can remove this once we make all page section
       * elements full-width and remove the padding from the page layout.
       */
      ml={{ _: -4, sm: 0 }}
      mr={{ _: -4, sm: 0 }}
    >
      <MultipleLineChart {...chartProps} />

      {/* Using a spacer to push the footer down */}
      <Spacer m="auto" />
      <Metadata {...metadata} />
    </Tile>
  );
}
