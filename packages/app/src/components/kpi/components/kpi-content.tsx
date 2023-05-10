import { Box } from '~/components/base';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { BoldText } from '~/components/typography';
import { Bar } from '~/domain/vaccine/components/bar';
import { parseBirthyearRange } from '~/domain/vaccine/logic/parse-birthyear-range';
import { useIntl } from '~/intl';
import { space } from '~/style/theme';
import { replaceVariablesInText } from '~/utils';
import { DifferenceInteger } from '@corona-dashboard/common';

export type TileData = {
  description: string;
  title: string;
  value: number | null;
  bar?: BarType;
  isPercentage?: boolean;
  birthyear?: string | null;
  differenceValue?: DifferenceInteger;
};

export type BarType = {
  value: number;
  color: string;
};

export const KpiContent = ({ title, description, value, bar, birthyear, differenceValue, isPercentage = false }: TileData) => {
  const { commonTexts } = useIntl();
  const parsedBirthyearRange = birthyear ? parseBirthyearRange(birthyear) : null;

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
    </Box>
  );
};
