import {
  colors,
  GmCollectionVaccineCoveragePerAgeGroup,
  VrCollectionVaccineCoveragePerAgeGroup,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import { useState } from 'react';
import { hasValueAtKey } from 'ts-is-present';
import { Box } from '~/components/base';
import { RegionControlOption } from '~/components/chart-region-controls';
import { DynamicChoropleth } from '~/components/choropleth';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { thresholds } from '~/components/choropleth/logic';
import {
  TooltipContent,
  TooltipSubject,
} from '~/components/choropleth/tooltips';
import { TooltipData } from '~/components/choropleth/tooltips/types';
import { Markdown } from '~/components/markdown';
import { InlineText, BoldText } from '~/components/typography';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { AgeGroup, AgeGroupSelect } from './components/age-group-select';
import {
  CoverageKindProperty,
  VaccinationCoverageKindSelect,
} from './components/vaccination-coverage-kind-select';
import { useVaccineCoveragePercentageFormatter } from './logic/use-vaccine-coverage-percentage-formatter';

interface VaccineCoverageChoroplethPerGmProps {
  data: {
    gm: GmCollectionVaccineCoveragePerAgeGroup[];
    vr: VrCollectionVaccineCoveragePerAgeGroup[];
  };
}

type FullyVaccinatedAges = '12+' | '18+';
type Autumn2022Vaccinated = '12+' | '60+';

interface MatchingVaccineCoverageAgeGroupsType {
  autumn_2022_vaccinated_percentage: Autumn2022Vaccinated[];
  fully_vaccinated_percentage: FullyVaccinatedAges[];
}

export function VaccineCoverageChoroplethPerGm({
  data,
}: VaccineCoverageChoroplethPerGmProps) {
  const { commonTexts } = useIntl();
  const [selectedMap, setSelectedMap] = useState<RegionControlOption>('gm');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>('60+');
  const [selectedCoverageKind, setSelectedCoverageKind] =
    useState<CoverageKindProperty>('autumn_2022_vaccinated_percentage');
  const reverseRouter = useReverseRouter();

  const setSelectedCoverageKindAndAge = (
    coverageKind: CoverageKindProperty
  ) => {
    // When changing between covarage kinds with non mathcing age groups set the non matching age group to a default one.
    if (selectedAgeGroup !== '12+') {
      setSelectedAgeGroup(selectedAgeGroup === '18+' ? '60+' : '18+');
    }
    setSelectedCoverageKind(coverageKind);
  };

  const variables = {
    regio:
      commonTexts.choropleth.choropleth_vaccination_coverage.shared[
        selectedMap
      ],
  };

  const choroplethDataVr: VrCollectionVaccineCoveragePerAgeGroup[] =
    data.vr.filter(hasValueAtKey('age_group_range', selectedAgeGroup));
  const choroplethDataGm: GmCollectionVaccineCoveragePerAgeGroup[] =
    data.gm.filter(hasValueAtKey('age_group_range', selectedAgeGroup));

  const matchingAgeGroups: MatchingVaccineCoverageAgeGroupsType = {
    autumn_2022_vaccinated_percentage: ['12+', '60+'],
    fully_vaccinated_percentage: ['12+', '18+'],
  };

  return (
    <ChoroplethTile
      title={replaceVariablesInText(
        commonTexts.choropleth.choropleth_vaccination_coverage.nl.title,
        variables
      )}
      description={
        <>
          <Markdown
            content={replaceVariablesInText(
              commonTexts.choropleth.choropleth_vaccination_coverage.nl
                .description,
              variables
            )}
          />
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="flex-start"
            spacingHorizontal={2}
            as={'fieldset'}
          >
            <BoldText
              as="legend"
              css={css({
                flexBasis: '100%',
                mb: 2,
              })}
            >
              {
                commonTexts.choropleth.vaccination_coverage.shared
                  .dropdowns_title
              }
            </BoldText>

            <Box
              display="flex"
              width="100%"
              spacingHorizontal={{ xs: 2 }}
              flexWrap="wrap"
              flexDirection={{ _: 'column', xs: 'row' }}
            >
              <Box flex="1">
                <VaccinationCoverageKindSelect
                  onChange={setSelectedCoverageKindAndAge}
                  initialValue={selectedCoverageKind}
                />
              </Box>
              <Box flex="1">
                <AgeGroupSelect
                  onChange={setSelectedAgeGroup}
                  initialValue={selectedAgeGroup}
                />
              </Box>
            </Box>
          </Box>
        </>
      }
      legend={{
        thresholds: thresholds.gm.fully_vaccinated_percentage,
        title:
          commonTexts.choropleth.choropleth_vaccination_coverage.shared
            .legend_title,
      }}
      metadata={{
        source: commonTexts.choropleth.vaccination_coverage.shared.bronnen.rivm,
        date: data[selectedMap][0].date_unix,
      }}
      chartRegion={selectedMap}
      onChartRegionChange={setSelectedMap}
    >
      {selectedMap === 'gm' && (
        <DynamicChoropleth
          map={'gm'}
          accessibility={{ key: 'vaccine_coverage_nl_choropleth' }}
          data={choroplethDataGm}
          dataConfig={{
            metricName: 'vaccine_coverage_per_age_group',
            metricProperty: selectedCoverageKind,
          }}
          dataOptions={{
            isPercentage: true,
            getLink: (gmcode) => reverseRouter.gm.vaccinaties(gmcode),
          }}
          formatTooltip={(context) => (
            <ChoroplethTooltip
              data={context}
              mapData={data.gm.filter(
                (singleGM) => singleGM.gmcode === context.code
              )}
              ageGroups={matchingAgeGroups[selectedCoverageKind]}
              selectedCoverageKind={selectedCoverageKind}
            />
          )}
        />
      )}

      {selectedMap === 'vr' && (
        <DynamicChoropleth
          map={'vr'}
          accessibility={{ key: 'vaccine_coverage_nl_choropleth' }}
          data={choroplethDataVr}
          dataConfig={{
            metricName: 'vaccine_coverage_per_age_group',
            metricProperty: selectedCoverageKind,
          }}
          dataOptions={{
            isPercentage: true,
            getLink: (vrcode) => reverseRouter.vr.vaccinaties(vrcode),
          }}
          formatTooltip={(context) => (
            <ChoroplethTooltip
              data={context}
              mapData={data.vr.filter(
                (singleVR) => singleVR.vrcode === context.code
              )}
              ageGroups={matchingAgeGroups[selectedCoverageKind]}
              selectedCoverageKind={selectedCoverageKind}
            />
          )}
        />
      )}
    </ChoroplethTile>
  );
}

type VaccineCoverageData = {
  ageGroups: AgeGroup[];
  selectedCoverageKind: CoverageKindProperty;
  data: ChoroplethTooltipProps;
  mapData:
    | GmCollectionVaccineCoveragePerAgeGroup[]
    | VrCollectionVaccineCoveragePerAgeGroup[];
};

type ChoroplethTooltipProps = {
  data: TooltipData<T>;
};

export function ChoroplethTooltip({
  data,
  selectedCoverageKind,
  mapData,
}: VaccineCoverageData) {
  const { commonTexts } = useIntl();
  const coverageKindsText = commonTexts.vaccinations.coverage_kinds;
  const ageGroupsText = commonTexts.common.age_groups;
  const formatCoveragePercentage = useVaccineCoveragePercentageFormatter();

  const secondaryContent = mapData.map((vrOrGmData) => {
    <Box
      spacingHorizontal={2}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      mr={13}
      pr={2}
      key={vrOrGmData.age_group_range}
    >
      <Markdown content={ageGroupsText[vrOrGmData.age_group_range]} />
      <InlineText>
        {formatCoveragePercentage(vrOrGmData[selectedCoverageKind], vrOrGmData)}
      </InlineText>
    </Box>;
  });

  return (
    <TooltipContent
      title={data.featureName}
      link={
        data.dataOptions.getLink
          ? data.dataOptions.getLink(data.code)
          : undefined
      }
    >
      <TooltipSubject
        subject={selectedCoverageKind}
        thresholdValues={data.thresholdValues}
        filterBelow={filterBelow as number | null}
        noDataFillColor={colors.choroplethNoData}
      >
        <Box
          flexGrow={1}
          spacingHorizontal={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <BoldText>{coverageKindsText[selectedCoverageKind]}</BoldText>
        </Box>
      </TooltipSubject>
      {secondaryContent}
    </TooltipContent>
  );
}
