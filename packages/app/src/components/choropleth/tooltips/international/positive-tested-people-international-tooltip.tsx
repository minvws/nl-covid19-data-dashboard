import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { internationalThresholds } from '../../international-thresholds';
import { TooltipSubject } from '../tooltip-subject';
import { TooltipContent } from './tooltip-content';

type InternationalTooltipProps = {
  title: string;
  countryName: string;
  countryCode: string;
  value: number;
  comparedName: string;
  comparedCode: string;
  comparedValue: number;
};

export function PositiveTestedPeopleInternationalTooltip(
  props: InternationalTooltipProps
) {
  const {
    countryName,
    value,
    comparedName,
    comparedValue,
    comparedCode,
    title,
    countryCode,
  } = props;
  const { formatPercentage } = useIntl();

  const thresholdValues = internationalThresholds.infected_per_100k_average;

  const showComparison = countryName !== comparedName;

  return (
    <TooltipContent title={title}>
      <TooltipSubject thresholdValues={thresholdValues} filterBelow={value}>
        <SubjectText
          code={countryCode}
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
            code={comparedCode}
            name={comparedName}
            value={formatPercentage(comparedValue)}
          />
        </TooltipSubject>
      )}
    </TooltipContent>
  );
}

function SubjectText({
  code,
  name,
  value,
  bold,
}: {
  code: string;
  name: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <Box display="flex" width="100%">
      <Box fontWeight={bold ? 'bold' : undefined}>
        <img
          aria-hidden
          src={`/icons/flags/${code.toLowerCase()}.svg`}
          width="17"
          height="13"
        />
        <InlineText pl={1}>{name}</InlineText>
      </Box>
      <Box ml="auto">
        <InlineText fontWeight={bold ? 'bold' : undefined}>{value}</InlineText>
      </Box>
    </Box>
  );
}
