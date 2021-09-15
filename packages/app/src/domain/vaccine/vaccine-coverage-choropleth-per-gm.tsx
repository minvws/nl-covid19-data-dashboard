import {
  assert,
  GmCollectionVaccineCoveragePerAgeGroup,
  VrCollectionVaccineCoveragePerAgeGroup,
} from '@corona-dashboard/common';
import { useMemo, useState } from 'react';
import { hasValueAtKey, isDefined } from 'ts-is-present';
import { Box } from '~/components/base';
import { RegionControlOption } from '~/components/chart-region-controls';
import { DynamicChoropleth } from '~/components/choropleth';
import { ChoroplethTile } from '~/components/choropleth-tile';
import {
  ChoroplethDataItem,
  MapType,
  thresholds,
} from '~/components/choropleth/logic';
import {
  TooltipContent,
  TooltipSubject,
} from '~/components/choropleth/tooltips';
import { TooltipData } from '~/components/choropleth/tooltips/types';
import { Markdown } from '~/components/markdown';
import { InlineText, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { SiteText } from '~/locale';
import { colors } from '~/style/theme';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { AgeGroup, AgeGroupSelect } from './components/age-group-select';
import { getVaccineCoverageDisplayValues } from './logic/get-vaccine-coverage-display-values';

interface VaccineCoverageChoroplethPerGmProps {
  data: {
    gm: GmCollectionVaccineCoveragePerAgeGroup[];
    vr: VrCollectionVaccineCoveragePerAgeGroup[];
  };
}

export function VaccineCoverageChoroplethPerGm({
  data,
}: VaccineCoverageChoroplethPerGmProps) {
  const { siteText } = useIntl();
  const [selectedMap, setSelectedMap] = useState<RegionControlOption>('gm');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>('18+');
  const reverseRouter = useReverseRouter();

  const variables = {
    regio: siteText.vaccinaties.nl_choropleth_vaccinatie_graad[selectedMap],
  };

  return (
    <ChoroplethTile
      title={replaceVariablesInText(
        siteText.vaccinaties.nl_choropleth_vaccinatie_graad.titel,
        variables
      )}
      description={
        <>
          <Text>
            {replaceVariablesInText(
              siteText.vaccinaties.nl_choropleth_vaccinatie_graad.description,
              variables
            )}
          </Text>

          <AgeGroupSelect onChange={setSelectedAgeGroup} />
        </>
      }
      legend={{
        thresholds: thresholds.gm.fully_vaccinated_percentage,
        title:
          siteText.vaccinaties.nl_choropleth_vaccinatie_graad.legenda_titel,
      }}
      metadata={{
        source: siteText.vaccinaties.vaccination_coverage.bronnen.rivm,
        date: data[selectedMap][0].date_unix,
      }}
      chartRegion={selectedMap}
      onChartRegionChange={setSelectedMap}
    >
      {selectedMap === 'gm' && (
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

      {selectedMap === 'vr' && (
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
    </ChoroplethTile>
  );
}

type ChoroplethTooltipProps<T extends ChoroplethDataItem> = {
  data: TooltipData<T>;
  getValues?: (
    d: T,
    text: SiteText['choropleth_tooltip'],
    map: MapType,
    formatPercentage: (value: number) => string
  ) => Partial<{ [key in keyof T]: string }>;
};

export function ChoroplethTooltip<T extends ChoroplethDataItem>(
  props: ChoroplethTooltipProps<T>
) {
  const { data, getValues } = props;

  const { siteText, formatPercentage } = useIntl();
  const text = siteText.choropleth_tooltip;

  const formattedValues = useMemo(() => {
    if (isDefined(getValues)) {
      return getValues(data.dataItem, text, data.map, formatPercentage);
    }

    const rawValue = data.dataItem[data.dataConfig.metricProperty] || null;
    return {
      [data.dataConfig.metricProperty]:
        typeof rawValue === 'number' ? formatPercentage(rawValue) + '%' : '–',
    };
  }, [data, text, getValues, formatPercentage]);

  assert(
    (data.dataConfig.metricProperty as string) in formattedValues,
    `No values found for ${data.dataConfig.metricProperty}. Did you provide a 'getValues' function which does not return the metric property this choropleth is about?`
  );

  const { [data.dataConfig.metricProperty]: mainValue, ...secondaryValues } =
    formattedValues;

  const subject = (
    text as unknown as Record<string, Record<string, Record<string, string>>>
  )[data.map]?.[data.dataConfig.metricProperty as string]?.subject;
  assert(
    isDefined(subject),
    `No tooltip subject found in siteText.choropleth_tooltip.${data.map}.${data.dataConfig.metricProperty}`
  );

  const tooltipVars = {
    ...data.dataItem,
    ...data.dataOptions.tooltipVariables,
  } as Record<string, string | number>;

  const filterBelow = data.dataItem[data.dataConfig.metricProperty] || null;

  const mainContent = (
    text as unknown as Record<string, Record<string, Record<string, string>>>
  )[data.map]?.[data.dataConfig.metricProperty as string]?.content;
  assert(
    isDefined(mainContent),
    `No tooltip content found in siteText.choropleth_tooltip.${data.map}.${data.dataConfig.metricProperty}`
  );

  const secondaryContent = Object.entries(secondaryValues).map(
    ([property, formattedValue]) => {
      const content = (
        text as unknown as Record<
          string,
          Record<string, Record<string, string>>
        >
      )[data.map]?.[property as string]?.content;
      assert(
        isDefined(content),
        `No tooltip content found in siteText.choropleth_tooltip.${data.map}.${property}`
      );
      return (
        <Box
          spacingHorizontal={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mr={13}
          pr={2}
          key={property}
        >
          <Markdown content={replaceVariablesInText(content, tooltipVars)} />
          <InlineText>{formattedValue as string}</InlineText>
        </Box>
      );
    }
  );

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
        noDataFillColor={colors.choroplethNoData}
      >
        <Box
          flexGrow={1}
          spacingHorizontal={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Markdown
            content={replaceVariablesInText(mainContent, tooltipVars)}
          />
          <InlineText fontWeight="bold">{mainValue}</InlineText>
        </Box>
      </TooltipSubject>
      {secondaryContent}
    </TooltipContent>
  );
}
