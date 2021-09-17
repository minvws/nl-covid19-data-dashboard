import css from '@styled-system/css';
import { isPresent } from 'ts-is-present';
import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
import { parseFullyVaccinatedPercentageLabel } from '~/domain/vaccine/logic/parse-fully-vaccinated-percentage-label';
import { useIntl } from '~/intl';
import { asResponsiveArray } from '~/style/utils';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

interface NarrowPercentageProps {
  value: number | null;
  color: string;
  label?: string | null;
  textLabel: string;
}

export function NarrowPercentage({
  value,
  color,
  label,
  textLabel,
}: NarrowPercentageProps) {
  const { siteText, formatPercentage } = useIntl();

  let parsedVaccinatedLabel;
  if (isPresent(label)) {
    parsedVaccinatedLabel = parseFullyVaccinatedPercentageLabel(label);
  }

  return (
    <>
      {parsedVaccinatedLabel ? (
        <PercentageMarkup
          color={color}
          textLabel={textLabel}
          value={
            parsedVaccinatedLabel.sign === '>'
              ? replaceVariablesInText(
                  siteText.vaccinaties_common.labels.meer_dan,
                  {
                    value: formatPercentage(parsedVaccinatedLabel.value) + '%',
                  }
                )
              : replaceVariablesInText(
                  siteText.vaccinaties_common.labels.minder_dan,
                  {
                    value: formatPercentage(parsedVaccinatedLabel.value) + '%',
                  }
                )
          }
        />
      ) : (
        <PercentageMarkup
          value={`${formatPercentage(value as number)}%`}
          color={color}
          textLabel={textLabel}
        />
      )}
    </>
  );
}

function PercentageMarkup({
  value,
  color,
  textLabel,
}: {
  value: string;
  color: string;
  textLabel: string;
}) {
  return (
    <Box
      css={css({
        display: 'flex',
        alignItems: 'center',
        pr: asResponsiveArray({ _: 3, xl: 4 }),
      })}
    >
      <Box pr={3} minWidth="8.5rem" textAlign="left">
        <InlineText>{`${textLabel}:`}</InlineText>
      </Box>
      <Box
        width={10}
        height={10}
        backgroundColor={color}
        borderRadius="50%"
        mr={2}
      />
      {value}
    </Box>
  );
}
