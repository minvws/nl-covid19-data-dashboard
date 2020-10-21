import fs from 'fs';
import { useRouter } from 'next/router';
import path from 'path';
import { useState } from 'react';
import ExternalLink from '~/assets/external-link.svg';
import Notification from '~/assets/notification.svg';
import { ChartRegionControls } from '~/components-styled/chart-region-controls';
import { ChloroplethLegenda } from '~/components/chloropleth/legenda/ChloroplethLegenda';
import { useSafetyRegionLegendaData } from '~/components/chloropleth/legenda/hooks/useSafetyRegionLegendaData';
import { MunicipalityChloropleth } from '~/components/chloropleth/MunicipalityChloropleth';
import { SafetyRegionChloropleth } from '~/components/chloropleth/SafetyRegionChloropleth';
import { createSelectMunicipalHandler } from '~/components/chloropleth/selectHandlers/createSelectMunicipalHandler';
import { createSelectRegionHandler } from '~/components/chloropleth/selectHandlers/createSelectRegionHandler';
import { createPositiveTestedPeopleMunicipalTooltip } from '~/components/chloropleth/tooltips/municipal/createPositiveTestedPeopleMunicipalTooltip';
import { createPositiveTestedPeopleRegionalTooltip } from '~/components/chloropleth/tooltips/region/createPositiveTestedPeopleRegionalTooltip';
import { escalationTooltip } from '~/components/chloropleth/tooltips/region/escalationTooltip';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { TitleWithIcon } from '~/components/titleWithIcon';
import { TALLLanguages } from '~/locale/index';
import { INationalData } from '~/static-props/nl-data';
import { National } from '~/types/data';
import { MDToHTMLString } from '~/utils/MDToHTMLString';
import styles from './index.module.scss';
import { EscalationMapLegenda } from './veiligheidsregio';

const Home: FCWithLayout<INationalData> = (props) => {
  const { text } = props;
  const router = useRouter();
  const [selectedMap, setSelectedMap] = useState<'municipal' | 'region'>(
    'municipal'
  );

  const legendItems = useSafetyRegionLegendaData('positive_tested_people');

  return (
    <>
      <TitleWithIcon
        Icon={Notification}
        title={text.laatste_ontwikkelingen.title}
        as="h2"
      />
      <article className={`${styles.notification} metric-article`}>
        <div className={styles.textgroup}>
          <h3 className={styles.header}>{text.notificatie.titel}</h3>
          <p>{text.notificatie.bericht}</p>
        </div>
        <a
          className={styles.link}
          href={text.notificatie.link.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink />
          <span>{text.notificatie.link.text}</span>
        </a>
      </article>

      <article className="metric-article layout-chloropleth">
        <div className="chloropleth-header">
          <h2>{text.veiligheidsregio_index.selecteer_titel}</h2>
          <div
            dangerouslySetInnerHTML={{
              __html: text.veiligheidsregio_index.selecteer_toelichting,
            }}
          />
          <EscalationMapLegenda text={text} />
        </div>
        <div className="chloropleth-chart">
          <SafetyRegionChloropleth
            metricName="escalation_levels"
            metricValueName="escalation_level"
            onSelect={createSelectRegionHandler(router)}
            tooltipContent={escalationTooltip(router)}
          />
        </div>
      </article>

      <article className="metric-article layout-chloropleth">
        <div className="chloropleth-header">
          <h3>{text.positief_geteste_personen.map_titel}</h3>
          <p>{text.positief_geteste_personen.map_toelichting}</p>
          <div className="chloropleth-controls">
            <ChartRegionControls
              onChange={(val: 'region' | 'municipal') => setSelectedMap(val)}
            />
          </div>
        </div>

        <div className="chloropleth-chart">
          {selectedMap === 'municipal' && (
            <MunicipalityChloropleth
              metricName="positive_tested_people"
              tooltipContent={createPositiveTestedPeopleMunicipalTooltip(
                router
              )}
              onSelect={createSelectMunicipalHandler(router)}
            />
          )}
          {selectedMap === 'region' && (
            <SafetyRegionChloropleth
              metricName="positive_tested_people"
              tooltipContent={createPositiveTestedPeopleRegionalTooltip(router)}
              onSelect={createSelectRegionHandler(router)}
            />
          )}
        </div>

        <div className="chloropleth-legend">
          {legendItems && (
            <ChloroplethLegenda
              items={legendItems}
              title={text.positief_geteste_personen.chloropleth_legenda.titel}
            />
          )}
        </div>
      </article>
    </>
  );
};

Home.getLayout = getNationalLayout();

interface StaticProps {
  props: {
    data: National;
    text: TALLLanguages;
    lastGenerated: string;
  };
}

export async function getStaticProps(): Promise<StaticProps> {
  const text = require('../locale/index').default;

  const serializedContent = MDToHTMLString(
    text.veiligheidsregio_index.selecteer_toelichting
  );

  text.veiligheidsregio_index.selecteer_toelichting = serializedContent;

  const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContents) as National;
  const lastGenerated = data.last_generated;

  return { props: { data, text, lastGenerated } };
}

export default Home;
