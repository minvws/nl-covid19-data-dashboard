import {
  GmCollectionVaccineCoveragePerAgeGroup,
  VrCollectionVaccineCoveragePerAgeGroup,
} from '@corona-dashboard/common';
import { useState } from 'react';
import { hasValueAtKey } from 'ts-is-present';
import { Box } from '~/components/base';
import {
  ChartRegionControls,
  RegionControlOption,
} from '~/components/chart-region-controls';
import { DynamicChoropleth } from '~/components/choropleth';
import { ChoroplethLegenda } from '~/components/choropleth-legenda';
import { thresholds } from '~/components/choropleth/logic';
import { Markdown } from '~/components/markdown';
import { useIntl } from '~/intl';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { ChoroplethTwoColumnLayout } from '../topical/choropleth-two-column-layout';
import { TopicalSectionHeader } from '../topical/topical-section-header';
import { TopicalTile } from '../topical/topical-tile';
import {
  AgeGroup,
  AgeGroupSelect,
} from '../vaccine/components/age-group-select';
import { getVaccineCoverageDisplayValues } from '../vaccine/logic/get-vaccine-coverage-display-values';
import { ChoroplethTooltip } from '../vaccine/vaccine-coverage-choropleth-per-gm';

type VaccinationCoverageChoroplethProps = {
  data: {
    gm: GmCollectionVaccineCoveragePerAgeGroup[];
    vr: VrCollectionVaccineCoveragePerAgeGroup[];
  };
};

export function VaccinationCoverageChoropleth(
  props: VaccinationCoverageChoroplethProps
) {
  const { data } = props;

  const reverseRouter = useReverseRouter();
  const { siteText } = useIntl();

  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>('18+');
  const [chartRegion, onChartRegionChange] =
    useState<RegionControlOption>('gm');

  return (
    <TopicalTile>
      {/* todo: Replace with siteText */}
      <TopicalSectionHeader title="De vaccinatiegraad in Nederland" />

      <ChoroplethTwoColumnLayout
        legendComponent={
          <>
            <Box
              display="flex"
              justifyContent={{ _: 'center', lg: 'flex-start' }}
            >
              <ChartRegionControls
                value={chartRegion}
                onChange={onChartRegionChange}
              />
            </Box>

            {/* TODO: replace with siteText */}
            <ChoroplethLegenda
              thresholds={thresholds.gm.fully_vaccinated_percentage}
              title={'Percentage'}
            />
          </>
        }
      >
        <Box>
          {chartRegion === 'gm' && (
            <DynamicChoropleth
              map={'gm'}
              renderTarget="canvas"
              accessibility={{ key: 'vaccine_coverage_nl_choropleth' }}
              data={data.gm.filter(
                hasValueAtKey('age_group_range', selectedAgeGroup)
              )}
              dataConfig={{
                metricName: 'vaccine_coverage_per_age_group',
                metricProperty: 'has_one_shot_percentage',
              }}
              dataOptions={{
                isPercentage: true,
                getLink: (gmcode) => reverseRouter.gm.vaccinaties(gmcode),
                tooltipVariables: {
                  age_group: siteText.vaccinaties.age_groups[selectedAgeGroup],
                },
              }}
              formatTooltip={(context) => (
                <ChoroplethTooltip
                  data={context}
                  getValues={getVaccineCoverageDisplayValues}
                />
              )}
            />
          )}

          {chartRegion === 'vr' && (
            <DynamicChoropleth
              map={'vr'}
              renderTarget="canvas"
              accessibility={{ key: 'vaccine_coverage_nl_choropleth' }}
              data={data.vr.filter(
                hasValueAtKey('age_group_range', selectedAgeGroup)
              )}
              dataConfig={{
                metricName: 'vaccine_coverage_per_age_group',
                metricProperty: 'has_one_shot_percentage',
              }}
              dataOptions={{
                isPercentage: true,
                getLink: (vrcode) => reverseRouter.vr.vaccinaties(vrcode),
                tooltipVariables: {
                  age_group: siteText.vaccinaties.age_groups[selectedAgeGroup],
                },
              }}
              formatTooltip={(context) => (
                <ChoroplethTooltip
                  data={context}
                  getValues={getVaccineCoverageDisplayValues}
                />
              )}
            />
          )}
        </Box>
        <Box spacing={3}>
          <Markdown
            /* TODO: replace with siteText */
            content={`Deze kaart laat zien hoeveel procent van de inwoners van elke gemeente gevaccineerd is.`}
          />
          <AgeGroupSelect onChange={setSelectedAgeGroup} />
        </Box>
      </ChoroplethTwoColumnLayout>
    </TopicalTile>
  );
}
