import siteText from 'locale';
import { RioolwaterMetingen } from 'types/data.d';
import getNlData, { INationalData } from 'static-props/nl-data';

import BarScale from 'components/barScale';
import { FCWithLayout } from 'components/layout';
import { getNationalLayout } from 'components/layout/NationalLayout';
import { LineChart } from 'components/charts/index';
import { ContentHeader } from 'components/layout/Content';

import RioolwaterMonitoring from 'assets/rioolwater-monitoring.svg';

const text: typeof siteText.rioolwater_metingen = siteText.rioolwater_metingen;

export function SewerWaterBarScale(props: {
  data: RioolwaterMetingen | undefined;
  showAxis: boolean;
}) {
  const { data, showAxis } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={100}
      screenReaderText={text.barscale_screenreader_text}
      value={Number(data.last_value.average)}
      id="rioolwater_metingen"
      rangeKey="average"
      gradient={[
        {
          color: '#3391CC',
          value: 0,
        },
      ]}
      showAxis={showAxis}
    />
  );
}

const SewerWater: FCWithLayout<INationalData> = (props) => {
  const { data: state } = props;

  const data: RioolwaterMetingen | undefined = state?.rioolwater_metingen;

  return (
    <>
      <ContentHeader
        category={siteText.gemeente_layout.headings.overig}
        title={text.titel}
        Icon={RioolwaterMonitoring}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: data?.last_value?.week_unix,
          dateInsertedUnix: data?.last_value?.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      <article className="metric-article layout-two-column">
        <div className="column-item column-item-extra-margin">
          <h3>{text.barscale_titel}</h3>

          <SewerWaterBarScale data={data} showAxis={true} />
        </div>

        <div className="column-item column-item-extra-margin">
          <p>{text.extra_uitleg}</p>
        </div>
      </article>

      {data?.values && (
        <article className="metric-article">
          <LineChart
            title={text.linechart_titel}
            timeframeOptions={['all', '5weeks']}
            values={data.values.map((value) => ({
              value: Number(value.average),
              date: value.week_unix,
              // TO DO: add start_week and end_week
              // week: { start: value.week_start_unix, end: value.week_end_unix }
            }))}
          />
        </article>
      )}
    </>
  );
};

SewerWater.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default SewerWater;
