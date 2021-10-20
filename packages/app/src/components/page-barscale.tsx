import { DifferenceDecimal, DifferenceInteger } from '@corona-dashboard/common';
import { isDefined } from 'ts-is-present';
import { BarScale } from '~/components/bar-scale';
import { BarScaleConfig } from '~/metric-config/common';
import { hash } from '~/utils/hash';
import { Box } from './base';
import { TileAverageDifference, TileDifference } from './difference-indicator';

/**
 * This component originated from SidebarBarScale, but is used on pages and
 * adds the ability to show the difference as well as things like signaalwaarde.
 *
 * I think we can come up with a better name, maybe later.
 */
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
  const {
    value,
    config,
    screenReaderText,
    difference,
    isMovingAverageDifference,
    showOldDateUnix,
    isAmount,
  } = props;
  /**
   * A unique id is required for path rendering and should be constant between
   * server and client side rendering
   */
  const uniqueId = hash(JSON.stringify(props)).slice(-10);

  return (
    <Box spacing={2} mb={3}>
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
          <TileDifference
            value={difference}
            showOldDateUnix={showOldDateUnix}
            isAmount={isAmount}
          />
        ))}
    </Box>
  );
}
