import dynamic from 'next/dynamic';

import BarScale from 'components/barScale';
import Collapse from 'components/collapse';
import Metadata from 'components/metadata';
import Legenda from 'components/legenda';
import GraphContainer from 'components/graphContainer';
import GraphContent from 'components/graphContent';
import GraphHeader from 'components/graphHeader';
import DateReported from 'components/dateReported';

import Arts from 'assets/arts.svg';
import Ziekenhuis from 'assets/ziekenhuis.svg';
import Ziektegolf from 'assets/ziektegolf.svg';
import Getest from 'assets/test.svg';
import Repro from 'assets/reproductiegetal.svg';
import CoronaVirus from 'assets/coronavirus.svg';
import Locatie from 'assets/locaties.svg';
import RioolwaterMonitoring from 'assets/rioolwater-monitoring.svg';

import formatDecimal from 'utils/formatDec';

import siteText from 'data/textNationaal.json';

import {
  IntakeIntensivecareMa,
  IntakeHospitalMa,
  InfectedPeopleDeltaNormalized,
  InfectedPeopleTotal,
  IntakeShareAgeGroups,
  InfectiousPeopleCount,
  ReproductionIndex as ReproductionIndexData,
  VerdenkingenHuisartsen,
  RioolwaterMetingen,
  DeceasedPeopleNurseryCountDaily,
} from 'types/data';

const AreaChart = dynamic(() => import('components/areaChart'));
const BarChart = dynamic(() => import('components/barChart'));
const LineChart = dynamic(() => import('components/lineChart'));

interface IIntakeIntensiveCare {
  data: IntakeIntensivecareMa | undefined;
  text: typeof siteText.ic_opnames_per_dag;
}

interface IIntakeHospital {
  data: IntakeHospitalMa | undefined;
  text: typeof siteText.ziekenhuisopnames_per_dag;
}

interface IPostivelyTestedPeople {
  delta: InfectedPeopleDeltaNormalized | undefined;
  total: InfectedPeopleTotal | undefined;
  age: IntakeShareAgeGroups | undefined;
  text: typeof siteText.positief_geteste_personen;
}

interface IInfectiousPeople {
  count: InfectiousPeopleCount | undefined;
  countNormalized: InfectiousPeopleCount | undefined;
  text: typeof siteText.besmettelijke_personen;
}

interface IReproductionIndex {
  data: ReproductionIndexData | undefined;
  text: typeof siteText.reproductiegetal;
}

interface ISuspectedPatients {
  data: VerdenkingenHuisartsen | undefined;
  text: typeof siteText.verdenkingen_huisartsen;
}

interface ISewerWater {
  data: RioolwaterMetingen | undefined;
  text: typeof siteText.rioolwater_metingen;
}

interface INursingHomeInfectedPeople {
  data: DeceasedPeopleNurseryCountDaily | undefined;
  text: typeof siteText.verpleeghuis_positief_geteste_personen;
}

interface INursingHomeInfectedLocations {
  newLocations: DeceasedPeopleNurseryCountDaily | undefined;
  totalLocations: DeceasedPeopleNurseryCountDaily | undefined;
  text: typeof siteText.verpleeghuis_besmette_locaties;
}

interface INursingHomeInfectedDeaths {
  data: DeceasedPeopleNurseryCountDaily | undefined;
  text: typeof siteText.verpleeghuis_oversterfte;
}

