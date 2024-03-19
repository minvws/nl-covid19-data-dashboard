import { NlVaccineAdministeredPlannedValue, ArchivedNlVaccineCoverage } from '@corona-dashboard/common';
import React, { Dispatch, SetStateAction, useState, useMemo } from 'react';
import { Box } from '~/components/base';
import { isDefined } from 'ts-is-present';
import { FullscreenChartTile } from '~/components/fullscreen-chart-tile';
import { Markdown } from '~/components/markdown';
import { TimelineEventConfig } from '~/components/time-series-chart/components/timeline';
import { Heading } from '~/components/typography';
import { useIntl } from '~/intl';
import { SiteText } from '~/locale';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useFormatDateRange } from '~/utils/use-format-date-range';
import { AdministrationData } from './data-selection/select-administration-data';
import { ActiveVaccinationChart, VaccinationChartControls, VaccinationsOverTimeChart } from './vaccinations-over-time-chart';
import { space } from '~/style/theme';

function useTileData(
  activeChart: ActiveVaccinationChart,
  text: SiteText['pages']['vaccinations_page']['nl'],
  insertionDate: number,
  data: ArchivedNlVaccineCoverage | AdministrationData
) {
  if (activeChart === 'coverage') {
    const metadataData = data as ArchivedNlVaccineCoverage;
    const metadata = {
      source: text.bronnen.rivm,
      date: insertionDate,
      dateOfInsertion: insertionDate,
      /**
       * We use the .date_end_unix for the "start" property to accurately represent the information for the graph
       * The metadata component would display a date which is a week early if we use the .date_start_unix
       * and that is not present in the graph
       */
      timeInterval: { start: metadataData.values[0].date_end_unix, end: metadataData.values[data.values.length - 1].date_end_unix },
      isArchivedGraph: true,
    };
    const description = text.grafiek_gevaccineerd_door_de_tijd_heen.omschrijving;
    return [metadata, description] as const;
  }
  const metadata = {
    source: text.bronnen.rivm,
    date: insertionDate,
    dateOfInsertion: insertionDate,
    timeInterval: { start: data.values[0].date_unix, end: data.values[data.values.length - 1].date_unix },
    isArchivedGraph: true,
  };
  const description = text.grafiek.omschrijving;
  return [metadata, description] as const;
}

interface VaccinationsOverTimeTileProps {
  coverageData?: ArchivedNlVaccineCoverage;
  administrationData: AdministrationData;
  vaccineAdministeredPlannedLastValue: NlVaccineAdministeredPlannedValue;
  timelineEvents: Partial<Record<ActiveVaccinationChart, TimelineEventConfig[]>>;
  text: SiteText['pages']['vaccinations_page']['nl'];
}

export function VaccinationsOverTimeTile(props: VaccinationsOverTimeTileProps) {
  const { coverageData, administrationData, timelineEvents, vaccineAdministeredPlannedLastValue, text } = props;

  const { commonTexts, formatNumber } = useIntl();

  const [activeVaccinationChart, setActiveVaccinationChart] = useState<ActiveVaccinationChart>('coverage');

  const lastDate = useMemo<number>(
    () => (activeVaccinationChart === 'coverage' && isDefined(coverageData) ? coverageData.last_value.date_unix : administrationData.last_value.date_end_unix),
    [activeVaccinationChart, coverageData, administrationData.last_value.date_end_unix]
  );

  const [metadata, description] = useTileData(
    activeVaccinationChart,
    text,
    lastDate,
    activeVaccinationChart === 'coverage' && isDefined(coverageData) ? coverageData : administrationData
  );

  const roundedMillion = Math.floor((administrationData.last_value.total / 1_000_000) * 10) / 10;

  const [dateFromText, dateToText] = useFormatDateRange(vaccineAdministeredPlannedLastValue.date_start_unix, vaccineAdministeredPlannedLastValue.date_end_unix);

  return (
    <FullscreenChartTile metadata={metadata}>
      <ChartTileHeader
        title={text.vaccinations_over_time_tile.title}
        description={replaceVariablesInText(description, {
          total_vaccines: `${formatNumber(roundedMillion)} ${commonTexts.common.miljoen}`,
          planned_vaccines: formatNumber(vaccineAdministeredPlannedLastValue.doses),
          date_from: dateFromText,
          date_to: dateToText,
        })}
        activeVaccinationChart={activeVaccinationChart}
        setActiveVaccinationChart={setActiveVaccinationChart}
      />
      <VaccinationsOverTimeChart
        coverageData={coverageData}
        administrationData={administrationData}
        activeChart={activeVaccinationChart}
        timelineEvents={timelineEvents}
        text={text}
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
  const { title, description, activeVaccinationChart, setActiveVaccinationChart } = props;
  return (
    <Box spacing={3} paddingBottom={space[3]}>
      <Heading level={3}>{title}</Heading>
      <Box display="inline-table" alignSelf="flex-start">
        <VaccinationChartControls onChange={setActiveVaccinationChart} initialChart={activeVaccinationChart} />{' '}
      </Box>

      {description && (
        <Box maxWidth="maxWidthText">
          <Markdown content={description} />
        </Box>
      )}
    </Box>
  );
}
