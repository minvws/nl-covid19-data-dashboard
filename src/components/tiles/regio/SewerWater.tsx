import useSWR from 'swr';

import BarScale from 'components/barScale';
import Collapse from 'components/collapse';
import Metadata from 'components/metadata';
import GraphContainer from 'components/graphContainer';
import GraphContent from 'components/graphContent';
import GraphHeader from 'components/graphHeader';
import DateReported from 'components/dateReported';
import RioolwaterMonitoring from 'assets/rioolwater-monitoring.svg';
import MultiDateLineChart from 'components/lineChart/multiDateLine';

import siteText from 'locale';

import {
  RioolwaterMetingen,
  Regionaal,
  SewerResultsPerInstallation,
} from 'types/data';
import { SafetyRegion } from 'pages/regio';

interface IProps {
  data: Regionaal;
  selectedRegio: SafetyRegion | undefined;
  contentRef: React.RefObject<HTMLHeadingElement>;
}

export const SewerWater: React.FC<IProps> = ({ data }) => {
  const averageKey = 'infected_total_counts_per_region';
  const text: typeof siteText.rioolwater_metingen =
    siteText.rioolwater_metingen;
  const sewerResultsPerInstallation: SewerResultsPerInstallation | undefined =
    data?.results_per_region?.results_per_sewer_installation_per_region;

  console.log(sewerResultsPerInstallation);

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader Icon={RioolwaterMonitoring} title={text.title} />

        <p>{text.text}</p>

        {data && (
          <BarScale
            min={0}
            max={100}
            screenReaderText={text.screen_reader_graph_content}
            value={Number(data?.results_per_region?.last_value[averageKey])}
            id="rioolwater_metingen"
            dataKey="average"
            gradient={[
              {
                color: '#3391CC',
                value: 0,
              },
            ]}
          />
        )}

        {data?.results_per_region?.last_value[averageKey] !== null && (
          <DateReported
            datumsText={text.datums}
            dateInsertedUnix={
              data?.results_per_region?.last_value?.date_of_insertion_unix
            }
            dateUnix={
              data?.results_per_region?.last_value?.date_of_insertion_unix
            }
          />
        )}
      </GraphContent>
      <Collapse
        openText={text.open}
        sluitText={text.sluit}
        piwikName="Rioolwatermeting"
        piwikAction="landelijk"
      >
        <h4>{text.fold_title}</h4>
        <p>{text.fold}</p>

        <h4>{text.graph_title}</h4>

        {data?.results_per_region
          ?.results_per_sewer_installation_per_region && (
          <>
            {
              data.results_per_region.results_per_sewer_installation_per_region
                .values
            }
            <MultiDateLineChart
              values={data?.results_per_region?.values.map((value) => ({
                value: Number(value[averageKey]),
                date: value.date_of_report_unix,
              }))}
              secondaryValues={data.results_per_region.results_per_sewer_installation_per_region.values.map(
                (installation) => {
                  return installation.values.map((value) => {
                    return { ...value, date: value.date_unix };
                  });
                }
              )}
            />

            <Metadata dataSource={text.bron} />
          </>
        )}
      </Collapse>
    </GraphContainer>
  );
};
