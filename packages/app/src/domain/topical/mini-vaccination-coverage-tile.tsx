import { Box } from '~/components/base';
import { Markdown } from '~/components/markdown';
import {
  COLOR_FULLY_VACCINATED,
  COLOR_HAS_ONE_SHOT,
  COLOR_FULLY_BOOSTERED,
} from '../vaccine/vaccine-coverage-per-age-group/common';
import { Bar } from '../vaccine/vaccine-coverage-per-age-group/components/bar';
import { MiniTile, MiniTileProps } from './mini-tile';

type MiniVaccinationCoverageTileProps = {
  oneShotPercentage: number | null;
  fullyVaccinatedPercentage: number | null;
  boosterShotAdministered?: number | null;
  oneShotPercentageLabel?: string | null;
  fullyVaccinatedPercentageLabel?: string | null;
  boosterShotAdministeredLabel?: string | null;
  oneShotBarLabel: string;
  fullyVaccinatedBarLabel: string;
  boosterShotAdministeredBarLabel?: string;
} & Omit<MiniTileProps, 'children'>;

export function MiniVaccinationCoverageTile(
  props: MiniVaccinationCoverageTileProps
) {
  const {
    oneShotPercentage,
    fullyVaccinatedPercentage,
    boosterShotAdministered,
    oneShotPercentageLabel,
    fullyVaccinatedPercentageLabel,
    boosterShotAdministeredLabel,
    oneShotBarLabel,
    fullyVaccinatedBarLabel,
    boosterShotAdministeredBarLabel,
    ...tileProps
  } = props;

  return (
    <MiniTile {...tileProps}>
      <Box display="flex" flexDirection="column" spacing={3}>
        <LabeledBar
          value={oneShotPercentage}
          color={COLOR_HAS_ONE_SHOT}
          valueLabel={oneShotPercentageLabel}
          barLabel={oneShotBarLabel}
        />
        <LabeledBar
          value={fullyVaccinatedPercentage}
          color={COLOR_FULLY_VACCINATED}
          valueLabel={fullyVaccinatedPercentageLabel}
          barLabel={fullyVaccinatedBarLabel}
        />
        {boosterShotAdministered && boosterShotAdministeredBarLabel && (
          <LabeledBar
            value={boosterShotAdministered}
            color={COLOR_FULLY_BOOSTERED}
            valueLabel={boosterShotAdministeredLabel}
            barLabel={boosterShotAdministeredBarLabel}
          />
        )}
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
    <Box spacing={1}>
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
