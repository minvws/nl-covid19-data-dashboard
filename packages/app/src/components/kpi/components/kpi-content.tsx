import { Box } from '~/components/base';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { BoldText } from '~/components/typography';
import { Bar } from '~/domain/vaccine/components/bar';
import { parseBirthyearRange } from '~/domain/vaccine/logic/parse-birthyear-range';
import { useIntl } from '~/intl';
import { space } from '~/style/theme';
import { replaceVariablesInText } from '~/utils';
import { TileData as KpiContentProps } from '../types';
import { Metadata, MetadataProps } from '~/components';

export const KpiContent = ({ title, description, value, bar, birthyear, differenceValue, isPercentage = false, dateOrRange, source }: KpiContentProps) => {
  const { commonTexts } = useIntl();
  const parsedBirthyearRange = birthyear ? parseBirthyearRange(birthyear) : null;

  const metadata: MetadataProps = {
    date: dateOrRange,
    source: source,
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
      <Metadata {...metadata} isTileFooter marginBottom={space[2]} />
    </Box>
  );
};
