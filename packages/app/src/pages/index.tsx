import fs from 'fs';
import { useRouter } from 'next/router';
import path from 'path';
import ArtsIcon from '~/assets/arts.svg';
import GetestIcon from '~/assets/test.svg';
import ZiekenhuisIcon from '~/assets/ziekenhuis.svg';
import { Box } from '~/components-styled/base';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { DataDrivenText } from '~/components-styled/data-driven-text';
import { MaxWidth } from '~/components-styled/max-width';
import { NewsMessage } from '~/components-styled/news-message';
import { QuickLinks } from '~/components-styled/quick-links';
import { Tile } from '~/components-styled/tile';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { escalationTooltip } from '~/components/choropleth/tooltips/region/escalation-tooltip';
import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import { DataSitemap } from '~/domain/topical/data-site-map';
import { MiniTrendTile } from '~/domain/topical/mini-trend-tile';
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

const Home: FCWithLayout<IHomeData> = (data) => {
  const router = useRouter();
  const notificatie = data.text.notificatie;
  const text = data.text.nationaal_actueel;

  const dataInfectedDelta = data.data.infected_people_total;
  const dataHospitalIntake = data.data.intake_hospital_ma;
  const dataIntake = data.data.intake_intensivecare_ma;

  return (
    <MaxWidth>
      <Tile>De actuele situatie in Nederland</Tile>
      <Tile>
        <Box display="flex" flexDirection="row">
          <MiniTrendTile
            flex="1 1 33%"
            title={text.mini_trend_tiles.positief_getest.title}
            text={
              <DataDrivenText
                data={data.data}
                metricName="infected_people_total"
                metricProperty="infected_daily_total"
                differenceKey="infected_people_total__infected_daily_total"
                valueTexts={text.data_driven_texts.infected_people_total.value}
                differenceTexts={
                  text.data_driven_texts.infected_people_total.difference
                }
              />
            }
            icon={<GetestIcon />}
            trendData={dataInfectedDelta.values}
            metricProperty="infected_daily_total"
          />
          <MiniTrendTile
            flex="1 1 33%"
            title={text.mini_trend_tiles.ziekenhuis_opnames.title}
            text={
              <DataDrivenText
                data={data.data}
                metricName="intake_hospital_ma"
                metricProperty="moving_average_hospital"
                differenceKey="intake_hospital_ma__moving_average_hospital"
                valueTexts={text.data_driven_texts.intake_hospital_ma.value}
                differenceTexts={
                  text.data_driven_texts.intake_hospital_ma.difference
                }
              />
            }
            icon={<ZiekenhuisIcon />}
            trendData={dataHospitalIntake.values}
            metricProperty="moving_average_hospital"
          />
          <MiniTrendTile
            flex="1 1 33%"
            title={text.mini_trend_tiles.ic_opnames.title}
            text={
              <DataDrivenText
                data={data.data}
                metricName="intake_intensivecare_ma"
                metricProperty="moving_average_ic"
                differenceKey="intake_intensivecare_ma__moving_average_ic"
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
            metricProperty="moving_average_ic"
          />
        </Box>
      </Tile>
      <ChoroplethTile
        title={text.risiconiveaus.selecteer_titel}
        description={
          <>
            <span
              dangerouslySetInnerHTML={{
                __html: text.risiconiveaus.selecteer_toelichting,
              }}
            />
            <EscalationMapLegenda text={data.text} />
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
      ></QuickLinks>
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
