import useSWR from 'swr';

import BarScale from 'components/barScale';
import Collapse from 'components/collapse';
import Metadata from 'components/metadata';
import Legenda from 'components/legenda';
import GraphContainer from 'components/graphContainer';
import GraphContent from 'components/graphContent';
import GraphHeader from 'components/graphHeader';
import DateReported from 'components/dateReported';
import Repro from 'assets/reproductiegetal.svg';
import { AreaChart } from './index';

import siteText from 'locale';

import { ReproductionIndex as ReproductionIndexData } from 'types/data';

export const ReproductionIndex: React.FC = () => {
  const { data: state } = useSWR(`/json/NL.json`);

  const text: typeof siteText.reproductiegetal = siteText.reproductiegetal;
  const lastKnownValidData: ReproductionIndexData | undefined =
    state?.reproduction_index_last_known_average;

  const data: ReproductionIndexData | undefined = state?.reproduction_index;

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader Icon={Repro} title={text.title} />
        <p>{text.text}</p>
        {data && (
          <BarScale
            min={0}
            max={2}
            screenReaderText={text.screen_reader_graph_content}
            kritiekeWaarde={1}
            value={lastKnownValidData?.last_value?.reproduction_index_avg}
            id="repro"
            dataKey="reproduction_index_avg"
            gradient={[
              {
                color: '#69c253',
                value: 0,
              },
              {
                color: '#69c253',
                value: 1,
              },
              {
                color: '#D3A500',
                value: 1.0104,
              },
              {
                color: '#f35065',
                value: 1.125,
              },
            ]}
          />
        )}

        <DateReported
          datumsText={text.datums}
          dateUnix={lastKnownValidData?.last_value?.date_of_report_unix}
          dateInsertedUnix={
            lastKnownValidData?.last_value?.date_of_insertion_unix
          }
        />
      </GraphContent>
      <Collapse
        openText={text.open}
        sluitText={text.sluit}
        piwikName="Reproductiegetal"
        piwikAction="landelijk"
      >
        <h4>{text.fold_title}</h4>
        <p>{text.fold}</p>

        <img
          width={315}
          height={100}
          loading="lazy"
          src="/images/reproductie-explainer.svg"
          alt="Ondersteunende afbeelding bij bovenstaande uitleg"
        />

        <h4>{text.graph_title}</h4>
        {data?.values && (
          <AreaChart
            data={data.values.map((value) => ({
              avg: value.reproduction_index_avg,
              min: value.reproduction_index_low,
              max: value.reproduction_index_high,
              date: value.date_of_report_unix,
            }))}
            minY={0}
            maxY={4}
            signaalwaarde={1}
            rangeLegendLabel={text.rangeLegendLabel}
            lineLegendLabel={text.lineLegendLabel}
          />
        )}

        <Legenda>
          <li className="blue">{text.legenda_r}</li>
          <li className="gray square">{text.legenda_marge}</li>
        </Legenda>

        <Metadata dataSource={text.bron} />
      </Collapse>
    </GraphContainer>
  );
};
