import { isPresent } from 'ts-is-present';
import { PercentageBar } from '~/components/percentage-bar';
import { parseFullyVaccinatedPercentageLabel } from '~/domain/vaccine/logic/parse-fully-vaccinated-percentage-label';
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
    parsedVaccinatedLabel = parseFullyVaccinatedPercentageLabel(label);
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