export const IntakeIntensiveCare: React.FC<IIntakeIntensiveCare> = (props) => {
  const { text, data } = props;

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader Icon={Arts} title={text.title} />
        <p>{text.text}</p>

        {data && (
          <BarScale
            min={0}
            max={30}
            gradient={[
              {
                color: '#69c253',
                value: 0,
              },
              {
                color: '#D3A500',
                value: 10,
              },
              {
                color: '#f35065',
                value: 20,
              },
            ]}
            screenReaderText={text.screen_reader_graph_content}
            kritiekeWaarde={text.signaalwaarde}
            value={data.last_value.moving_average_ic}
            id="ic"
          />
        )}

        <DateReported
          dateUnix={data?.last_value?.date_of_report_unix}
          hasDailyInterval
        />
      </GraphContent>

      <Collapse
        openText={text.open}
        sluitText={text.sluit}
        piwikAction="landelijk"
        piwikName="Intensive care-opnames per dag"
      >
        <h4>{text.fold_title}</h4>
        <p>{text.fold}</p>

        <h4>{text.graph_title}</h4>

        {data && (
          <>
            <LineChart
              values={data.values.map((value) => ({
                value: value.moving_average_ic,
                date: value.date_of_report_unix,
              }))}
              signaalwaarde={text.signaalwaarde}
            />

            <Metadata
              period={data.values.map((value) => value.date_of_report_unix)}
              dataSource={text.bron}
              lastUpdated={data.last_value.date_of_report_unix * 1000}
            />
          </>
        )}
      </Collapse>
    </GraphContainer>
  );
};

export const IntakeHospital: React.FC<IIntakeHospital> = (props) => {
  const { text, data } = props;

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader Icon={Ziekenhuis} title={text.title} />

        <p>{text.text}</p>

        {data && (
          <BarScale
            min={0}
            max={100}
            kritiekeWaarde={text.signaalwaarde}
            screenReaderText={text.screen_reader_graph_content}
            value={data.last_value.moving_average_hospital}
            id="opnames"
            gradient={[
              {
                color: '#69c253',
                value: 0,
              },
              {
                color: '#D3A500',
                value: 40,
              },
              {
                color: '#f35065',
                value: 90,
              },
            ]}
          />
        )}

        <DateReported
          dateUnix={data?.last_value?.date_of_report_unix}
          hasDailyInterval
        />
      </GraphContent>

      <Collapse
        openText={text.open}
        sluitText={text.sluit}
        piwikName="Ziekenhuisopnames per dag"
        piwikAction="landelijk"
      >
        <h4>{text.fold_title}</h4>
        <p>{text.fold}</p>

        <h4>{text.graph_title}</h4>
        {data && (
          <>
            <LineChart
              values={data.values.map((value) => ({
                value: value.moving_average_hospital,
                date: value.date_of_report_unix,
              }))}
              signaalwaarde={text.signaalwaarde}
            />

            <Metadata
              period={data.values.map((value) => value.date_of_report_unix)}
              dataSource={text.bron}
              lastUpdated={data.last_value.date_of_report_unix * 1000}
            />
          </>
        )}
      </Collapse>
    </GraphContainer>
  );
};

export const PostivelyTestedPeople: React.FC<IPostivelyTestedPeople> = (
  props
) => {
  const { text, delta, age, total } = props;

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader Icon={Getest} title={text.title} />
        <p>{text.text}</p>
        {delta && (
          <BarScale
            min={0}
            max={5}
            screenReaderText={text.screen_reader_graph_content}
            value={delta.last_value.infected_daily_increase}
            id="positief"
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
            {text.metric_title}{' '}
            <span style={{ color: '#01689b' }}>
              {formatDecimal(total.last_value.infected_daily_total)}
            </span>
          </h3>
        )}

        <DateReported
          dateUnix={delta?.last_value?.date_of_report_unix}
          hasDailyInterval
        />
      </GraphContent>
      <Collapse
        openText={text.open}
        sluitText={text.sluit}
        piwikAction="landelijk"
        piwikName="Positief geteste mensen"
      >
        <h4>{text.fold_title}</h4>
        <p>{text.fold}</p>

        <h4>{text.linechart_title}</h4>
        {delta && (
          <LineChart
            values={delta.values.map((value) => ({
              value: value.infected_daily_increase,
              date: value.date_of_report_unix,
            }))}
          />
        )}

        <h4>{text.graph_title}</h4>
        {age && (
          <>
            <BarChart
              keys={['0 tot 20', '20 tot 40', '40 tot 60', '60 tot 80', '80+']}
              data={age.values.map(
                (value) => value.infected_per_agegroup_increase
              )}
            />
            <Metadata
              dataSource={text.bron}
              lastUpdated={age.last_value.date_of_report_unix * 1000}
            />
          </>
        )}
      </Collapse>
    </GraphContainer>
  );
};

