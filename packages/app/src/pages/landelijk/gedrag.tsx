import Gedrag from '~/assets/gedrag.svg';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { Tile } from '~/components-styled/tile';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Heading, Text } from '~/components-styled/typography';
import { SEOHead } from '~/components/seoHead';
import { BehaviorChoroplethTile } from '~/domain/behavior/behavior-choropleth-tile';
import { BehaviorLineChartTile } from '~/domain/behavior/behavior-line-chart-tile';
import { BehaviorTableTile } from '~/domain/behavior/behavior-table-tile';
import { MoreInformation } from '~/domain/behavior/components/more-information';
import { FCWithLayout } from '~/domain/layout/layout';
import { getNationalLayout } from '~/domain/layout/national-layout';
import siteText from '~/locale/index';
import {
  createGetChoroplethData,
  getNlData,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { createGetStaticProps } from '~/static-props/create-get-static-props';

const text = siteText.nl_gedrag;

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getNlData,
  createGetChoroplethData({
    vr: ({ behavior }) => ({ behavior }),
  })
);

const BehaviorPage: FCWithLayout<typeof getStaticProps> = ({
  data,
  choropleth,
}) => {
  const behaviorData = data.behavior;

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <TileList>
        <ContentHeader
          category={siteText.nationaal_layout.headings.gedrag}
          title={text.pagina.titel}
          icon={<Gedrag />}
          subtitle={text.pagina.toelichting}
          metadata={{
            datumsText: text.datums,
            dateOrRange: {
              start: behaviorData.last_value.date_start_unix,
              end: behaviorData.last_value.date_end_unix,
            },
            dateOfInsertionUnix: behaviorData.last_value.date_of_insertion_unix,
            dataSources: [text.bronnen.rivm],
          }}
          reference={text.reference}
        />

        <TwoKpiSection>
          <Tile height="100%">
            <Heading level={3}>{text.onderzoek_uitleg.titel}</Heading>
            <Text>{text.onderzoek_uitleg.toelichting}</Text>
          </Tile>

          <KpiTile
            title={text.kpi.aantal_respondenten.titel}
            metadata={{
              source: text.kpi.aantal_respondenten.bron,
              date: [
                behaviorData.last_value.date_start_unix,
                behaviorData.last_value.date_end_unix,
              ],
            }}
          >
            <KpiValue
              absolute={behaviorData.last_value.number_of_participants}
            />
            <Text>{text.kpi.aantal_respondenten.toelichting}</Text>
          </KpiTile>
        </TwoKpiSection>

        <BehaviorTableTile
          behavior={behaviorData.last_value}
          title={text.basisregels.title}
          introduction={text.basisregels.intro}
          footer={text.basisregels.voetnoot}
          footerAsterisk={text.basisregels.voetnoot_asterisk}
        />

        <BehaviorLineChartTile
          values={behaviorData.values}
          title={text.basisregels_over_tijd.title}
          introduction={text.basisregels_over_tijd.intro}
        />

        <BehaviorChoroplethTile data={choropleth.vr} />

        <MoreInformation />
      </TileList>
    </>
  );
};

BehaviorPage.getLayout = getNationalLayout;

export default BehaviorPage;
