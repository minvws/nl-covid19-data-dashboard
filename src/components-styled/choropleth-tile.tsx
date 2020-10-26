import {
  ChloroplethLegenda,
  ILegendaItem,
} from '~/components/chloropleth/legenda/ChloroplethLegenda';
import { Box } from './base';
import {
  ChartRegionControls,
  RegionControlOptions,
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
  onChangeControls?: (v: RegionControlOptions) => void;
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
      ml={{ _: -4, md: 0 }}
      mr={{ _: -4, md: 0 }}
      display={{ _: 'flex', lg: 'grid' }}
      gridTemplateColumns={{ lg: '1fr 1fr' }}
      gridTemplateRows={{ lg: 'auto auto 1fr auto' }}
      gridTemplateAreas={{ lg: `'w w' 'a c' 'b c' 'd c'` }}
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
          <ChloroplethLegenda items={legend.items} title={legend.title} />
        </Box>
      )}
    </Tile>
  );
}
