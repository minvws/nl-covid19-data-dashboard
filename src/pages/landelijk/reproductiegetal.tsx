import { Legenda } from '~/components/legenda';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { AreaChart } from '~/components/charts/index';
import { ContentHeader } from '~/components/layout/Content';

import { ReproductionIndexBarScale } from '~/components/landelijk/reproduction-index-barscale';

import Repro from '~/assets/reproductiegetal.svg';

import siteText from '~/locale/index';

import { ReproductionIndex as ReproductionIndexData } from '~/types/data.d';

import getNlData, { INationalData } from '~/static-props/nl-data';

const text: typeof siteText.reproductiegetal = siteText.reproductiegetal;

const ReproductionIndex: FCWithLayout<INationalData> = (props) => {
  const { data: state } = props;

  const lastKnownValidData: ReproductionIndexData | undefined =
    state?.reproduction_index_last_known_average;

  const data: ReproductionIndexData | undefined = state?.reproduction_index;

  return (
    <>
      <ContentHeader
        category={siteText.nationaal_layout.headings.medisch}
        title={text.titel}
        Icon={Repro}
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
          <ReproductionIndexBarScale
            data={data}
            lastKnown={lastKnownValidData}
            showAxis={true}
          />
          <p>{text.barscale_toelichting}</p>
        </div>

        <div className="column-item column-item-extra-margin">
          <img
            width={315}
            height={100}
            loading="lazy"
            src="/images/reproductie-explainer.svg"
            alt={text.reproductie_explainer_alt}
          />
          <p>{text.extra_uitleg}</p>
        </div>
      </article>

      {data?.values && (
        <article className="metric-article">
          <AreaChart
            title={text.linechart_titel}
            data={data.values.map((value) => ({
              avg: value.reproduction_index_avg,
              min: value.reproduction_index_low,
              max: value.reproduction_index_high,
              date: value.date_of_report_unix,
            }))}
            signaalwaarde={1}
            rangeLegendLabel={text.rangeLegendLabel}
            lineLegendLabel={text.lineLegendLabel}
            timeframeOptions={['all', '5weeks']}
          />
          <Legenda>
            <li className="blue">{text.legenda_r}</li>
            <li className="gray square">{text.legenda_marge}</li>
          </Legenda>
        </article>
      )}
    </>
  );
};

ReproductionIndex.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default ReproductionIndex;
