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
  let parsedVaccinatedLabel;
  if (isPresent(label)) {
    parsedVaccinatedLabel = parseVaccinatedPercentageLabel(label);
  }

  return (
    <>
      {parsedVaccinatedLabel ? (
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
          percentage={value as number}
          height={height}
          color={color}
          backgroundColor="data.underReported"
        />
      )}
    </>
  );
}
