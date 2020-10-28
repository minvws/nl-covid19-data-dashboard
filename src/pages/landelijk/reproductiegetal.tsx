import Repro from '~/assets/reproductiegetal.svg';
import { AreaChart } from '~/components/charts/index';
import { ReproductionIndexBarScale } from '~/components/landelijk/reproduction-index-barscale';
import { FCWithLayout } from '~/components/layout';
import { ContentHeader } from '~/components/contentHeader';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { Legenda } from '~/components/legenda';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import getNlData, { INationalData } from '~/static-props/nl-data';

import Image from 'next/image';

const text = siteText.reproductiegetal;

const ReproductionIndex: FCWithLayout<INationalData> = (props) => {
  const { data } = props;

  const lastKnownValidData = data.reproduction_index_last_known_average;

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <ContentHeader
        category={siteText.nationaal_layout.headings.medisch}
        title={text.titel}
        Icon={Repro}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: lastKnownValidData.last_value.date_of_report_unix,
          dateInsertedUnix:
            lastKnownValidData.last_value.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      <article className="metric-article layout-two-column">
        <div className="column-item column-item-extra-margin">
          <h3>{text.barscale_titel}</h3>
          <ReproductionIndexBarScale
            data={lastKnownValidData}
            showAxis={true}
          />
          <p>{text.barscale_toelichting}</p>
        </div>

        <div className="column-item column-item-extra-margin">
          <Image
            src="/images/reproductie-explainer.svg"
            width="315"
            height="100"
            alt={text.reproductie_explainer_alt}
          />
          <p>{text.extra_uitleg}</p>
        </div>
      </article>

      {data.reproduction_index.values && (
        <article className="metric-article">
          <AreaChart
            title={text.linechart_titel}
            data={data.reproduction_index.values.map((value) => ({
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