export const InfectiousPeople: React.FC<IInfectiousPeople> = (props) => {
  const { count, countNormalized, text } = props;

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader Icon={Ziektegolf} title={text.title} />
        <p>{text.text}</p>

        {countNormalized && (
          <BarScale
            min={0}
            max={50}
            screenReaderText={text.screen_reader_graph_content}
            value={countNormalized.last_value.infectious_avg_normalized}
            id="besmettelijk"
            gradient={[
              {
                color: '#3391CC',
                value: 0,
              },
            ]}
          />
        )}

        <p className={'regioDataLoading'}>
          Signaalwaarde volgt in <time dateTime={'2020-07'}>juli 2020</time>.
        </p>

        {count && (
          <h3>
            {text.metric_title}{' '}
            <span style={{ color: '#01689b' }}>
              {formatDecimal(count.last_value.infectious_avg)}
            </span>
          </h3>
        )}

        <DateReported dateUnix={count?.last_value?.date_of_report_unix} />
      </GraphContent>

      <Collapse
        openText={text.open}
        sluitText={text.sluit}
        piwikName="Aantal besmettelijke mensen"
        piwikAction="landelijk"
      >
        <h4>{text.fold_title}</h4>
        <p>{text.fold}</p>

        {count && (
          <Metadata
            dataSource={text.bron}
            lastUpdated={count.last_value.date_of_report_unix * 1000}
          />
        )}
      </Collapse>
    </GraphContainer>
  );
};

export const ReproductionIndex: React.FC<IReproductionIndex> = (props) => {
  const { data, text } = props;

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
            kritiekeWaarde={text.signaalwaarde}
            value={data.last_value.reproduction_index_avg}
            id="repro"
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

        <DateReported dateUnix={data?.last_value?.date_of_report_unix} />
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
          <li className="blue">
            De effectieve R is een schatting. Voor recente R schattingen is de
            betrouwbaarheid niet groot, daarom loopt de R-lijn loopt niet door
            in de laatste twee weken.
          </li>
          <li className="gray square">
            De onzekerheidsmarge toont met zekerheid tussen welke waarden de R
            zich bevindt. Dit wordt wekelijks bijgewerkt.
          </li>
        </Legenda>

        <Metadata
          period={data?.values.map((value) => value.date_of_report_unix)}
          dataSource={text.bron}
        />
      </Collapse>
    </GraphContainer>
  );
};

export const SuspectedPatients: React.FC<ISuspectedPatients> = (props) => {
  const { text, data } = props;
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
            value={data.last_value.incidentie}
            id="verdenkingen_huisartsen"
            gradient={[
              {
                color: '#3391CC',
                value: 0,
              },
            ]}
          />
        )}

        <DateReported dateUnix={data?.last_value?.week} />
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
                date: value.week,
              }))}
            />

            <Metadata
              period={data.values.map((value) => value.week)}
              dataSource={text.bron}
              lastUpdated={data.last_value.incidentie * 1000}
            />
          </>
        )}
      </Collapse>
    </GraphContainer>
  );
};

export const SewerWater: React.FC<ISewerWater> = (props) => {
  const { data, text } = props;

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
            value={Number(data.last_value.average)}
            id="rioolwater_metingen"
            gradient={[
              {
                color: '#3391CC',
                value: 0,
              },
            ]}
          />
        )}

        <DateReported dateUnix={data?.last_value?.week} />
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

        {data && (
          <>
            <LineChart
              values={data.values.map((value) => ({
                value: Number(value.average),
                date: value.week,
              }))}
            />

            <Metadata
              period={data.values.map((value) => value.week)}
              dataSource={text.bron}
              lastUpdated={data.last_value.week * 1000}
            />
          </>
        )}
      </Collapse>
    </GraphContainer>
  );
};

