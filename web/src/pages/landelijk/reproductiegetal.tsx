import Repro from '~/assets/reproductiegetal.svg';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiWithIllustrationTile } from '~/components-styled/kpi-with-illustration-tile';
import { Legenda } from '~/components-styled/legenda';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { PageBarScale } from '~/components-styled/page-barscale';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Text } from '~/components-styled/typography';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import {
  getNationalStaticProps,
  NationalPageProps,
} from '~/static-props/nl-data';

const text = siteText.reproductiegetal;

const ReproductionIndex: FCWithLayout<NationalPageProps> = (props) => {
  const { data } = props;

  const lastKnownValidData = data.reproduction_index_last_known_average;

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <ContentHeader
        category={siteText.nationaal_layout.headings.besmettingen}
        screenReaderCategory={siteText.reproductiegetal.titel_sidebar}
        title={text.titel}
        icon={<Repro />}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateInfo: lastKnownValidData.last_value.date_of_report_unix,
          dateOfInsertionUnix:
            lastKnownValidData.last_value.date_of_insertion_unix,
          dataSources: [text.bronnen.rivm],
        }}
        reference={text.reference}
      />

      <TwoKpiSection>
        <KpiWithIllustrationTile
          title={text.barscale_titel}
          metadata={{
            date: lastKnownValidData.last_value.date_of_report_unix,
            source: text.bronnen.rivm,
          }}
          illustration={{
            image: '/images/reproductie-explainer.svg',
            alt: text.reproductie_explainer_alt,
            description: text.extra_uitleg,
          }}
        >
          <PageBarScale
            data={data}
            scope="nl"
            metricName="reproduction_index_last_known_average"
            metricProperty="reproduction_index_avg"
            localeTextKey="reproductiegetal"
          />
          <Text>{text.barscale_toelichting}</Text>
        </KpiWithIllustrationTile>
      </TwoKpiSection>

      {data.reproduction_index.values && (
        <LineChartTile
          metadata={{ source: text.bronnen.rivm }}
          title={text.linechart_titel}
          values={data.reproduction_index.values.map((value) => ({
            value: value.reproduction_index_avg,
            date: value.date_of_report_unix,
          }))}
          signaalwaarde={1}
          timeframeOptions={['all', '5weeks']}
          showFill={false}
          footer={
            <Legenda
              items={[
                {
                  label: text.legenda_r,
                  color: 'data.primary',
                  shape: 'line',
                },
              ]}
            />
          }
        />
      )}
    </>
  );
};

ReproductionIndex.getLayout = getNationalLayout;

export const getStaticProps = getNationalStaticProps;

export default ReproductionIndex;
