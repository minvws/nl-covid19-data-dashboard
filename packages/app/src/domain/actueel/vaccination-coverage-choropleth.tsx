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
import { gmCodesByVrCode } from '~/data/gm-codes-by-vr-code';
import { useIntl } from '~/intl';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { ChoroplethTwoColumnLayout } from '../topical/choropleth-two-column-layout';
import { TopicalSectionHeader } from '../topical/topical-section-header';
import { TopicalTile } from '../topical/topical-tile';
import {
  AgeGroup,
  AgeGroupSelect,
} from '../vaccine/components/age-group-select';
import { ChoroplethTooltip } from '../vaccine/vaccine-coverage-choropleth-per-gm';

type DefaultProps = {
  title: string;
  content: string;
};

type GmCoverage = DefaultProps & {
  gmCode: string;
  data: { gm: GmCollectionVaccineCoveragePerAgeGroup[] };
};

const isGmCoverage = (
  value: VaccinationCoverageChoroplethProps
): value is GmCoverage => {
  return 'gmCode' in value;
};

type VrCoverage = DefaultProps & {
  vrCode: string;
  data: { gm: GmCollectionVaccineCoveragePerAgeGroup[] };
};

const isVrCoverage = (
  value: VaccinationCoverageChoroplethProps
): value is VrCoverage => {
  return 'vrCode' in value;
};

type NlCoverage = DefaultProps & {
  data: {
    gm: GmCollectionVaccineCoveragePerAgeGroup[];
    vr: VrCollectionVaccineCoveragePerAgeGroup[];
  };
};

const isNlCoverage = (
  value: VaccinationCoverageChoroplethProps
): value is NlCoverage => {
  return !('gmCode' in value) && !('vrCode' in value);
};

type VaccinationCoverageChoroplethProps = GmCoverage | VrCoverage | NlCoverage;

/**
 * This choropleth has three use cases:
 * 1. National Actueel page: has a toggle between Vr and Gm,
 * 2. Municipality Actueel page: no toggle, display the selected Gm and other Gm's in the safety region
 * 3. Safety Region Actueel page: no toggle, display all Gm's in the safety region
 */
export function VaccinationCoverageChoropleth(
  props: VaccinationCoverageChoroplethProps
) {
  const reverseRouter = useReverseRouter();
  const { siteText } = useIntl();

  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>('18+');
  const [chartRegion, onChartRegionChange] =
    useState<RegionControlOption>('gm');

  const gmCodes = isVrCoverage(props)
    ? gmCodesByVrCode[props.vrCode]
    : undefined;
  const selectedGmCode = gmCodes ? gmCodes[0] : undefined;

  return (
    <TopicalTile>
      <TopicalSectionHeader title={props.title} />

      <ChoroplethTwoColumnLayout
        legendComponent={
          <ChoroplethLegenda
            thresholds={thresholds.gm.fully_vaccinated_percentage}
            title={
              siteText.vaccinaties.nl_choropleth_vaccinatie_graad.legenda_titel
            }
          />
        }
      >
        <Box>
          {((isNlCoverage(props) && chartRegion === 'gm') ||
            isGmCoverage(props)) && (
            <DynamicChoropleth
              map={'gm'}
              renderTarget="canvas"
              accessibility={{ key: 'vaccine_coverage_nl_choropleth' }}
              data={props.data.gm.filter(
                hasValueAtKey('age_group_range', selectedAgeGroup)
              )}
              dataConfig={{
                metricName: 'vaccine_coverage_per_age_group',
                metricProperty: 'has_one_shot_percentage',
              }}
              dataOptions={{
                isPercentage: true,
                highlightSelection: isGmCoverage(props),
                selectedCode: isGmCoverage(props) ? props.gmCode : undefined,
                getLink: reverseRouter.gm.vaccinaties,
                tooltipVariables: {
                  age_group: siteText.vaccinaties.age_groups[selectedAgeGroup],
                },
              }}
              formatTooltip={(context) => (
                <ChoroplethTooltip
                  data={context}
                  percentageProps={[
                    'fully_vaccinated_percentage',
                    'has_one_shot_percentage',
                  ]}
                />
              )}
            />
          )}

          {isVrCoverage(props) && (
            <DynamicChoropleth
              map={'gm'}
              renderTarget="canvas"
              accessibility={{ key: 'vaccine_coverage_nl_choropleth' }}
              data={props.data.gm.filter(
                hasValueAtKey('age_group_range', selectedAgeGroup)
              )}
              dataConfig={{
                metricName: 'vaccine_coverage_per_age_group',
                metricProperty: 'has_one_shot_percentage',
              }}
              dataOptions={{
                isPercentage: true,
                selectedCode: isVrCoverage(props) ? selectedGmCode : undefined,
                getLink: reverseRouter.gm.vaccinaties,
                tooltipVariables: {
                  age_group: siteText.vaccinaties.age_groups[selectedAgeGroup],
                },
              }}
              formatTooltip={(context) => (
                <ChoroplethTooltip
                  data={context}
                  percentageProps={[
                    'fully_vaccinated_percentage',
                    'has_one_shot_percentage',
                  ]}
                />
              )}
            />
          )}

          {isNlCoverage(props) && chartRegion === 'vr' && (
            <DynamicChoropleth
              map={'vr'}
              renderTarget="canvas"
              accessibility={{ key: 'vaccine_coverage_nl_choropleth' }}
              data={props.data.vr.filter(
                hasValueAtKey('age_group_range', selectedAgeGroup)
              )}
              dataConfig={{
                metricName: 'vaccine_coverage_per_age_group',
                metricProperty: 'has_one_shot_percentage',
              }}
              dataOptions={{
                isPercentage: true,
                getLink: (vrcode) => reverseRouter.actueel.vr(vrcode),
                tooltipVariables: {
                  age_group: siteText.vaccinaties.age_groups[selectedAgeGroup],
                },
              }}
              formatTooltip={(context) => (
                <ChoroplethTooltip
                  data={context}
                  percentageProps={[
                    'fully_vaccinated_percentage',
                    'has_one_shot_percentage',
                  ]}
                />
              )}
            />
          )}
        </Box>

        <Box spacing={3}>
          <Markdown content={props.content} />
          <AgeGroupSelect onChange={setSelectedAgeGroup} />
          {isNlCoverage(props) && (
            <Box
              display="flex"
              justifyContent={{ _: 'center', md: 'flex-start' }}
              mb={2}
            >
              <ChartRegionControls
                value={chartRegion}
                onChange={onChartRegionChange}
              />
            </Box>
          )}
        </Box>
      </ChoroplethTwoColumnLayout>
    </TopicalTile>
  );
}
