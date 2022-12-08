import { colors } from '@corona-dashboard/common';
import { Down, Dot, Up, ArrowWithIntensity } from '@corona-dashboard/icons';
import styled from 'styled-components';
import { useIntl } from '~/intl';
import { space } from '~/style/theme';

export enum TrendDirection {
  UP,
  DOWN,
  NEUTRAL,
}

interface TrendIconProps {
  trendDirection: TrendDirection;
  intensity?: number | null;
  color?: string | null;
  ariaLabel?: string;
}

export const TrendIcon = ({ trendDirection, ariaLabel, intensity = null, color = null }: TrendIconProps) => {
  const { commonTexts } = useIntl();

  const trendLabels: { [key: string]: string } = {
    up: ariaLabel || commonTexts.accessibility.visual_context_labels.up_trend_label,
    down: ariaLabel || commonTexts.accessibility.visual_context_labels.down_trend_label,
    neutral: ariaLabel || commonTexts.accessibility.visual_context_labels.neutral_trend_label,
  };

  const ariaLabelText = trendLabels[TrendDirection[trendDirection].toLowerCase()];

  // Icon with intensity is used only on the homepage at the moment, for all other trend icons the default (below) are used.
  if (intensity && color && TrendDirection[trendDirection]) {
    return <TrendIconWithIntensity color={color} direction={trendDirection} intensity={intensity} />;
  }

  switch (trendDirection) {
    case TrendDirection.UP:
      return <Up aria-label={ariaLabelText} />;
    case TrendDirection.DOWN:
      return <Down aria-label={ariaLabelText} />;
    case TrendDirection.NEUTRAL:
      return <Dot aria-label={ariaLabelText} />;
    default: {
      const exhaustiveCheck: never = trendDirection;
      throw new Error(`Unhandled TrendDirection case: ${exhaustiveCheck}`);
    }
  }
};

const intensitySelectors: { [key: number]: { fill: string; stroke?: string } } = {
  1: {
    fill: '.one-arrow',
    stroke: '.two-stroke, .three-stroke',
  },
  2: {
    fill: '.one-arrow, .two-arrows',
    stroke: '.three-stroke',
  },
  3: {
    fill: '.one-arrow, .two-arrows, .three-arrows',
  },
};

interface TrendIconWithIntensityProps {
  color: string;
  direction: TrendDirection;
  intensity: number;
}

const TrendIconWithIntensity = styled(ArrowWithIntensity)<TrendIconWithIntensityProps>`
  flex-shrink: 0;
  margin-left: ${space[2]};
  transform: ${({ direction }) => (direction === TrendDirection.DOWN ? 'scaleY(-1)' : undefined)};

  ${({ intensity, color }): string =>
    `${intensitySelectors[intensity].fill} {
      fill: ${color};
    }
    ${intensitySelectors[intensity].stroke} {
      stroke: ${colors.gray7};
    }`}
`;
