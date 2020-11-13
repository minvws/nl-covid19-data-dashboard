import {
  ChoroplethLegenda,
  LegendaItem,
} from '~/components-styled/choropleth-legenda';
import { useBreakpoints } from '~/utils/useBreakpoints';
import { Box } from './base';
import {
  ChartRegionControls,
  RegionControlOption,
} from './chart-region-controls';
import { Tile } from './layout';
import { Heading, Text } from './typography';
import { Metadata, MetadataProps } from './metadata';

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
  description?: string | React.ReactNode;
  onChangeControls?: (v: RegionControlOption) => void;
  children: React.ReactNode;
  legend?: {
    title: string;
    items: LegendaItem[];
  };
  metadata?: MetadataProps;
}

export function ChoroplethTile<T>({
  title,
  description,
  onChangeControls,
  legend,
  children,
  metadata,
}: ChoroplethTileProps) {
  const breakpoints = useBreakpoints();
  const legendaComponent = legend && (
    <ChoroplethLegenda items={legend.items} title={legend.title} />
  );

  return (
    <Tile mb={4} ml={{ _: -4, sm: 0 }} mr={{ _: -4, sm: 0 }}>
      <Box display="flex" flexDirection={{ _: 'column', lg: 'row' }}>
        <Box mb={3} flex={{ lg: 1 }} mr={[0, 0, 3]}>
          <Box mb={[0, 4]}>
            <Heading level={3}>{title}</Heading>
            {typeof description === 'string' ? (
              <Text>{description}</Text>
            ) : (
              description
            )}
            {onChangeControls && (
              <Box display="flex" justifyContent="flex-start">
                <ChartRegionControls onChange={onChangeControls} />
              </Box>
            )}
          </Box>
          {legendaComponent && breakpoints.lg && (
            <Box display="flex" flexDirection="row" alignItems="flex-center">
              {legendaComponent}
            </Box>
          )}
        </Box>

        <Box flex={{ lg: 1 }} ml={[0, 0, 3]}>
          <div>{children}</div>

          {legendaComponent && !breakpoints.lg && (
            <Box display="flex" justifyContent="center">
              {legendaComponent}
            </Box>
          )}
        </Box>
      </Box>
      {metadata && <Metadata {...metadata} />}
    </Tile>
  );
}
