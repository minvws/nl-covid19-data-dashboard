import {
  colors,
  GmCollectionVaccineCoveragePerAgeGroup,
  VrCollectionVaccineCoveragePerAgeGroup,
} from '@corona-dashboard/common';
import { SiteText } from '~/locale';
import { MatchingVaccineCoverageAgeGroupsType } from './common';
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
import { BoldText } from '~/components/typography';
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

export function VaccineCoverageChoroplethPerGm({
  data,
}: VaccineCoverageChoroplethPerGmProps) {
  const { commonTexts } = useIntl();
  const [selectedMap, setSelectedMap] = useState<RegionControlOption>('gm');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>('18+');
  const [selectedCoverageKind, setSelectedCoverageKind] =
    useState<CoverageKindProperty>('fully_vaccinated_percentage');
  const reverseRouter = useReverseRouter();

  const setSelectedCoverageKindAndAge = (
    coverageKind: CoverageKindProperty
  ) => {
    // When changing between coverage kinds where the selected age group isn't available,
    // the other coverage kind set the non-matching age group to a default one.
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
                  shownAgeGroups={matchingAgeGroups[selectedCoverageKind]}
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

type VaccineCoverageData =
  | GmCollectionVaccineCoveragePerAgeGroup
  | VrCollectionVaccineCoveragePerAgeGroup;

type ChoroplethTooltipProps<T extends VaccineCoverageData> = {
  data: TooltipData<T>;
  selectedCoverageKind: CoverageKindProperty;
  ageGroups: AgeGroup[];
  mapData:
    | GmCollectionVaccineCoveragePerAgeGroup[]
    | VrCollectionVaccineCoveragePerAgeGroup[];
};

export function ChoroplethTooltip<T extends VaccineCoverageData>({
  data,
  ageGroups,
  selectedCoverageKind,
  mapData,
}: ChoroplethTooltipProps<T>) {
  const { commonTexts } = useIntl();
  const coverageKindsText = commonTexts.vaccinations.coverage_kinds;
  const ageGroupsText: SiteText['common']['common']['age_groups'] =
    commonTexts.common.age_groups;
  const formatCoveragePercentage = useVaccineCoveragePercentageFormatter();

  const secondaryContent = mapData
    .sort((a, b) => {
      const age1 = Number(a.age_group_range.replace(/\D/g, ''));
      const age2 = Number(b.age_group_range.replace(/\D/g, ''));
      return age1 - age2;
    })
    .map((vrOrGmData) => {
      const selectionMatchesAgeGroup = ageGroups.includes(
        vrOrGmData.age_group_range
      );

      if (!selectionMatchesAgeGroup) {
        return;
      }

      const filterBelow = vrOrGmData[selectedCoverageKind];

      return (
        <TooltipSubject
          thresholdValues={data.thresholdValues}
          filterBelow={filterBelow as number | null}
          noDataFillColor={colors.choroplethNoData}
          key={vrOrGmData.age_group_range}
        >
          <Box
            spacingHorizontal={2}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexGrow={1}
            mr={13}
            pr={2}
            key={vrOrGmData.age_group_range}
          >
            <Box
              display="inline"
              minWidth={
                vrOrGmData[`${selectedCoverageKind}_label`] !== null
                  ? '150px'
                  : 'false'
              }
            >
              <Markdown content={ageGroupsText[vrOrGmData.age_group_range]} />
            </Box>
            <Box
              display="inline"
              minWidth={
                vrOrGmData[`${selectedCoverageKind}_label`] !== null
                  ? '100px'
                  : 'false'
              }
            >
              {formatCoveragePercentage(vrOrGmData, selectedCoverageKind)}
            </Box>
          </Box>
        </TooltipSubject>
      );
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
      <BoldText>{coverageKindsText[selectedCoverageKind]}</BoldText>
      {secondaryContent}
    </TooltipContent>
  );
}
