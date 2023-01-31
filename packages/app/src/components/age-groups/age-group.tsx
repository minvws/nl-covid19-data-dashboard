import { Box } from '~/components/base';
import { BoldText, InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { formatAgeGroupString } from '~/utils/format-age-group-string';
import { formatBirthyearRangeString } from '~/utils/format-birthyear-range-string';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

interface AgeGroupProps {
  birthYearRange: string;
  range: string;
  peopleInAgeGroup?: number;
}

export const AgeGroup = ({ range, peopleInAgeGroup, birthYearRange }: AgeGroupProps) => {
  const { commonTexts, formatNumber } = useIntl();
  const ageRange = formatAgeGroupString(range, commonTexts.common.agegroup);
  const yearOfBirthRange = formatBirthyearRangeString(birthYearRange, commonTexts.common.birthyears);

  const totalText = peopleInAgeGroup
    ? replaceVariablesInText(commonTexts.common.agegroup.total_people, {
        total: formatNumber(peopleInAgeGroup),
      })
    : '';

  return (
    <Box display="flex" flexDirection="column">
      <BoldText>{ageRange}</BoldText>
      <InlineText variant="label1">{`${yearOfBirthRange}: ${totalText}`}</InlineText>
    </Box>
  );
};
