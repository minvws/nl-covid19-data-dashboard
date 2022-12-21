import { DifferenceDecimal, DifferenceInteger } from '@corona-dashboard/common';
import hash from 'hash-sum';
import { isDefined } from 'ts-is-present';
import { BarScale } from '~/components/bar-scale';
import { BarScaleConfig } from '~/metric-config/common';
import { space } from '~/style/theme';
import { Box } from './base';
import { TileAverageDifference, TileDifference } from './difference-indicator';

interface PageBarScaleBaseProps {
  value: number;
  config: BarScaleConfig;
  screenReaderText: string;
  isMovingAverageDifference?: boolean;
  showOldDateUnix?: boolean;
}

type DifferenceProps =
  | {
      difference?: never;
      isAmount?: boolean;
    }
  | {
      difference: DifferenceInteger | DifferenceDecimal;
      isAmount: boolean;
    };

type PageBarScaleProps = PageBarScaleBaseProps & DifferenceProps;

export function PageBarScale(props: PageBarScaleProps) {
  const { value, config, screenReaderText, difference, isMovingAverageDifference, showOldDateUnix, isAmount } = props;
  /**
   * A unique id is required for path rendering and should be constant between
   * server and client side rendering
   */
  const uniqueId = hash(props);

  return (
    <Box spacing={2} marginBottom={space[3]}>
      <BarScale
        min={config.min}
        max={config.max}
        limit={config.limit}
        screenReaderText={screenReaderText}
        value={value}
        id={uniqueId}
        gradient={config.gradient}
        showValue
        showAxis
      />

      {isDefined(difference) &&
        isDefined(isAmount) &&
        (isMovingAverageDifference ? (
          <TileAverageDifference value={difference} isAmount={isAmount} />
        ) : (
          <TileDifference value={difference} showOldDateUnix={showOldDateUnix} isAmount={isAmount} />
        ))}
    </Box>
  );
}
