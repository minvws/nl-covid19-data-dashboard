import { colors } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { isPresent } from 'ts-is-present';
import { Box } from '~/components/base';
import { PercentageBar } from '~/components/percentage-bar';
import { InlineText } from '~/components/typography';
import { parseVaccinatedPercentageLabel } from '~/domain/vaccine/logic/parse-vaccinated-percentage-label';
import { useIntl } from '~/intl';
interface BarProps {
  value: number | null;
  color: string;
  label?: string | null;
  height?: number;
  showAxisValues?: boolean;
}

export function Bar({
  value,
  color,
  label,
  height = 8,
  showAxisValues,
}: BarProps) {
  const parsedVaccinatedLabel = isPresent(label)
    ? parseVaccinatedPercentageLabel(label)
    : undefined;

  const barValue = isPresent(parsedVaccinatedLabel)
    ? parsedVaccinatedLabel.value
    : value ?? 0;
  const barValueSign = isPresent(parsedVaccinatedLabel)
    ? parsedVaccinatedLabel.sign
    : '';

  const { formatPercentage } = useIntl();

  return (
    <Box>
      {isPresent(parsedVaccinatedLabel) ? (
        <PercentageBar
          percentage={barValue}
          height={height}
          color={color}
          backgroundStyle={
            parsedVaccinatedLabel.sign === '>' ? 'hatched' : 'normal'
          }
          backgroundColor={
            parsedVaccinatedLabel.sign === '>'
              ? color
              : colors.data.underReported
          }
        />
      ) : (
        <PercentageBar
          percentage={barValue}
          height={height}
          color={color}
          backgroundColor="data.underReported"
        />
      )}
      {showAxisValues && (
        <Box display="flex" flexDirection="row" position="relative" pt={1}>
          <InlineText variant="label1" color="bodyLight">
            0%
          </InlineText>
          <InlineText
            css={css({
              background:
                'linear-gradient(90deg, rgba(0,0,0,0) 0, rgba(255,255,255,1) 10%, rgba(255,255,255,1) 90%, rgba(0,0,0,0) 100%)',
              position: 'absolute',
              display: 'flex',
              justifyContent: 'center',
              left: `calc(${Math.round(barValue)}% - 30px)`,
              width: '60px',
            })}
            fontWeight="bold"
          >
            {barValueSign}
            {formatPercentage(barValue)}%
          </InlineText>
          <InlineText
            css={css({ ml: 'auto' })}
            variant="label1"
            color="bodyLight"
          >
            100%
          </InlineText>
        </Box>
      )}
    </Box>
  );
}
