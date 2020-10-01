import { useState } from 'react';
import { useRouter } from 'next/router';
import path from 'path';
import fs from 'fs';

import styles from './index.module.scss';
import { National } from '~/types/data';
import { INationalData } from '~/static-props/nl-data';
import siteText from '~/locale/index';

import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { TitleWithIcon } from '~/components/titleWithIcon';
import { ChartRegionControls } from '~/components/chartRegionControls';
import { MunicipalityChloropleth } from '~/components/chloropleth/MunicipalityChloropleth';
import { SafetyRegionChloropleth } from '~/components/chloropleth/SafetyRegionChloropleth';
import { createPositiveTestedPeopleMunicipalTooltip } from '~/components/chloropleth/tooltips/municipal/positiveTestedPeopleTooltip';
import { createPositiveTestedPeopleRegionalTooltip } from '~/components/chloropleth/tooltips/region/positiveTestedPeopleTooltip';
import { escalationTooltip } from '~/components/chloropleth/tooltips/region/escalationTooltip';
import { createSelectRegionHandler } from '~/components/chloropleth/selectHandlers/createSelectRegionHandler';
import { createSelectMunicipalHandler } from '~/components/chloropleth/selectHandlers/createSelectMunicipalHandler';
import { useSafetyRegionLegendaData } from '~/components/chloropleth/legenda/hooks/useSafetyRegionLegendaData';
import { ChloroplethLegenda } from '~/components/chloropleth/legenda/ChloroplethLegenda';

import Notification from '~/assets/notification.svg';
import ExternalLink from '~/assets/external-link.svg';

import { EscalationMapLegenda } from './veiligheidsregio';
import { useMediaQuery } from '~/utils/useMediaQuery';
import { MDToHTMLString } from '~/utils/MDToHTMLString';

const Home: FCWithLayout<INationalData> = (props) => {
  const { text } = props;
  const router = useRouter();
  const [selectedMap, setSelectedMap] = useState<'municipal' | 'region'>(
    'municipal'
  );

  const isLargeScreen = useMediaQuery('(min-width: 1000px)');
  const legendItems = useSafetyRegionLegendaData('positive_tested_people');
  const mapHeight = isLargeScreen ? '500px' : '400px';

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
            metricProperty="escalation_level"
            style={{ height: mapHeight }}
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
    text: typeof siteText;
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
