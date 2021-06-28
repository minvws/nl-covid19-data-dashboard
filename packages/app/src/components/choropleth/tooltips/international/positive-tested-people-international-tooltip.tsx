import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { internationalThresholds } from '../../international-thresholds';
import { TooltipContent } from '../tooltip-content';
import { TooltipSubject } from '../tooltip-subject';

type InternationalTooltipProps = {
  countryName: string;
  value: number;
};

export function InternationalTooltip(props: InternationalTooltipProps) {
  const { countryName, value } = props;
  const { siteText, formatPercentage, formatNumber } = useIntl();

  const subject = siteText.choropleth_tooltip.positive_tested_people;
  const thresholdValues = internationalThresholds.infected_per_100k;

  return (
    <TooltipContent title={countryName}>
      <TooltipSubject
        subject={subject}
        thresholdValues={thresholdValues}
        filterBelow={value}
      >
        <InlineText fontWeight="bold">
          {formatPercentage(value)} per {formatNumber(100_000)}{' '}
        </InlineText>
        {siteText.common.inwoners}
      </TooltipSubject>
    </TooltipContent>
  );
}
