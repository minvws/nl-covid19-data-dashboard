import Gedrag from '~/assets/gedrag.svg';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { Tile } from '~/components-styled/layout';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Heading, Text } from '~/components-styled/typography';
import { ContentHeader_weekRangeHack } from '~/components/contentHeader_weekRangeHack';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { SEOHead } from '~/components/seoHead';
import { BehaviorTableTile } from '~/domain/behavior/behavior-table-tile';
import { BehaviorLineChartTile } from '~/domain/behavior/behavior-line-chart-tile';
import siteText from '~/locale/index';
import getNlData, { INationalData } from '~/static-props/nl-data';

const text = siteText.nl_gedrag;

const BehaviorPage: FCWithLayout<INationalData> = (props) => {
  const behaviorData = props.data.behavior;

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <ContentHeader_weekRangeHack
        category={siteText.nationaal_layout.headings.gedrag}
        title={text.pagina.titel}
        Icon={Gedrag}
        subtitle={text.pagina.toelichting}
        metadata={{
          datumsText: text.datums,
          weekStartUnix: behaviorData.last_value.week_start_unix,
          weekEndUnix: behaviorData.last_value.week_end_unix,
          dateOfInsertionUnix: behaviorData.last_value.date_of_insertion_unix,
          dataSource: text.bron,
        }}
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
              behaviorData.last_value.week_start_unix,
              behaviorData.last_value.week_end_unix,
            ],
          }}
        >
          <KpiValue absolute={behaviorData.last_value.number_of_participants} />
          <Text>{text.kpi.aantal_respondenten.toelichting}</Text>
        </KpiTile>
      </TwoKpiSection>

      <BehaviorTableTile text={text} behavior={behaviorData.last_value} />

      <BehaviorLineChartTile text={text} values={behaviorData.values} />
    </>
  );
};

BehaviorPage.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default BehaviorPage;
