import fs from 'fs';
import { useRouter } from 'next/router';
import path from 'path';
import ArtsIcon from '~/assets/arts.svg';
import GetestIcon from '~/assets/test.svg';
import ZiekenhuisIcon from '~/assets/ziekenhuis.svg';
import { Box } from '~/components-styled/base';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { MaxWidth } from '~/components-styled/max-width';
import { NewsMessage } from '~/components-styled/news-message';
import { Tile } from '~/components-styled/tile';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { escalationTooltip } from '~/components/choropleth/tooltips/region/escalation-tooltip';
import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import { DataSitemap } from '~/domain/topical/data-site-map';
import { MiniTrendTile } from '~/domain/topical/mini-trend-tile';
import siteText from '~/locale';
import { TALLLanguages } from '~/locale/';
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

const Home: FCWithLayout<IHomeData> = (homeData) => {
  const router = useRouter();
  const { text } = homeData;

  const dataInfectedDelta = homeData.data.infected_people_delta_normalized;
  const dataHospitalIntake = homeData.data.intake_hospital_ma;
  const dataIntake = homeData.data.intake_intensivecare_ma;

  return (
    <MaxWidth>
      <Tile>De actuele situatie in Nederland</Tile>
      <Tile>
        <Box display="flex" flexDirection="row">
          <MiniTrendTile
            flex="1 1 33%"
            title={
              text.nationaal_actueel.mini_trend_tiles.positief_getest.title
            }
            text={'data driven text'}
            icon={<GetestIcon />}
            trendData={dataInfectedDelta.values}
            metricProperty="infected_daily_increase"
          />
          <MiniTrendTile
            flex="1 1 33%"
            title={
              text.nationaal_actueel.mini_trend_tiles.ziekenhuis_opnames.title
            }
            text={'data driven text'}
            icon={<ZiekenhuisIcon />}
            trendData={dataHospitalIntake.values}
            metricProperty="moving_average_hospital"
          />
          <MiniTrendTile
            flex="1 1 33%"
            title={text.nationaal_actueel.mini_trend_tiles.ic_opnames.title}
            text={'data driven text'}
            icon={<ArtsIcon />}
            trendData={dataIntake.values}
            metricProperty="moving_average_ic"
          />
        </Box>
      </Tile>
      <ChoroplethTile
        title={text.veiligheidsregio_index.selecteer_titel}
        description={
          <>
            <span
              dangerouslySetInnerHTML={{
                __html: text.veiligheidsregio_index.selecteer_toelichting,
              }}
            />
            <EscalationMapLegenda text={text} />
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
        linkText={siteText.notificatie.link.text}
        href={siteText.notificatie.link.href}
        message={siteText.notificatie.bericht}
        publishedAt={siteText.notificatie.datum}
        subtitle={siteText.notificatie.subtitel}
        title={siteText.notificatie.titel}
      />

      <DataSitemap />
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

  const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContents) as National;

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

  const lastGenerated = data.last_generated;

  return { props: { data, text, lastGenerated } };
}

export default Home;
