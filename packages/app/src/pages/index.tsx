import { useRouter } from 'next/router';
import ArtsIcon from '~/assets/arts.svg';
import GetestIcon from '~/assets/test.svg';
import ZiekenhuisIcon from '~/assets/ziekenhuis.svg';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { DataDrivenText } from '~/components-styled/data-driven-text';
import { MaxWidth } from '~/components-styled/max-width';
import { NewsMessage } from '~/components-styled/news-message';
import { QuickLinks } from '~/components-styled/quick-links';
import { Tile } from '~/components-styled/tile';
import { TileList } from '~/components-styled/tile-list';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { escalationTooltip } from '~/components/choropleth/tooltips/region/escalation-tooltip';
import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import { Search } from '~/domain/topical/components/search';
import { DataSitemap } from '~/domain/topical/data-site-map';
import { MiniTrendTile } from '~/domain/topical/mini-trend-tile';
import { MiniTrendTileLayout } from '~/domain/topical/mini-trend-tile-layout';
import { TALLLanguages } from '~/locale/';
import { sortNationalTimeSeriesInDataInPlace } from '~/static-props/data-sorting';
import { loadJsonFromDataFile } from '~/static-props/utils/load-json-from-data-file';
import { National } from '~/types/data';
import { parseMarkdownInLocale } from '~/utils/parse-markdown-in-locale';
import { EscalationMapLegenda } from './veiligheidsregio';

interface StaticProps {
  props: IHomeData;
}

interface IHomeData {
  data: National;
  text: TALLLanguages;
  lastGenerated: string;
}

const Home: FCWithLayout<IHomeData> = (data) => {
  const router = useRouter();
  const notificatie = data.text.notificatie;
  const text = data.text.nationaal_actueel;

  const dataInfectedTotal = data.data.tested_overall;
  const dataHospitalIntake = data.data.hospital_nice;
  const dataIntake = data.data.intensive_care_nice;

  return (
    <MaxWidth>
      <TileList>
        <Search />
        <Tile>De actuele situatie in Nederland</Tile>
        <MiniTrendTileLayout>
          <MiniTrendTile
            title={text.mini_trend_tiles.positief_getest.title}
            text={
              <DataDrivenText
                data={data.data}
                metricName="tested_overall"
                metricProperty="infected_per_100k"
                differenceKey="tested_overall__infected_per_100k"
                valueTexts={text.data_driven_texts.infected_people_total.value}
                differenceTexts={
                  text.data_driven_texts.infected_people_total.difference
                }
              />
            }
            icon={<GetestIcon />}
            trendData={dataInfectedTotal.values}
            metricProperty="infected_per_100k"
          />
          <MiniTrendTile
            title={text.mini_trend_tiles.ziekenhuis_opnames.title}
            text={
              <DataDrivenText
                data={data.data}
                metricName="hospital_nice"
                metricProperty="admissions_moving_average"
                differenceKey="hospital_nice__admissions_moving_average"
                valueTexts={text.data_driven_texts.intake_hospital_ma.value}
                differenceTexts={
                  text.data_driven_texts.intake_hospital_ma.difference
                }
              />
            }
            icon={<ZiekenhuisIcon />}
            trendData={dataHospitalIntake.values}
            metricProperty="admissions_moving_average"
          />
          <MiniTrendTile
            title={text.mini_trend_tiles.ic_opnames.title}
            text={
              <DataDrivenText
                data={data.data}
                metricName="intensive_care_nice"
                metricProperty="admissions_moving_average"
                differenceKey="intensive_care_nice__admissions_moving_average"
                valueTexts={
                  text.data_driven_texts.intake_intensivecare_ma.value
                }
                differenceTexts={
                  text.data_driven_texts.intake_intensivecare_ma.difference
                }
              />
            }
            icon={<ArtsIcon />}
            trendData={dataIntake.values}
            metricProperty="admissions_moving_average"
          />
        </MiniTrendTileLayout>
        <QuickLinks
          header={text.quick_links.header}
          links={[
            { href: '/landelijk', text: text.quick_links.links.nationaal },
            {
              href: '/veiligheidsregio',
              text: text.quick_links.links.veiligheidsregio,
            },
            { href: '/gemeentes', text: text.quick_links.links.gemeente },
          ]}
        />

        <ChoroplethTile
          title={text.risiconiveaus.selecteer_titel}
          description={
            <>
              <span
                dangerouslySetInnerHTML={{
                  __html: text.risiconiveaus.selecteer_toelichting,
                }}
              />
              <EscalationMapLegenda
                metricName="escalation_levels"
                metricProperty="escalation_level"
                text={data.text}
              />
            </>
          }
        >
          <SafetyRegionChoropleth
            metricName="escalation_levels"
            metricProperty="escalation_level"
            onSelect={createSelectRegionHandler(router, 'maatregelen')}
            tooltipContent={escalationTooltip(
              createSelectRegionHandler(router, 'maatregelen')
            )}
          />
        </ChoroplethTile>

        <NewsMessage
          imageSrc="images/toelichting-afbeelding.png"
          linkText={notificatie.link.text}
          href={notificatie.link.href}
          message={notificatie.bericht}
          publishedAt={notificatie.datum}
          subtitle={notificatie.subtitel}
          title={notificatie.titel}
        />

        <DataSitemap />
      </TileList>
    </MaxWidth>
  );
};

/** @TODO Fill metadata / adjust layout */
const metadata = {
  title: '',
};
Home.getLayout = getLayoutWithMetadata(metadata);

export async function getStaticProps(): Promise<StaticProps> {
  const text = parseMarkdownInLocale((await import('../locale/index')).default);

  const data = loadJsonFromDataFile<National>('NL.json');

  // Strip away unused data (values) from staticProps
  // keep last_values because we use them!
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const metric of Object.values(data)) {
    if (typeof metric === 'object' && metric !== null) {
      for (const [metricProperty, metricValue] of Object.entries(metric)) {
        if (metricProperty === 'values') {
          (metricValue as {
            values: Array<unknown>;
          }).values = [];
        }
      }
    }
  }

  sortNationalTimeSeriesInDataInPlace(data);

  const lastGenerated = data.last_generated;

  return { props: { data, text, lastGenerated } };
}

export default Home;
