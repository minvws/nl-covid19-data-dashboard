import { Box } from '~/components/base';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { TooltipSubject } from '~/components/choropleth/tooltips';
import { InlineText } from '~/components/typography';
import { Flag } from '~/domain/international/flag';
import { useIntl } from '~/intl';
import { TooltipContent } from './tooltip-content';

type InPositiveTestedPeopleTooltipProps = {
  title: string;
  countryName: string;
  countryCode: string;
  value: number;
  comparedName: string;
  comparedCode: string;
  comparedValue: number;
};

export function InPositiveTestedPeopleTooltip(
  props: InPositiveTestedPeopleTooltipProps
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

  const thresholdValues = thresholds.in.infected_per_100k_average;

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
      <Box fontWeight={bold ? 'bold' : undefined} spacingHorizontal={2}>
        <Flag countryCode={code} />
        <InlineText>{name}</InlineText>
      </Box>
      <Box ml="auto">
        <InlineText fontWeight={bold ? 'bold' : undefined}>{value}</InlineText>
      </Box>
    </Box>
  );
}
