import useSWR from 'swr';

import BarScale from 'components/barScale';
import Collapse from 'components/collapse';
import Metadata from 'components/metadata';
import GraphContainer from 'components/graphContainer';
import GraphContent from 'components/graphContent';
import GraphHeader from 'components/graphHeader';
import DateReported from 'components/dateReported';
import Arts from 'assets/arts.svg';
import { LineChart } from './index';

import formatDecimal from 'utils/formatNumber';

import siteText from 'locale';

import { RioolwaterMetingen } from 'types/data';

export const SuspectedPatients: React.FC = () => {
  const { data: state } = useSWR(`/json/NL.json`);

  const text: typeof siteText.verdenkingen_huisartsen =
    siteText.verdenkingen_huisartsen;
  const data: RioolwaterMetingen | undefined = state?.verdenkingen_huisartsen;

  const total = state?.verdenkingen_huisartsen?.last_value?.geschat_aantal;

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader Icon={Arts} title={text.title} />

        <p>{text.text}</p>

        {data && (
          <BarScale
            min={0}
            max={140}
            screenReaderText={text.screen_reader_graph_content}
            value={data.last_value.incidentie as number | null}
            id="verdenkingen_huisartsen"
            dataKey="incidentie"
            gradient={[
              {
                color: '#3391CC',
                value: 0,
              },
            ]}
          />
        )}

        {total && (
          <h3>
            Geschat aantal patiënten met verdenking van COVID-19:{' '}
            <span style={{ color: '#01689b' }}>{formatDecimal(total)}</span>
          </h3>
        )}

        {data?.last_value?.incidentie !== null && (
          <DateReported
            datumsText={text.datums}
            dateInsertedUnix={data?.last_value?.date_of_insertion_unix}
            dateUnix={data?.last_value?.week_unix}
          />
        )}
      </GraphContent>
      <Collapse
        openText={text.open}
        sluitText={text.sluit}
        piwikName="Aantal patiënten waarvan huisartsen COVID-19 vermoeden"
        piwikAction="landelijk"
      >
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
      </Collapse>
    </GraphContainer>
  );
};
