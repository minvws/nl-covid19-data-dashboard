import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
interface AgeGroupProps {
  range: string;
  ageGroupTotal?: number;
  birthyear_range: string;
}

export function AgeGroup({
  range,
  ageGroupTotal,
  birthyear_range,
}: AgeGroupProps) {
  const { siteText, formatNumber } = useIntl();
  const { templates } = siteText.vaccinaties.vaccination_coverage;

  const totalText = replaceVariablesInText(templates.agegroup.total_people, {
    total: formatNumber(ageGroupTotal),
  });

  return (
    <Box display="flex" flexDirection="column">
      <InlineText fontWeight="bold">{range}</InlineText>
      <InlineText variant="label1">
        {`${birthyear_range}${totalText ? `: ${totalText}` : ''}`}
      </InlineText>
    </Box>
  );
}
