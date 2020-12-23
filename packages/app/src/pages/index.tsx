import fs from 'fs';
import { useRouter } from 'next/router';
import path from 'path';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { MaxWidth } from '~/components-styled/max-width';
import { NewsMessage } from '~/components-styled/news-message';
import { Tile } from '~/components-styled/tile';
import { Text } from '~/components-styled/typography';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { escalationTooltip } from '~/components/choropleth/tooltips/region/escalation-tooltip';
import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import { DataSitemap } from '~/domain/topical/data-site-map';
import { TopicalRow } from '~/domain/topical/topical-row';
import { TopicalTile } from '~/domain/topical/topical-tile';
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

const Home: FCWithLayout<IHomeData> = (data) => {
  const router = useRouter();
  const { text } = data;

  return (
    <MaxWidth>
      <Tile>De actuele situatie in Nederland</Tile>
      <Tile>Artikelen</Tile>

      <TopicalRow>
        <TopicalTile>
          <Text as="h3">Aantal positieve testen</Text>
        </TopicalTile>
        <TopicalTile>
          <Text as="h3">Ziekenhuisopnames</Text>
        </TopicalTile>
        <TopicalTile>
          <Text as="h3">Risiconiveau &amp; maatregelen</Text>
        </TopicalTile>
      </TopicalRow>

      <NewsMessage
        imageSrc="images/toelichting-afbeelding.png"
        linkText={siteText.notificatie.link.text}
        href={siteText.notificatie.link.href}
        message={siteText.notificatie.bericht}
        publishedAt={siteText.notificatie.datum}
        subtitle={siteText.notificatie.subtitel}
        title={siteText.notificatie.titel}
      />
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
