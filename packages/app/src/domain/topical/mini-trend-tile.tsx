import { TimeframeOption, TimestampedValue } from '@corona-dashboard/common';
import css from '@styled-system/css';
import styled from 'styled-components';
import { ErrorBoundary } from '~/components/error-boundary';
import { MiniTrendChart } from '~/components/mini-trend-chart';
import { SeriesConfig } from '~/components/time-series-chart';
import { AccessibilityDefinition } from '~/utils/use-accessibility-annotations';
import { MiniTile, MiniTileProps } from './mini-tile';

type MiniTrendTileProps<T extends TimestampedValue = TimestampedValue> = {
  /**
   * The mandatory AccessibilityDefinition provides a reference to annotate the
   * graph with a label and description.
   */
  accessibility: AccessibilityDefinition;
  timeframe?: TimeframeOption;
  seriesConfig: SeriesConfig<T>;
  values: T[];
} & Omit<MiniTileProps, 'children'>;

export function MiniTrendTile<T extends TimestampedValue>(
  props: MiniTrendTileProps<T>
) {
  const {
    accessibility,
    timeframe = '5weeks',
    values,
    seriesConfig,
    ...tileProps
  } = props;

  return (
    <MiniTile {...tileProps}>
      <div>
        <ErrorBoundary>
          <MiniTrendChart
            accessibility={accessibility}
            timeframe={timeframe}
            title={tileProps.title}
            values={values}
            seriesConfig={seriesConfig}
          />
        </ErrorBoundary>
      </div>
    </MiniTile>
  );
}

const Icon = styled.span(
  css({
    svg: {
      height: '3rem',
      mr: 3,
      ml: '2px',
    },
  })
);

const WarningIconWrapper = styled.span(
  css({
    display: 'inline-flex',
    width: '1em',
    height: '1em',
    marginLeft: 2,
    backgroundColor: 'warningYellow',
    borderRadius: 1,
    alignItems: 'center',
    justifyContent: 'center',

    svg: {
      fill: 'black',
    },
  })
);
