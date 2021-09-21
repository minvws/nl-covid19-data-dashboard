import { Box } from '~/components/base';
import { Legend } from '~/components/legend';
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

  return (
    <MiniTile {...tileProps}>
      <Box display="flex" flexDirection="column" spacing={3}>
        <Bar
          value={oneShotPercentage}
          color={COLOR_HAS_ONE_SHOT}
          label={oneShotPercentageLabel}
          height={20}
        />
        <Bar
          value={fullyVaccinatedPercentage}
          color={COLOR_FULLY_VACCINATED}
          label={fullyVaccinatedPercentageLabel}
          height={20}
        />
      </Box>
      <Box pt={4}>
        <Legend
          items={[
            {
              color: COLOR_HAS_ONE_SHOT,
              shape: 'square',
              label: 'Opkomst eerste prik',
            },
            {
              color: COLOR_FULLY_VACCINATED,
              shape: 'square',
              label: 'Volledig gevaccineerd',
            },
          ]}
        ></Legend>
      </Box>
    </MiniTile>
  );
}
