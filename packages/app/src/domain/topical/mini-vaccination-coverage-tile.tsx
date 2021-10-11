import { Box } from '~/components/base';
import { Markdown } from '~/components/markdown';
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
  oneShotBarLabel: string;
  fullyVaccinatedBarLabel: string;
} & Omit<MiniTileProps, 'children'>;

export function MiniVaccinationCoverageTile(
  props: MiniVaccinationCoverageTileProps
) {
  const {
    oneShotPercentage,
    fullyVaccinatedPercentage,
    oneShotPercentageLabel,
    fullyVaccinatedPercentageLabel,
    oneShotBarLabel,
    fullyVaccinatedBarLabel,
    ...tileProps
  } = props;

  return (
    <MiniTile {...tileProps}>
      <Box display="flex" flexDirection="column" spacing={3}>
        <LabeledBar
          value={fullyVaccinatedPercentage}
          color={COLOR_FULLY_VACCINATED}
          valueLabel={fullyVaccinatedPercentageLabel}
          barLabel={fullyVaccinatedBarLabel}
        />
        <LabeledBar
          value={oneShotPercentage}
          color={COLOR_HAS_ONE_SHOT}
          valueLabel={oneShotPercentageLabel}
          barLabel={oneShotBarLabel}
        />
      </Box>
    </MiniTile>
  );
}

type LabeledBarProps = {
  value: number | null;
  valueLabel?: string | null;
  color: string;
  barLabel: string;
};

function LabeledBar(props: LabeledBarProps) {
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
