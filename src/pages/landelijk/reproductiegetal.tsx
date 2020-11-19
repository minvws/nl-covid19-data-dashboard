import Repro from '~/assets/reproductiegetal.svg';
import { KpiWithIllustrationTile } from '~/components-styled/kpi-with-illustration-tile';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Text } from '~/components-styled/typography';
import { ContentHeader } from '~/components/contentHeader';
import { ReproductionIndexBarScale } from '~/components/landelijk/reproduction-index-barscale';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { Legenda } from '~/components-styled/legenda';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import getNlData, { INationalData } from '~/static-props/nl-data';

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
        category={siteText.nationaal_layout.headings.besmettingen}
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

      <TwoKpiSection>
        <KpiWithIllustrationTile
          title={text.barscale_titel}
          metadata={{
            date: lastKnownValidData.last_value.date_of_report_unix,
            source: text.bron,
          }}
          illustration={{
            image: '/images/reproductie-explainer.svg',
            alt: text.reproductie_explainer_alt,
            description: text.extra_uitleg,
          }}
        >
          <ReproductionIndexBarScale
            data={lastKnownValidData}
            showAxis={true}
          />
          <Text>{text.barscale_toelichting}</Text>
        </KpiWithIllustrationTile>
      </TwoKpiSection>

      {data.reproduction_index.values && (
        <LineChartTile
          metadata={{ source: text.bron }}
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

ReproductionIndex.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default ReproductionIndex;
