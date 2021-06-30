import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { internationalThresholds } from '../../international-thresholds';
import { TooltipSubject } from '../tooltip-subject';
import { TooltipContent } from './tooltip-content';

type InternationalTooltipProps = {
  title: string;
  countryName: string;
  value: number;
  comparedName: string;
  comparedValue: number;
};

export function InternationalTooltip(props: InternationalTooltipProps) {
  const { countryName, value, comparedName, comparedValue, title } = props;
  const { formatPercentage } = useIntl();

  const thresholdValues = internationalThresholds.infected_per_100k_average;

  const showComparison = countryName !== comparedName;

  return (
    <TooltipContent title={title}>
      <>
        <TooltipSubject thresholdValues={thresholdValues} filterBelow={value}>
          <SubjectText
            name={countryName}
            value={formatPercentage(value)}
            bold
          />
        </TooltipSubject>
        {showComparison && (
          <TooltipSubject
            thresholdValues={thresholdValues}
            filterBelow={comparedValue}
          >
            <SubjectText
              name={comparedName}
              value={formatPercentage(comparedValue)}
            />
          </TooltipSubject>
        )}
      </>
    </TooltipContent>
  );
}

function SubjectText({
  name,
  value,
  bold,
}: {
  name: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <Box display="flex" width="100%">
      <Box fontWeight={bold ? 'bold' : undefined}>
        <InlineText>{name}</InlineText>
      </Box>
      <Box ml="auto">
        <InlineText fontWeight={bold ? 'bold' : undefined}>{value}</InlineText>
      </Box>
    </Box>
  );
}
