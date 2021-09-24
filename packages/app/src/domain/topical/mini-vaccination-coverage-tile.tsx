import { Box } from '~/components/base';
import { Markdown } from '~/components/markdown';
import { useIntl } from '~/intl';
import {
  COLOR_FULLY_VACCINATED,
  COLOR_HAS_ONE_SHOT,
} from '../vaccine/vaccine-coverage-per-age-group/common';
import { Bar } from '../vaccine/vaccine-coverage-per-age-group/components/bar';
import { MiniTile, MiniTileProps } from './mini-tile';

type MiniVaccinationCoverageTileProps = {
  oneShotPercentage: number | null;
  fullyVaccinatedPercentage: number | null;
  oneShotPercentageLabel?: string | null;
  fullyVaccinatedPercentageLabel?: string | null;
} & Omit<MiniTileProps, 'children'>;

export function MiniVaccinationCoverageTile(
  props: MiniVaccinationCoverageTileProps
) {
  const {
    oneShotPercentage,
    fullyVaccinatedPercentage,
    oneShotPercentageLabel,
    fullyVaccinatedPercentageLabel,
    ...tileProps
  } = props;

  const { siteText } = useIntl();

  return (
    <MiniTile {...tileProps}>
      <Box display="flex" flexDirection="column" spacing={3}>
        <RichBar
          value={oneShotPercentage}
          color={COLOR_HAS_ONE_SHOT}
          valueLabel={oneShotPercentageLabel}
          barLabel={'**Opkomst 1e prik** (18 jaar en ouder)'}
        />
        <RichBar
          value={fullyVaccinatedPercentage}
          color={COLOR_FULLY_VACCINATED}
          valueLabel={fullyVaccinatedPercentageLabel}
          barLabel={'**Vaccinatiegraad** (18 jaar en ouder)'}
        />
      </Box>
    </MiniTile>
  );
}

type RichBarProps = {
  value: number | null;
  valueLabel?: string | null;
  color: string;
  barLabel: string;
};

function RichBar(props: RichBarProps) {
  const { value, valueLabel, color, barLabel } = props;

  return (
    <Box>
      <Markdown content={barLabel} />
      <Bar
        value={value}
        color={color}
        label={valueLabel}
        height={20}
        showAxisValues
      />
    </Box>
  );
}
