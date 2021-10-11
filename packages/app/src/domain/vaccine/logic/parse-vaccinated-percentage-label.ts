import { isPresent } from 'ts-is-present';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

type ParsedFullyVaccinatedPercentageLabel = { sign: string; value: number };

export function placeholderizeLabel(renderedLabel: string) {
  return renderedLabel.toLocaleLowerCase();
}

export function getRenderedVaccinatedLabel(
  unparsedLabel: string | null,
  value: number | null,
  higherLabel: string,
  lowerLabel: string,
  formatPercentage: (value: number) => string
) {
  if (!isPresent(unparsedLabel)) {
    return value?.toString() ?? '';
  }

  const parsedLabel = parseVaccinatedPercentageLabel(unparsedLabel);

  return renderVaccinatedLabel(
    parsedLabel,
    higherLabel,
    lowerLabel,
    formatPercentage
  );
}

export function parseVaccinatedPercentageLabel(
  label: string
): ParsedFullyVaccinatedPercentageLabel | null {
  const regex = /(<|>)=([0-9]{1,2})/;
  const match = label.match(regex);

  if (match) {
    // match[0] is the full match
    const sign = match[1];
    const value = Number(match[2]);

    return isPresent(value) && !Number.isNaN(value) ? { sign, value } : null;
  }

  return null;
}

export function renderVaccinatedLabel(
  parsedVaccinatedLabel: ParsedFullyVaccinatedPercentageLabel | null,
  higherLabel: string,
  lowerLabel: string,
  formatPercentage: (value: number) => string
) {
  return isPresent(parsedVaccinatedLabel)
    ? parsedVaccinatedLabel.sign === '>'
      ? replaceVariablesInText(higherLabel, {
          value: formatPercentage(parsedVaccinatedLabel.value),
        })
      : replaceVariablesInText(lowerLabel, {
          value: formatPercentage(parsedVaccinatedLabel.value),
        })
    : '';
}
