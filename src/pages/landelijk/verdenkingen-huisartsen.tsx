import useSWR from 'swr';

import BarScale from 'components/barScale';
import Metadata from 'components/metadata';
import GraphHeader from 'components/graphHeader';
import DateReported from 'components/dateReported';
import { FCWithLayout } from 'components/layout';
import { getNationalLayout } from 'components/layout/NationalLayout';
import { LineChart } from 'components/tiles/index';

import Arts from 'assets/arts.svg';

import formatNumber from 'utils/formatNumber';

import siteText from 'locale';

import { RioolwaterMetingen } from 'types/data';

const text: typeof siteText.verdenkingen_huisartsen =
  siteText.verdenkingen_huisartsen;

export function SuspectedPatientsBarScale(props: {
  data: RioolwaterMetingen | undefined;
}) {
  const { data } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={140}
      screenReaderText={text.screen_reader_graph_content}
      value={data.last_value.incidentie as number | null}
      id="verdenkingen_huisartsen"
      rangeKey="incidentie"
      gradient={[
        {
          color: '#3391CC',
          value: 0,
        },
      ]}
    />
  );
}

const SuspectedPatients: FCWithLayout = () => {
  const { data: state } = useSWR(`/json/NL.json`);

  const data: RioolwaterMetingen | undefined = state?.verdenkingen_huisartsen;

  const total = state?.verdenkingen_huisartsen?.last_value?.geschat_aantal;

  return (
    <>
      <GraphHeader Icon={Arts} title={text.title} />

      <p>{text.text}</p>

      <SuspectedPatientsBarScale data={data} />

      {total && (
        <h3>
          Geschat aantal patiënten met verdenking van COVID-19:{' '}
          <span style={{ color: '#01689b' }}>{formatNumber(total)}</span>
        </h3>
      )}

      {data?.last_value?.incidentie !== null && (
        <DateReported
          datumsText={text.datums}
          dateInsertedUnix={data?.last_value?.date_of_insertion_unix}
          dateUnix={data?.last_value?.week_unix}
        />
      )}

      <h4>{text.fold_title}</h4>
      <p>{text.fold}</p>

      <h4>{text.graph_title}</h4>

      {data && (
        <>
          <LineChart
            values={data.values.map((value) => ({
              value: value.incidentie,
              date: value.week_unix,
            }))}
          />

          <Metadata dataSource={text.bron} />
        </>
      )}
    </>
  );
};

SuspectedPatients.getLayout = getNationalLayout();

export default SuspectedPatients;
