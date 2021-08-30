import {
  assert,
  GmCollectionVaccineCoveragePerAgeGroup,
  VrCollectionVaccineCoveragePerAgeGroup,
} from '@corona-dashboard/common';
import React, { useCallback, useMemo, useState } from 'react';
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
import { RichContentSelect } from '~/components/rich-content-select/rich-content-select';
import { InlineText, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { parseBirthyearRange } from './logic/parse-birthyear-range';

const AGE_GROUPS = [
  {
    ageGroup: '12+',
    birthyearRange: '-2009',
  },
  {
    ageGroup: '12-17',
    birthyearRange: '2004-2009',
  },
  {
    ageGroup: '18+',
    birthyearRange: '-2003',
  },
] as const;

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

  const parseLabel = (
    label: string
  ): { sign: string; value: number } | null => {
    const regex = /^(<|>)[=]([0-9]{1,2})$/;
    const match = label.match(regex);

    if (match) {
      // match[0] is the full match
      const sign = match[1];
      const value = Number(match[2]);

      return isPresent(value) && !Number.isNaN(value) ? { sign, value } : null;
    }

    return null;
  };

  const getSecondaryMetric = useCallback((d: ChoroplethDataItem) => {
    if ('fully_vaccinated_percentage_label' in d) {
      return isPresent(d.fully_vaccinated_percentage_label)
        ? parseLabel(d.fully_vaccinated_percentage_label)
        : null;
    }

    return null;
  }, []);

  const options = useMemo(
    () =>
      AGE_GROUPS.map((el) => {
        const birthyearRange = parseBirthyearRange(el.birthyearRange);

        if (isPresent(birthyearRange)) {
          return {
            value: el.ageGroup,
            label: siteText.vaccinaties.age_groups[el.ageGroup],
            content: (
              <Box>
                <Text fontWeight="bold">
                  {siteText.vaccinaties.age_groups[el.ageGroup]}
                </Text>
                <Text>
                  {replaceVariablesInText(
                    siteText.vaccinaties.birthyear_ranges[birthyearRange.type],
                    birthyearRange
                  )}
                </Text>
              </Box>
            ),
          };
        }
      }).filter(isPresent),
    [siteText.vaccinaties.age_groups, siteText.vaccinaties.birthyear_ranges]
  );

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

          <RichContentSelect
            label={
              siteText.vaccinaties.choropleth_vaccinatie_graad_per_gm
                .dropdown_label
            }
            visuallyHiddenLabel
            initialValue={'18+'}
            options={options}
            onChange={(option) => setSelectedAgeGroup(option.value)}
          />
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

function ChoroplethTooltip<T extends ChoroplethDataItem>(
  props: ChoroplethTooltipProps<T>
) {
  const { data, getSecondaryMetric } = props;

  const { siteText } = useIntl();
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
    tooltipValue = value + '%';
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
      value: value.value + '%',
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
