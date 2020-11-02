import {
  ChoroplethLegenda,
  ILegendaItem,
} from '~/components/choropleth/legenda/ChoroplethLegenda';
import { Box } from './base';
import {
  ChartRegionControls,
  RegionControlOption,
} from './chart-region-controls';
import { Tile } from './layout';
import { Heading, Text } from './typography';

/**
 * We could use strong typing here for the values and also enforce the data
 * prop to be set. Might be a good idea.
 *
 * @TODO move to a shared location
 */
interface DataProps {
  'data-cy'?: string;
}

interface ChoroplethTileProps extends DataProps {
  title: string;
  description?: string;
  onChangeControls?: (v: RegionControlOption) => void;
  children: React.ReactNode;
  legend?: {
    title: string;
    items: ILegendaItem[];
  };
}

export function ChoroplethTile<T>({
  title,
  description,
  onChangeControls,
  legend,
  children,
}: ChoroplethTileProps) {
  return (
    <Tile
      mb={4}
      ml={{ _: -4, sm: 0 }}
      mr={{ _: -4, sm: 0 }}
      display={{ _: 'flex', lg: 'grid' }}
      gridTemplateColumns={'1fr 1fr'}
      gridTemplateRows={'auto auto 1fr auto'}
      gridTemplateAreas={`'w w' 'a c' 'b c' 'd c'`}
    >
      <Box gridArea="a" mb={[0, 2]}>
        <Heading level={3}>{title}</Heading>
        {description && <Text>{description}</Text>}
        {onChangeControls && (
          <Box display="flex" justifyContent="flex-start">
            <ChartRegionControls onChange={onChangeControls} />
          </Box>
        )}
      </Box>
      <Box gridArea="c">{children}</Box>
      {legend && (
        <Box
          gridArea="b"
          display="flex"
          flexDirection="column"
          alignItems={{ _: 'center', lg: 'flex-start' }}
        >
          <ChoroplethLegenda items={legend.items} title={legend.title} />
        </Box>
      )}
    </Tile>
  );
}
