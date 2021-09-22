import { isPresent } from 'ts-is-present';
import { PercentageBar } from '~/components/percentage-bar';
import { parseVaccinatedPercentageLabel } from '~/domain/vaccine/logic/parse-vaccinated-percentage-label';
import { colors } from '~/style/theme';
interface BarProps {
  value: number | null;
  color: string;
  label?: string | null;
  height?: number;
}

export function Bar({ value, color, label, height = 8 }: BarProps) {
  const parsedVaccinatedLabel = isPresent(label)
    ? parseVaccinatedPercentageLabel(label)
    : undefined;

  return (
    <>
      {isPresent(parsedVaccinatedLabel) ? (
        <PercentageBar
          percentage={parsedVaccinatedLabel.value}
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
          percentage={value ?? 0}
          height={height}
          color={color}
          backgroundColor="data.underReported"
        />
      )}
    </>
  );
}
