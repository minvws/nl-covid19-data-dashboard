import {
  assert,
  ChoroplethThresholdsValue,
  GmCollectionVaccineCoveragePerAgeGroup,
  VrCollectionVaccineCoveragePerAgeGroup,
} from '@corona-dashboard/common';
import React, { useMemo, useState } from 'react';
import { hasValueAtKey, isDefined } from 'ts-is-present';
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

interface VaccineCoveragePerMunicipalityProps {
  data: {
    gm: GmCollectionVaccineCoveragePerAgeGroup[];
    vr: VrCollectionVaccineCoveragePerAgeGroup[];
  };
}
type AgeGroup = '12+' | '12-17' | '18+';

export function VaccineCoveragePerMunicipality({
  data,
}: VaccineCoveragePerMunicipalityProps) {
  const { siteText } = useIntl();
  const [selectedMap, setSelectedMap] = useState<RegionControlOption>('gm');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>('18+');
  const reverseRouter = useReverseRouter();

  return (
    <ChoroplethTile
      title={siteText.vaccinaties.choropleth_vaccinatie_graad_per_gm.title}
      description={
        siteText.vaccinaties.choropleth_vaccinatie_graad_per_gm.description
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
            metricProperty: 'fully_vaccinated_percentage',
            getCustomFillColor: (d, colorScale) => {
              console.log(
                d,
                d.fully_vaccinated_percentage
                  ? d.fully_vaccinated_percentage
                  : d.fully_vaccinated_percentage_label
              );

              return colorScale(d.fully_vaccinated_percentage);
            },
          }}
          dataOptions={{
            isPercentage: true,
            // TODO: replace with vaccinaties pagina
            getLink: (gmcode) => reverseRouter.gm.index(gmcode),
            tooltipVariables: {
              age_group: siteText.vaccinaties.age_groups[selectedAgeGroup],
            },
          }}
          formatTooltip={(context) => <ChoroplethTooltip data={context} />}
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
            metricProperty: 'fully_vaccinated_percentage',
            getCustomFillColor: (value, colorScale) => {
              console.log(value);
              return colorScale(value);
            },
          }}
          dataOptions={{
            isPercentage: true,
            // TODO: replace with vaccinaties pagina
            getLink: (gmcode) => reverseRouter.vr.index(gmcode),
            tooltipVariables: {
              age_group: siteText.vaccinaties.age_groups[selectedAgeGroup],
            },
          }}
          formatTooltip={(context) => <ChoroplethTooltip data={context} />}
        />
      )}
    </ChoroplethTile>
  );
}

type ChoroplethTooltipProps = {
  data: TooltipData<
    | GmCollectionVaccineCoveragePerAgeGroup
    | VrCollectionVaccineCoveragePerAgeGroup
  >;
};

function ChoroplethTooltip(props: ChoroplethTooltipProps) {
  const { data } = props;

  const { siteText } = useIntl();

  const text = siteText.choropleth_tooltip;

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

  let value;
  if (data.dataItem[data.dataConfig.metricProperty]) {
    value = data.dataItem[data.dataConfig.metricProperty] + '%';
  } else if (data.dataItem.fully_vaccinated_percentage_label) {
    value = data.dataItem.fully_vaccinated_percentage_label + '%';
  } else {
    value = '–';
  }

  // these labels are always '>=90' or '<=10', parse to number
  const getParsedPercentageLabel = (str: string | null) => {
    if (str === null) return str;
    const n = Number(str.slice(-2));
    return Number.isNaN(n) ? null : n;
  };

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
        filterBelow={
          data.dataItem[data.dataConfig.metricProperty] ??
          getParsedPercentageLabel(
            data.dataItem.fully_vaccinated_percentage_label
          ) ??
          null
        }
      >
        <Box
          flexGrow={1}
          display="flex"
          flexDirection="row"
          flexWrap="nowrap"
          alignItems="center"
          justifyContent="space-between"
        >
          <Markdown
            content={replaceVariablesInText(tooltipContent, tooltipVars)}
          />
          <InlineText fontWeight="bold">{value}</InlineText>
        </Box>
      </TooltipSubject>
    </TooltipContent>
  );
}
