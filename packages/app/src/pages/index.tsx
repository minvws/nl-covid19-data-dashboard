import fs from 'fs';
import { useRouter } from 'next/router';
import path from 'path';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { MaxWidth } from '~/components-styled/max-width';
import { QuickLinks } from '~/components-styled/quick-links';
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
import css from '@styled-system/css';
import styled from 'styled-components';
import Getest from '~/assets/test.svg';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import { Spacer } from '~/components-styled/base';
import { DataDrivenText } from '~/components-styled/data-driven-text';

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

  return (
    <ActueelLayout>
      <MaxWidth>
        <Text color="annotation">Laats bijgewerkt: gisteren om 17:00</Text>

        <Text as="h1" css={css({ fontSize: '1.6875rem', fontWeight: 'normal' })}>De actuele situatie in <b>Nederland:</b></Text>
        <TopicalRow>
          <TopicalTile icon={<Getest />} title='Aantal positieve testen'>

            <DataDrivenText
              data={data.data}
              metricName="infected_people_total"
              metricProperty="infected_daily_total"
              differenceKey="infected_people_total__infected_daily_total"
              valueTexts={text.data_driven_texts.infected_people_total.value}
              differenceTexts={text.data_driven_texts.infected_people_total.difference} />
          </TopicalTile>
          <TopicalTile icon={<Ziekenhuis />} title="Ziekenhuisopnames">

            <DataDrivenText
              data={data.data}
              metricName="intake_hospital_ma"
              metricProperty="moving_average_hospital"
              differenceKey="intake_hospital_ma__moving_average_hospital"
              valueTexts={text.data_driven_texts.intake_hospital.value}
              differenceTexts={text.data_driven_texts.intake_hospital.difference} />
          </TopicalTile>
          <TopicalTile icon={<Ziekenhuis />} title="Risiconiveau &amp; maatregelen">
            <Text>Donec quis posuere massa. Maecenas posuere magna eros, ut ornare arcu vehicula at. </Text>
          </TopicalTile>
        </TopicalRow>

        <Spacer />

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

        <Spacer />

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

        <DataSitemap />
      </MaxWidth>
    </ActueelLayout>
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

const ActueelLayout = styled.div(css({
  bg: 'white',
  p: 2
}))
