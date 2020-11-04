import Repro from '~/assets/reproductiegetal.svg';
import { LineChart } from '~/components/charts/index';
import { ReproductionIndexBarScale } from '~/components/landelijk/reproduction-index-barscale';
import { FCWithLayout } from '~/components/layout';
import { ContentHeader } from '~/components/contentHeader';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { Legenda } from '~/components/legenda';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import getNlData, { INationalData } from '~/static-props/nl-data';
import { Metadata } from '~/components-styled/metadata';

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
          <Metadata
            date={lastKnownValidData.last_value.date_of_report_unix}
            source={text.bron}
          />
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

      {data.reproduction_index.values && (
        <article className="metric-article">
          <LineChart
            title={text.linechart_titel}
            values={data.reproduction_index.values.map((value) => ({
              value: value.reproduction_index_avg,
              date: value.date_of_report_unix,
            }))}
            signaalwaarde={1}
            timeframeOptions={['all', '5weeks']}
            showFill={false}
          />
          <Legenda>
            <li className="blue">{text.legenda_r}</li>
          </Legenda>
          <Metadata
            date={lastKnownValidData.last_value.date_of_report_unix}
            source={text.bron}
          />
        </article>
      )}
    </>
  );
};

ReproductionIndex.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default ReproductionIndex;
