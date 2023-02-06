import { colors, GmCollectionVaccineCoveragePerAgeGroup, VrCollectionVaccineCoveragePerAgeGroup } from '@corona-dashboard/common';
import { SiteText } from '~/locale';
import { matchingAgeGroups, VaccineCoverageData, DataPerAgeGroup, BirthyearRangeKeysOfAgeGroups, PercentageKeysOfAgeGroups, PercentageLabelKeysOfAgeGroups } from './common';
import css from '@styled-system/css';
import { useState } from 'react';
import { space } from '~/style/theme';
import { Box } from '~/components/base';
import { RegionControlOption } from '~/components/chart-region-controls';
import { DynamicChoropleth } from '~/components/choropleth';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { thresholds } from '~/components/choropleth/logic';
import { TooltipContent, TooltipSubject } from '~/components/choropleth/tooltips';
import { TooltipData } from '~/components/choropleth/tooltips/types';
import { Markdown } from '~/components/markdown';
import { BoldText } from '~/components/typography';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { AgeGroup, AgeGroupSelect } from './components/age-group-select';
import { CoverageKindProperty, VaccinationCoverageKindSelect } from './components/vaccination-coverage-kind-select';
import { parseVaccinatedPercentageLabel } from './logic/parse-vaccinated-percentage-label';

interface VaccineCoverageChoroplethProps {
  data: {
    gm: GmCollectionVaccineCoveragePerAgeGroup[];
    vr: VrCollectionVaccineCoveragePerAgeGroup[];
  };
}

export const VaccineCoverageChoropleth = ({ data }: VaccineCoverageChoroplethProps) => {
  const { commonTexts } = useIntl();
  const [selectedMap, setSelectedMap] = useState<RegionControlOption>('gm');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>('18');
  const [selectedCoverageKind, setSelectedCoverageKind] = useState<CoverageKindProperty>('primary_series');
  const reverseRouter = useReverseRouter();

  /**
   * When changing between coverage kinds where the selected age group isn't available,
   * the other coverage kind set the non-matching age group to a default one.
   */
  const setSelectedCoverageKindAndAge = (coverageKind: CoverageKindProperty) => {
    if (coverageKind === selectedCoverageKind) return;
    if (selectedAgeGroup !== '12') {
      setSelectedAgeGroup(selectedAgeGroup === '18' ? '60' : '18');
    }
    setSelectedCoverageKind(coverageKind);
  };

  const variables = {
    regio: commonTexts.choropleth.choropleth_vaccination_coverage.shared[selectedMap],
  };

  const choroplethDataVr: VrCollectionVaccineCoveragePerAgeGroup[] = data.vr.filter((choroplethDataSingleVR) => choroplethDataSingleVR.vaccination_type === selectedCoverageKind);
  const choroplethDataGm: GmCollectionVaccineCoveragePerAgeGroup[] = data.gm.filter((choroplethDataSingleGM) => choroplethDataSingleGM.vaccination_type === selectedCoverageKind);

  return (
    <ChoroplethTile
      title={replaceVariablesInText(commonTexts.choropleth.choropleth_vaccination_coverage.nl.title, variables)}
      description={
        <>
          <Markdown content={replaceVariablesInText(commonTexts.choropleth.choropleth_vaccination_coverage.nl.description, variables)} />
          <Box display="flex" flexDirection="row" justifyContent="flex-start" spacingHorizontal={2} as={'fieldset'}>
            <BoldText
              as="legend"
              css={css({
                flexBasis: '100%',
                marginBottom: space[2],
              })}
            >
              {commonTexts.choropleth.vaccination_coverage.shared.dropdowns_title}
            </BoldText>

            <Box display="flex" width="100%" spacingHorizontal={{ xs: 2 }} flexWrap="wrap" flexDirection={{ _: 'column', xs: 'row' }}>
              <Box flex="1">
                <VaccinationCoverageKindSelect onChange={setSelectedCoverageKindAndAge} initialValue={selectedCoverageKind} />
              </Box>
              <Box flex="1">
                <AgeGroupSelect onChange={setSelectedAgeGroup} initialValue={selectedAgeGroup} shownAgeGroups={matchingAgeGroups[selectedCoverageKind]} />
              </Box>
            </Box>
          </Box>
        </>
      }
      legend={{
        thresholds: selectedMap === 'gm' ? thresholds.gm.primary_series_percentage : thresholds.vr.primary_series_percentage,
        title: commonTexts.choropleth.choropleth_vaccination_coverage.shared.legend_title,
      }}
      metadata={{
        source: commonTexts.choropleth.vaccination_coverage.shared.bronnen.rivm,
        date:
          selectedMap === 'gm'
            ? data.gm.find((item: GmCollectionVaccineCoveragePerAgeGroup | VrCollectionVaccineCoveragePerAgeGroup) => item.vaccination_type === selectedCoverageKind)?.date_unix
            : data.vr.find((item: GmCollectionVaccineCoveragePerAgeGroup | VrCollectionVaccineCoveragePerAgeGroup) => item.vaccination_type === selectedCoverageKind)?.date_unix,
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
            metricProperty: `vaccinated_percentage_${selectedAgeGroup}_plus`,
          }}
          dataOptions={{
            isPercentage: true,
            getLink: (gmcode) => reverseRouter.gm.vaccinaties(gmcode),
          }}
          formatTooltip={(context) => <ChoroplethTooltip data={context} ageGroups={matchingAgeGroups[selectedCoverageKind]} selectedCoverageKind={selectedCoverageKind} />}
        />
      )}

      {selectedMap === 'vr' && (
        <DynamicChoropleth
          map={'vr'}
          accessibility={{ key: 'vaccine_coverage_nl_choropleth' }}
          data={choroplethDataVr}
          dataConfig={{
            metricName: 'vaccine_coverage_per_age_group',
            metricProperty: `vaccinated_percentage_${selectedAgeGroup}_plus`,
          }}
          dataOptions={{
            isPercentage: true,
            getLink: (vrcode) => reverseRouter.vr.vaccinaties(vrcode),
          }}
          formatTooltip={(context) => <ChoroplethTooltip data={context} ageGroups={matchingAgeGroups[selectedCoverageKind]} selectedCoverageKind={selectedCoverageKind} />}
        />
      )}
    </ChoroplethTile>
  );
};

