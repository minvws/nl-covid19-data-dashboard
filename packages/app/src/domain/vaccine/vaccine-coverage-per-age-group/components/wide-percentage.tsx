import css from '@styled-system/css';
import { isPresent } from 'ts-is-present';
import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
import {
  parseVaccinatedPercentageLabel,
  renderVaccinatedLabel,
} from '~/domain/vaccine/logic/parse-vaccinated-percentage-label';
import { useIntl } from '~/intl';
import { asResponsiveArray } from '~/style/utils';

interface PercentageWideNumberProps {
  value: number | null;
  color: string;
  label?: string | null;
}

export function WidePercentage({
  value,
  color,
  label,
}: PercentageWideNumberProps) {
  const { siteText, formatPercentage } = useIntl();

  const parsedVaccinatedLabel = isPresent(label)
    ? parseVaccinatedPercentageLabel(label)
    : null;

  const renderedVaccinatedLabel = renderVaccinatedLabel(
    parsedVaccinatedLabel,
    siteText.vaccinaties_common.labels.meer_dan,
    siteText.vaccinaties_common.labels.minder_dan,
    formatPercentage
  );

  return (
    <>
      {isPresent(renderedVaccinatedLabel) ? (
        <PercentageMarkup color={color} value={renderedVaccinatedLabel} />
      ) : (
        <PercentageMarkup
          value={`${formatPercentage(value as number)}%`}
          color={color}
        />
      )}
    </>
  );
}

interface PercentageMarkupProps {
  value: string;
  color: string;
}

function PercentageMarkup({ value, color }: PercentageMarkupProps) {
  return (
    <InlineText
      variant="body2"
      textAlign="right"
      css={css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        pr: asResponsiveArray({ _: 3, xl: 4 }),
      })}
    >
      <Box
        width={10}
        height={10}
        backgroundColor={color}
        borderRadius="50%"
        mr={2}
      />
      {value}
    </InlineText>
  );
}
