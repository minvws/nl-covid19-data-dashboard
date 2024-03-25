import { Bar } from '~/domain/vaccine/components/bar';
import { BoldText } from '~/components/typography';
import { Box } from '~/components/base';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { Metadata, MetadataProps } from '~/components';
import { parseBirthyearRange } from '~/domain/vaccine/logic/parse-birthyear-range';
import { replaceVariablesInText } from '~/utils';
import { space } from '~/style/theme';
import { TileData as KpiContentProps } from '../types';
import { useIntl } from '~/intl';

export const KpiContent = ({ title, description, value, bar, birthyear, differenceValue, isPercentage = false, dateOfInsertion, dateOrRange, source }: KpiContentProps) => {
  const { commonTexts } = useIntl();
  const parsedBirthyearRange = birthyear ? parseBirthyearRange(birthyear) : null;

  const metadata: MetadataProps = {
    timeframePeriod: dateOrRange,
    source: source,
    isTimeframePeriodKpi: true,
    dateOfInsertion: dateOfInsertion,
    isArchived: true,
  };

  return (
    <Box>
      <BoldText>{title}</BoldText>

      <Box paddingTop={space[3]} paddingBottom={differenceValue ? space[1] : space[3]}>
        <KpiValue absolute={!isPercentage ? value : null} percentage={isPercentage ? value : null} difference={differenceValue} isAmount={!!differenceValue} color={bar?.color} />
      </Box>

      {bar && (
        <Box paddingTop={space[2]} paddingBottom={space[3]}>
          <Bar value={bar.value} color={bar.color} height={12} />
        </Box>
      )}

      <Markdown
        content={
          parsedBirthyearRange
            ? replaceVariablesInText(description, {
                birthyear: replaceVariablesInText(commonTexts.common.birthyear_ranges[parsedBirthyearRange.type], parsedBirthyearRange),
              })
            : description
        }
      />
      {metadata && <Metadata {...metadata} isTileFooter marginBottom={space[2]} />}
    </Box>
  );
};
