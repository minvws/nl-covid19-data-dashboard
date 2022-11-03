import { useIntl } from '~/intl';
import { Down, Dot, Up } from '@corona-dashboard/icons';

export enum TrendDirection {
  UP,
  DOWN,
  NEUTRAL,
}
interface TrendIconProps {
  trendDirection: TrendDirection;
  ariaLabel?: string;
}

export const TrendIcon = ({ trendDirection, ariaLabel }: TrendIconProps) => {
  const { commonTexts } = useIntl();

  const TrendLabelUp = ariaLabel || commonTexts.accessibility.visual_context_labels.up_trend_label;
  const TrendLabelDown = ariaLabel || commonTexts.accessibility.visual_context_labels.down_trend_label;
  const TrendLabelNeutral = ariaLabel || commonTexts.accessibility.visual_context_labels.neutral_trend_label;

  switch (trendDirection) {
    case TrendDirection.UP:
      return <Up aria-label={TrendLabelUp} />;
    case TrendDirection.DOWN:
      return <Down aria-label={TrendLabelDown} />;
    case TrendDirection.NEUTRAL:
      return <Dot aria-label={TrendLabelNeutral} />;
    default: {
      const exhaustiveCheck: never = trendDirection;
      throw new Error(`Unhandled TrendDirection case: ${exhaustiveCheck}`);
    }
  }
};
