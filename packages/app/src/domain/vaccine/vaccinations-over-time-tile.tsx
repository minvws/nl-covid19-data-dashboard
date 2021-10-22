import { NlVaccineCoverage } from '@corona-dashboard/common';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Box } from '~/components/base';
import { FullscreenChartTile } from '~/components/fullscreen-chart-tile';
import { Markdown } from '~/components/markdown';
import { Heading } from '~/components/typography';
import { useIntl } from '~/intl';
import { DeliveryAndAdministrationData } from './data-selection/select-delivery-and-administration-data';
import {
  ActiveVaccinationChart,
  VaccinationChartControls,
  VaccinationsOverTimeChart,
} from './vaccinations-over-time-chart';

function useTileData(activeChart: ActiveVaccinationChart) {
  const { siteText } = useIntl();
  const text = siteText.vaccinaties;
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
}

export function VaccinationsOverTimeTile(props: VaccinationsOverTimeTileProps) {
  const { siteText } = useIntl();
  const { coverageData, deliveryAndAdministrationData } = props;
  const [activeVaccinationChart, setActiveVaccinationChart] =
    useState<ActiveVaccinationChart>('coverage');

  const [metadata, description] = useTileData(activeVaccinationChart);

  return (
    <FullscreenChartTile metadata={metadata}>
      <ChartTileHeader
        title={siteText.vaccinaties.vaccinations_over_time_tile.title}
        description={description}
        activeVaccinationChart={activeVaccinationChart}
        setActiveVaccinationChart={setActiveVaccinationChart}
      />
      <VaccinationsOverTimeChart
        coverageData={coverageData}
        deliveryAndAdministrationData={deliveryAndAdministrationData}
        activeChart={activeVaccinationChart}
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
