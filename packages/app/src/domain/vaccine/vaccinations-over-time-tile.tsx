import {
  NlVaccineAdministeredPlannedValue,
  NlVaccineCoverage,
} from '@corona-dashboard/common';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Box } from '~/components/base';
import { FullscreenChartTile } from '~/components/fullscreen-chart-tile';
import { Markdown } from '~/components/markdown';
import { TimelineEventConfig } from '~/components/time-series-chart/components/timeline';
import { Heading } from '~/components/typography';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useFormatDateRange } from '~/utils/use-format-date-range';
import { DeliveryAndAdministrationData } from './data-selection/select-delivery-and-administration-data';
import {
  ActiveVaccinationChart,
  VaccinationChartControls,
  VaccinationsOverTimeChart,
} from './vaccinations-over-time-chart';

function useTileData(activeChart: ActiveVaccinationChart) {
  const { siteText } = useIntl();

  const text = siteText.pages.vaccinations.nl;

  if (activeChart === 'coverage') {
    const metadata = {
      source: text.bronnen.rivm,
    };
    const description =
      text.grafiek_gevaccineerd_door_de_tijd_heen.omschrijving;
    return [metadata, description] as const;
  }
  const metadata = {
    source: text.bronnen.rivm,
  };
  const description = text.grafiek.omschrijving;
  return [metadata, description] as const;
}

interface VaccinationsOverTimeTileProps {
  coverageData?: NlVaccineCoverage;
  deliveryAndAdministrationData: DeliveryAndAdministrationData;
  vaccineAdministeredPlannedLastValue: NlVaccineAdministeredPlannedValue;
  timelineEvents: Partial<
    Record<ActiveVaccinationChart, TimelineEventConfig[]>
  >;
}

export function VaccinationsOverTimeTile(props: VaccinationsOverTimeTileProps) {
  const {
    coverageData,
    deliveryAndAdministrationData,
    timelineEvents,
    vaccineAdministeredPlannedLastValue,
  } = props;

  const { siteText, formatNumber } = useIntl();

  const [activeVaccinationChart, setActiveVaccinationChart] =
    useState<ActiveVaccinationChart>('coverage');

  const [metadata, description] = useTileData(activeVaccinationChart);

  const roundedMillion =
    Math.floor(
      (deliveryAndAdministrationData.last_value.total / 1_000_000) * 10
    ) / 10;

  const [dateFromText, dateToText] = useFormatDateRange(
    vaccineAdministeredPlannedLastValue.date_start_unix,
    vaccineAdministeredPlannedLastValue.date_end_unix
  );

  return (
    <FullscreenChartTile metadata={metadata}>
      <ChartTileHeader
        title={siteText.pages.vaccinations.nl.vaccinations_over_time_tile.title}
        description={replaceVariablesInText(description, {
          total_vaccines: `${formatNumber(roundedMillion)} ${
            siteText.common.miljoen
          }`,
          planned_vaccines: formatNumber(
            vaccineAdministeredPlannedLastValue.doses
          ),
          date_from: dateFromText,
          date_to: dateToText,
        })}
        activeVaccinationChart={activeVaccinationChart}
        setActiveVaccinationChart={setActiveVaccinationChart}
      />
      <VaccinationsOverTimeChart
        coverageData={coverageData}
        deliveryAndAdministrationData={deliveryAndAdministrationData}
        activeChart={activeVaccinationChart}
        timelineEvents={timelineEvents}
      />
    </FullscreenChartTile>
  );
}

interface ChartTileHeaderProps {
  title: string;
  description?: string;
  activeVaccinationChart: ActiveVaccinationChart;
  setActiveVaccinationChart: Dispatch<SetStateAction<ActiveVaccinationChart>>;
}

function ChartTileHeader(props: ChartTileHeaderProps) {
  const {
    title,
    description,
    activeVaccinationChart,
    setActiveVaccinationChart,
  } = props;
  return (
    <Box spacing={3} pb={3}>
      <Heading level={3}>{title}</Heading>
      <Box display="inline-table" alignSelf="flex-start">
        <VaccinationChartControls
          onChange={setActiveVaccinationChart}
          initialChart={activeVaccinationChart}
        />{' '}
      </Box>

      {description && (
        <Box maxWidth="maxWidthText">
          <Markdown content={description} />
        </Box>
      )}
    </Box>
  );
}
