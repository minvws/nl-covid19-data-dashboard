import useSWR from 'swr';

import BarScale from 'components/barScale';
import Metadata from 'components/metadata';
import GraphHeader from 'components/graphHeader';
import DateReported from 'components/dateReported';
import { FCWithLayout } from 'components/layout';
import { getNationalLayout } from 'components/layout/NationalLayout';
import { LineChart } from 'components/tiles/index';

import RioolwaterMonitoring from 'assets/rioolwater-monitoring.svg';

import siteText from 'locale';

import { RioolwaterMetingen } from 'types/data';

const text: typeof siteText.rioolwater_metingen = siteText.rioolwater_metingen;

export function SewerWaterBarScale(props: {
  data: RioolwaterMetingen | undefined;
}) {
  const { data } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={100}
      screenReaderText={text.screen_reader_graph_content}
      value={Number(data.last_value.average)}
      id="rioolwater_metingen"
      rangeKey="average"
      gradient={[
        {
          color: '#3391CC',
          value: 0,
        },
      ]}
    />
  );
}

const SewerWater: FCWithLayout = () => {
  const { data: state } = useSWR(`/json/NL.json`);

  const data: RioolwaterMetingen | undefined = state?.rioolwater_metingen;

  return (
    <>
      <GraphHeader Icon={RioolwaterMonitoring} title={text.title} />

      <p>{text.text}</p>

      <SewerWaterBarScale data={data} />

      {data?.last_value?.average !== null && (
        <DateReported
          datumsText={text.datums}
          dateInsertedUnix={data?.last_value?.date_of_insertion_unix}
          dateUnix={data?.last_value?.week_unix}
        />
      )}

      <h4>{text.fold_title}</h4>
      <p>{text.fold}</p>

      <h4>{text.graph_title}</h4>

      {data?.values && (
        <>
          <LineChart
            values={data.values.map((value) => ({
              value: Number(value.average),
              date: value.week_unix,
            }))}
          />

          <Metadata dataSource={text.bron} />
        </>
      )}
    </>
  );
};

SewerWater.getLayout = getNationalLayout();

export default SewerWater;
