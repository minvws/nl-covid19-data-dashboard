import { isPresent } from 'ts-is-present';

export const parseFullyVaccinatedPercentageLabel = (
  label: string
): { sign: string; value: number } | null => {
  const regex = /(<|>)=([0-9]{1,2})/;
  const match = label.match(regex);

  if (match) {
    // match[0] is the full match
    const sign = match[1];
    const value = Number(match[2]);

    return isPresent(value) && !Number.isNaN(value) ? { sign, value } : null;
  }

  return null;
};
