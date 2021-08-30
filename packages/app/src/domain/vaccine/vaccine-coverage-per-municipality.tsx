import {
  assert,
  GmCollectionVaccineCoveragePerAgeGroup,
  VrCollectionVaccineCoveragePerAgeGroup,
} from '@corona-dashboard/common';
import React, { useMemo, useState } from 'react';
import { hasValueAtKey, isDefined, isPresent } from 'ts-is-present';
import { Box } from '~/components/base';
import { RegionControlOption } from '~/components/chart-region-controls';
import { Choropleth } from '~/components/choropleth';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { ChoroplethDataItem, thresholds } from '~/components/choropleth/logic';
import {
  TooltipContent,
  TooltipSubject,
} from '~/components/choropleth/tooltips';
import { TooltipData } from '~/components/choropleth/tooltips/types';
import { Markdown } from '~/components/markdown';
import { InlineText, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { AgeGroup, AgeGroupSelect } from './components/age-group-select';
import { getSecondaryMetric } from './logic/get-secondary-metric';

interface VaccineCoveragePerMunicipalityProps {
  data: {
    gm: GmCollectionVaccineCoveragePerAgeGroup[];
    vr: VrCollectionVaccineCoveragePerAgeGroup[];
  };
}

export function VaccineCoveragePerMunicipality({
  data,
}: VaccineCoveragePerMunicipalityProps) {
  const { siteText } = useIntl();
  const [selectedMap, setSelectedMap] = useState<RegionControlOption>('gm');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>('18+');
  const reverseRouter = useReverseRouter();

  const variables = {
    regio: siteText.vaccinaties.choropleth_vaccinatie_graad_per_gm[selectedMap],
  };

  return (
    <ChoroplethTile
      title={replaceVariablesInText(
        siteText.vaccinaties.choropleth_vaccinatie_graad_per_gm.titel,
        variables
      )}
      description={
        <>
          <Text>
            {replaceVariablesInText(
              siteText.vaccinaties.choropleth_vaccinatie_graad_per_gm
                .description,
              variables
            )}
          </Text>

          <AgeGroupSelect onChange={setSelectedAgeGroup} />
        </>
      }
      legend={{
        thresholds: thresholds.gm.fully_vaccinated_percentage,
        title:
          siteText.vaccinaties.choropleth_vaccinatie_graad_per_gm.legenda_titel,
      }}
      metadata={{ source: siteText.brononderzoek.bronnen.rivm }}
      chartRegion={selectedMap}
      onChartRegionChange={setSelectedMap}
    >
      {selectedMap === 'gm' && (
        <Choropleth
          map={'gm'}
          accessibility={{ key: 'vaccine_coverage_nl_choropleth' }}
          data={data.gm.filter(
            hasValueAtKey('age_group_range', selectedAgeGroup)
          )}
          dataConfig={{
            metricName: 'vaccine_coverage_per_age_group',
            metricProperty: 'fully_vaccinated_percentage',
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
              getSecondaryMetric={getSecondaryMetric}
            />
          )}
        />
      )}

      {selectedMap === 'vr' && (
        <Choropleth
          map={'vr'}
          accessibility={{ key: 'vaccine_coverage_nl_choropleth' }}
          data={data.vr.filter(
            hasValueAtKey('age_group_range', selectedAgeGroup)
          )}
          dataConfig={{
            metricName: 'vaccine_coverage_per_age_group',
            metricProperty: 'fully_vaccinated_percentage',
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
              getSecondaryMetric={getSecondaryMetric}
            />
          )}
        />
      )}
    </ChoroplethTile>
  );
}

type ChoroplethTooltipProps<T extends ChoroplethDataItem> = {
  data: TooltipData<T>;
  getSecondaryMetric: (d: T) => { sign: string; value: number } | null;
};

export function ChoroplethTooltip<T extends ChoroplethDataItem>(
  props: ChoroplethTooltipProps<T>
) {
  const { data, getSecondaryMetric } = props;

  const { siteText, formatPercentage } = useIntl();
  const text = siteText.choropleth_tooltip;

  const value = useMemo(():
    | number
    | ReturnType<typeof getSecondaryMetric>
    | null => {
    if (isPresent(getSecondaryMetric(data.dataItem))) {
      const metric = getSecondaryMetric(data.dataItem);
      return isPresent(metric) ? metric : null;
    }

    if (isPresent(data.dataItem[data.dataConfig.metricProperty])) {
      return data.dataItem[data.dataConfig.metricProperty];
    }

    return null;
  }, [data, getSecondaryMetric]);

  const subject = (
    text as unknown as Record<string, Record<string, Record<string, string>>>
  )[data.map]?.[data.dataConfig.metricProperty as string]?.subject;
  assert(
    isDefined(subject),
    `No tooltip subject found in siteText.choropleth_tooltip.${data.map}.${data.dataConfig.metricProperty}`
  );

  const tooltipContent = (
    text as unknown as Record<string, Record<string, Record<string, string>>>
  )[data.map]?.[data.dataConfig.metricProperty as string]?.content;
  assert(
    isDefined(tooltipContent),
    `No tooltip content found in siteText.choropleth_tooltip.${data.map}.${data.dataConfig.metricProperty}`
  );

  const tooltipVars = {
    ...data.dataItem,
    ...data.dataOptions.tooltipVariables,
  } as Record<string, string | number>;

  let filterBelow = null;
  let tooltipValue = null;
  if (typeof value === 'number') {
    filterBelow = value;
    tooltipValue = formatPercentage(value) + '%';
  } else if (value !== null && 'sign' in value) {
    filterBelow = value.value;

    const tooltipValueContent = (
      text as unknown as Record<string, Record<string, Record<string, string>>>
    )[data.map]?.[data.dataConfig.metricProperty as string]?.[value.sign];
    assert(
      isDefined(tooltipValueContent),
      `No tooltip content found in siteText.choropleth_tooltip.${data.map}.${data.dataConfig.metricProperty}.${value.sign}`
    );

    tooltipValue = replaceVariablesInText(tooltipValueContent, {
      value: formatPercentage(value.value) + '%',
    });
  }

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
        subject={replaceVariablesInText(subject, tooltipVars)}
        thresholdValues={data.thresholdValues}
        filterBelow={filterBelow}
      >
        <Box
          flexGrow={1}
          spacingHorizontal={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Markdown
            content={replaceVariablesInText(tooltipContent, tooltipVars)}
          />
          <InlineText fontWeight="bold">{tooltipValue}</InlineText>
        </Box>
      </TooltipSubject>
    </TooltipContent>
  );
}
