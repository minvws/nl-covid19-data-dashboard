import {
  ChoroplethLegenda,
  ILegendaItem,
} from '~/components/choropleth/legenda/ChoroplethLegenda';
import { useBreakpoints } from '~/utils/useBreakpoints';
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
  description?: string | React.ReactNode;
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
  const breakpoints = useBreakpoints();
  const legendComponent = legend && (
    <ChoroplethLegenda items={legend.items} title={legend.title} />
  );

  return (
    <Tile mb={4} ml={{ _: -4, sm: 0 }} mr={{ _: -4, sm: 0 }}>
      <Box display="flex" flexDirection={{ _: 'column', lg: 'row' }}>
        <Box flex={{ lg: 1 }}>
          <div>
            <Box mb={[0, 2]}>
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
            {legendComponent && breakpoints.lg && (
              <Box display="flex" flexDirection="row" alignItems="flex-center">
                {legendComponent}
              </Box>
            )}
          </div>
        </Box>
        <Box flex={{ lg: 1 }}>
          <div>{children}</div>

          {legendComponent && !breakpoints.lg && (
            <Box display="flex" justifyContent="center">
              {legendComponent}
            </Box>
          )}
        </Box>
      </Box>
    </Tile>
  );
}
