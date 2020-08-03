import { useContext } from 'react';

import BarScale from 'components/barScale';
import Collapse from 'components/collapse';
import Metadata from 'components/metadata';
import GraphContainer from 'components/graphContainer';
import GraphContent from 'components/graphContent';
import GraphHeader from 'components/graphHeader';
import DateReported from 'components/dateReported';
import Arts from 'assets/arts.svg';
import { LineChart } from './index';

import formatDecimal from 'utils/formatDec';

import siteText from 'locale';
import { store } from 'store';

import { RioolwaterMetingen } from 'types/data';

export const SuspectedPatients: React.FC = () => {
  const globalState = useContext(store);
  const { state } = globalState;

  const text: typeof siteText.verdenkingen_huisartsen =
    siteText.verdenkingen_huisartsen;
  const data: RioolwaterMetingen | undefined =
    state?.NL?.verdenkingen_huisartsen;

  const total = state?.NL?.verdenkingen_huisartsen?.last_value?.geschat_aantal;

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader Icon={Arts} title={text.title.translation} />

        <p>{text.text.translation}</p>

        {data && (
          <BarScale
            min={0}
            max={140}
            screenReaderText={text.screen_reader_graph_content.translation}
            value={data.last_value.incidentie as number | null}
            id="verdenkingen_huisartsen"
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
            datumsText={text.datums.translation}
            dateInsertedUnix={data?.last_value?.date_of_insertion_unix}
            dateUnix={data?.last_value?.week_unix}
          />
        )}
      </GraphContent>
      <Collapse
        openText={text.open.translation}
        sluitText={text.sluit.translation}
        piwikName="Aantal patiënten waarvan huisartsen COVID-19 vermoeden"
        piwikAction="landelijk"
      >
        <h4>{text.fold_title.translation}</h4>
        <p>{text.fold.translation}</p>

        <h4>{text.graph_title.translation}</h4>

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
