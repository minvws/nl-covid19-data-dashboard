import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { LineChart } from '~/components/charts/index';
import { ContentHeader } from '~/components/layout/Content';
import { IntakeIntensiveCareBarscale } from '~/components/landelijk/intake-intensive-care-barscale';

import Arts from '~/assets/arts.svg';

import siteText from '~/locale/index';

import { IntakeIntensivecareMa } from '~/types/data.d';

import getNlData, { INationalData } from '~/static-props/nl-data';

const text = siteText.ic_opnames_per_dag;

const IntakeIntensiveCare: FCWithLayout<INationalData> = (props) => {
  const { data: state } = props;

  const data: IntakeIntensivecareMa | undefined =
    state?.intake_intensivecare_ma;

  return (
    <>
      <ContentHeader
        category={siteText.nationaal_layout.headings.medisch}
        title={text.titel}
        Icon={Arts}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: data?.last_value?.date_of_report_unix,
          dateInsertedUnix: data?.last_value?.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      <article className="metric-article layout-two-column">
        <div className="column-item column-item-extra-margin">
          <h3>{text.barscale_titel}</h3>

          <IntakeIntensiveCareBarscale data={data} showAxis={true} />
        </div>

        <div className="column-item column-item-extra-margin">
          <p>{text.extra_uitleg}</p>
        </div>
      </article>

      {data && (
        <article className="metric-article">
          <LineChart
            title={text.linechart_titel}
            values={data.values.map((value) => ({
              value: value.moving_average_ic,
              date: value.date_of_report_unix,
            }))}
            signaalwaarde={10}
          />
        </article>
      )}
    </>
  );
};

IntakeIntensiveCare.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default IntakeIntensiveCare;