type ChoroplethTooltipProps<T extends VaccineCoverageData> = {
  data: TooltipData<T>;
  selectedCoverageKind: CoverageKindProperty;
  ageGroups: AgeGroup[];
};

export function ChoroplethTooltip<T extends VaccineCoverageData>({ data, selectedCoverageKind, ageGroups }: ChoroplethTooltipProps<T>) {
  const { commonTexts, formatPercentage } = useIntl();
  const coverageKindsText = commonTexts.vaccinations.coverage_kinds;
  const ageGroupsText: SiteText['common']['common']['age_groups'] = commonTexts.common.age_groups;

  const tooltipContentValues = ageGroups.map((ageGroup) => {
    const ageGroupKeys: DataPerAgeGroup = {
      birthyear_range_plus: `birthyear_range_${ageGroup}_plus` as unknown as BirthyearRangeKeysOfAgeGroups,
      vaccinated_percentage_plus: `vaccinated_percentage_${ageGroup}_plus` as unknown as PercentageKeysOfAgeGroups,
      vaccinated_percentage_plus_label: `vaccinated_percentage_${ageGroup}_plus_label` as unknown as PercentageLabelKeysOfAgeGroups,
    };

    const parsedLabel: {
      vaccinated_percentage_plus_label?: string | null;
    } = {};

    const ageGroupPercentage = data.dataItem[ageGroupKeys.vaccinated_percentage_plus as unknown as keyof VaccineCoverageData] as number;
    const coveragePercentageLabel = data.dataItem[ageGroupKeys.vaccinated_percentage_plus_label as unknown as keyof VaccineCoverageData] as string;
    const minWidthOfLabel = coveragePercentageLabel !== null ? '120px' : undefined;

    const result = coveragePercentageLabel ? parseVaccinatedPercentageLabel(coveragePercentageLabel) : null;

    if (result) {
      const content = result.sign === '>' ? commonTexts.common.meer_dan : commonTexts.common.minder_dan;
      parsedLabel.vaccinated_percentage_plus_label = replaceVariablesInText(content, {
        value: `${formatPercentage(ageGroupPercentage)}%`,
      });
    }

    return (
      <TooltipSubject
        thresholdValues={data.thresholdValues}
        filterBelow={data.dataItem[ageGroupKeys.vaccinated_percentage_plus as unknown as keyof VaccineCoverageData] as number}
        noDataFillColor={colors.white}
        key={ageGroup}
      >
        <Box spacingHorizontal={2} display="flex" alignItems="center" justifyContent="space-between" flexGrow={1} marginRight="13px" paddingRight={space[2]}>
          <Box display="inline" minWidth={minWidthOfLabel} textAlign="left">
            <Markdown content={ageGroupsText[ageGroup]} />
          </Box>
          {typeof ageGroupPercentage === 'number' && (
            <Box display="inline" minWidth={minWidthOfLabel} textAlign="right">
              {parsedLabel.vaccinated_percentage_plus_label ? parsedLabel.vaccinated_percentage_plus_label : `${formatPercentage(ageGroupPercentage)}%`}
            </Box>
          )}
        </Box>
      </TooltipSubject>
    );
  });

  return (
    <TooltipContent title={data.featureName} link={data.dataOptions.getLink ? data.dataOptions.getLink(data.code) : undefined}>
      <BoldText>{coverageKindsText[selectedCoverageKind]}</BoldText>
      {tooltipContentValues}
    </TooltipContent>
  );
}
