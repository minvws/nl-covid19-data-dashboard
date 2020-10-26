// Props type needs to be imported from lineChart directly because charts only works with
// default export.
import LineChart, { LineChartProps } from '~/components/lineChart';
import locale from '~/locale/index';
import { Spacer } from './base';
import { ExternalLink } from './external-link';
import { Tile } from './layout';
import { Text } from './typography';

interface LineChartTileProps extends LineChartProps {
  sourcedFrom?: {
    text: string;
    href: string;
  };
}

export function LineChartTile({
  sourcedFrom,
  ...chartProps
}: LineChartTileProps) {
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
      <LineChart {...chartProps} />

      {sourcedFrom && (
        <>
          {/* Using a spacer to push the footer down */}
          <Spacer m="auto" />
          <Text as="footer" mt={3}>
            {locale.common.metadata.source}: <ExternalLink {...sourcedFrom} />
          </Text>
        </>
      )}
    </Tile>
  );
}