export const NursingHomeInfectedPeople: React.FC<INursingHomeInfectedPeople> = (
  props
) => {
  const { data, text } = props;

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader Icon={Getest} title={text.title} />
        <p>{text.text}</p>

        {data && (
          <BarScale
            min={0}
            max={100}
            screenReaderText={text.screen_reader_graph_content}
            value={data.last_value.infected_nursery_daily}
            id="positief_verpleeghuis"
            gradient={[
              {
                color: '#3391CC',
                value: 0,
              },
            ]}
          />
        )}

        <DateReported
          dateUnix={data?.last_value?.date_of_report_unix}
          hasDailyInterval
        />
      </GraphContent>
      <Collapse
        openText={text.open}
        sluitText={text.sluit}
        piwikAction="landelijk"
        piwikName="Aantal positief geteste bewoners"
      >
        <h4>{text.fold_title}</h4>
        <p>{text.fold}</p>
        <h4>{text.graph_title}</h4>

        {data && (
          <>
            <LineChart
              values={data.values.map((value) => ({
                value: value.infected_nursery_daily,
                date: value.date_of_report_unix,
              }))}
            />
            <Metadata
              period={data.values.map((value) => value.date_of_report_unix)}
              dataSource={text.bron}
              lastUpdated={data.last_value.date_of_report_unix * 1000}
            />
          </>
        )}
      </Collapse>
    </GraphContainer>
  );
};

export const NursingHomeInfectedLocations: React.FC<INursingHomeInfectedLocations> = (
  props
) => {
  const { text, newLocations, totalLocations } = props;

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader Icon={Locatie} title={text.title} />
        <p>{text.text}</p>

        {newLocations && (
          <BarScale
            min={0}
            max={30}
            screenReaderText={text.screen_reader_graph_content}
            value={newLocations.last_value.infected_nursery_daily}
            id="besmette_locaties_verpleeghuis"
            gradient={[
              {
                color: '#3391CC',
                value: 0,
              },
            ]}
          />
        )}
        <DateReported
          dateUnix={newLocations?.last_value?.date_of_report_unix}
          hasDailyInterval
        />
      </GraphContent>
      <Collapse
        openText={text.open}
        sluitText={text.sluit}
        piwikName="Aantal besmette locaties"
        piwikAction="landelijk"
      >
        <h4>{text.fold_title}</h4>
        <p>{text.fold}</p>

        <h4>{text.graph_title}</h4>

        {newLocations && (
          <LineChart
            values={newLocations.values.map((value) => ({
              value: value.infected_nursery_daily,
              date: value.date_of_report_unix,
            }))}
          />
        )}

        {totalLocations && (
          <h3>
            {text.metric_title}{' '}
            <span style={{ color: '#01689b' }}>
              {formatDecimal(
                totalLocations.last_value.total_reported_locations
              )}
            </span>
          </h3>
        )}
        <p>{text.metric_text}</p>

        {newLocations && (
          <Metadata
            period={newLocations.values.map(
              (value) => value.date_of_report_unix
            )}
            dataSource={text.bron}
            lastUpdated={newLocations.last_value.date_of_report_unix * 1000}
          />
        )}
      </Collapse>
    </GraphContainer>
  );
};

export const NursingHomeInfectedDeaths: React.FC<INursingHomeInfectedDeaths> = (
  props
) => {
  const { data, text } = props;

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader Icon={CoronaVirus} title={text.title} />
        <p>{text.text}</p>
        {data && (
          <BarScale
            min={0}
            max={50}
            screenReaderText={text.screen_reader_graph_content}
            value={data.last_value.deceased_nursery_daily}
            id="over"
            gradient={[
              {
                color: '#3391CC',
                value: 0,
              },
            ]}
          />
        )}

        <DateReported
          dateUnix={data?.last_value?.date_of_report_unix}
          hasDailyInterval
        />
      </GraphContent>
      <Collapse
        openText={text.open}
        sluitText={text.sluit}
        piwikName="Sterfte"
        piwikAction="landelijk"
      >
        <h4>{text.fold_title}</h4>
        <p>{text.fold}</p>
        <h4>{text.graph_title}</h4>

        {data && (
          <>
            <LineChart
              values={data.values.map((value) => ({
                value: value.deceased_nursery_daily,
                date: value.date_of_report_unix,
              }))}
            />
            <Metadata
              period={data?.values.map((value) => value.date_of_report_unix)}
              dataSource={text.bron}
              lastUpdated={data?.last_value.date_of_report_unix * 1000}
            />
          </>
        )}
      </Collapse>
    </GraphContainer>
  );
};
