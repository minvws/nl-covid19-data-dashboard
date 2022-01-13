import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { SiteText } from '~/locale';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
interface AgeGroupProps {
  range: string;
  ageGroupTotal?: number;
  birthyear_range: string;
  text: SiteText['pages']['vaccinations']['nl']['vaccination_coverage']['templates'];
}

export function AgeGroup({
  range,
  ageGroupTotal,
  birthyear_range,
  text,
}: AgeGroupProps) {
  const { formatNumber } = useIntl();

  const totalText = replaceVariablesInText(text.agegroup.total_people, {
    total: formatNumber(ageGroupTotal),
  });

  return (
    <Box display="flex" flexDirection="column">
      <InlineText fontWeight="bold">{range}</InlineText>
      <InlineText variant="label1">
        {`${birthyear_range}${ageGroupTotal ? `: ${totalText}` : ''}`}
      </InlineText>
    </Box>
  );
}
