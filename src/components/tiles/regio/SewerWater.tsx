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

import { Regionaal } from 'types/data';
import { SafetyRegion } from 'pages/regio';

interface IProps {
  data: Regionaal;
  selectedRegio: SafetyRegion | undefined;
  contentRef: React.RefObject<HTMLHeadingElement>;
}

export const SewerWater: React.FC<IProps> = ({ data }) => {
  const text: typeof siteText.rioolwater_metingen =
    siteText.rioolwater_metingen;

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
            value={Number(
              data?.average_sewer_installation_per_region?.last_value.value
            )}
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

        {data?.average_sewer_installation_per_region?.values !== null && (
          <DateReported
            datumsText={text.datums}
            dateInsertedUnix={
              data?.average_sewer_installation_per_region?.last_value?.date_unix
            }
            dateUnix={
              data?.average_sewer_installation_per_region?.last_value?.date_unix
            }
          />
        )}
      </GraphContent>
      <Collapse
        openText={text.open}
        sluitText={text.sluit}
        piwikName="Rioolwatermeting"
        piwikAction="regionaal"
      >
        <h4>{text.fold_title}</h4>
        <p>{text.fold}</p>

        <h4>{text.graph_title}</h4>

        {data?.average_sewer_installation_per_region?.values && (
          <>
            {data.average_sewer_installation_per_region.values.toString()}
            <MultiDateLineChart
              values={data?.average_sewer_installation_per_region?.values.map(
                (value) => {
                  return { ...value, date: value.date_unix };
                }
              )}
              secondaryValues={data.results_per_sewer_installation_per_region?.values.map(
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
