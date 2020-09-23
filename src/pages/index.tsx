import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import Notification from '~/assets/notification.svg';
import ExternalLink from '~/assets/external-link.svg';

import path from 'path';
import fs from 'fs';

import siteText from '~/locale/index';

import { INationalData } from '~/static-props/nl-data';

import styles from './index.module.scss';

import { TitleWithIcon } from '~/components/titleWithIcon';
import { ChartRegionControls } from '~/components/chartRegionControls';
import { MunicipalityChloropleth } from '~/components/chloropleth/MunicipalityChloropleth';
import { SafetyRegionChloropleth } from '~/components/chloropleth/SafetyRegionChloropleth';
import { positiveTestedPeopleTooltip } from '~/components/chloropleth/tooltips/municipal/positiveTestedPeopleTooltip';
import { positiveTestedPeopleTooltip as regionPositiveTestedPeopleTooltip } from '~/components/chloropleth/tooltips/region/positiveTestedPeopleTooltip';
import { useState } from 'react';
import { MunicipalityLegenda } from '~/components/chloropleth/legenda/MunicipalityLegenda';
import { SafetyRegionLegenda } from '~/components/chloropleth/legenda/SafetyRegionLegenda';
import Link from 'next/link';
import { EscalationMapLegenda } from './veiligheidsregio';
import { useMediaQuery } from '~/utils/useMediaQuery';
import { useRouter } from 'next/router';
import { escalationTooltip } from '~/components/chloropleth/tooltips/region/escalationTooltip';
import { MDToHTMLString } from '~/utils/MDToHTMLString';
import { National } from '~/types/data';

import { createSelectRegionHandler } from '~/components/chloropleth/selectHandlers/createSelectRegionHandler';
import { createSelectMunicipalHandler } from '~/components/chloropleth/selectHandlers/createSelectMunicipalHandler';

const Home: FCWithLayout<INationalData> = (props) => {
  const { text } = props;
  const router = useRouter();
  const [selectedMap, setSelectedMap] = useState<'municipal' | 'region'>(
    'municipal'
  );

  const isLargeScreen = useMediaQuery('(min-width: 1000px)');

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

      <article className={styles['all-numbers']}>
        <Link href="/landelijk">
          <a className={styles['all-numbers-link']}>
            {text.laatste_ontwikkelingen.alle_cijfers_link}
          </a>
        </Link>
      </article>

      <article className="index-article layout-two-column">
        <div className="column-item-no-margin column-item-small">
          <h2 className="text-max-width">
            {text.veiligheidsregio_index.selecteer_titel}
          </h2>
          <div
            className="text-max-width"
            dangerouslySetInnerHTML={{
              __html: text.veiligheidsregio_index.selecteer_toelichting,
            }}
          />
          <EscalationMapLegenda text={text} />
        </div>
        <div className="column-item-no-margin column-item">
          <SafetyRegionChloropleth
            metricName="escalation_levels"
            metricProperty="escalation_level"
            style={{ height: mapHeight }}
            onSelect={createSelectRegionHandler(router)}
            tooltipContent={escalationTooltip(router)}
          />
        </div>
      </article>

      <article className="metric-article layout-two-column">
        <div className="column-item column-item-extra-margin">
          <h3>{text.positief_geteste_personen.map_titel}</h3>
          <p>{text.positief_geteste_personen.map_toelichting}</p>
          <ChartRegionControls
            onChange={(val: 'region' | 'municipal') => setSelectedMap(val)}
          />

          {selectedMap === 'municipal' && (
            <>
              <MunicipalityLegenda
                metricName="positive_tested_people"
                title={text.positief_geteste_personen.chloropleth_legenda.titel}
              />
            </>
          )}

          {selectedMap === 'region' && (
            <>
              <SafetyRegionLegenda
                metricName="positive_tested_people"
                title={text.positief_geteste_personen.chloropleth_legenda.titel}
              />
            </>
          )}
        </div>

        <div className="column-item column-item-extra-margin">
          {selectedMap === 'municipal' && (
            <MunicipalityChloropleth
              metricName="positive_tested_people"
              tooltipContent={positiveTestedPeopleTooltip}
              onSelect={createSelectMunicipalHandler(router)}
            />
          )}
          {selectedMap === 'region' && (
            <SafetyRegionChloropleth
              metricName="positive_tested_people"
              tooltipContent={regionPositiveTestedPeopleTooltip}
              onSelect={createSelectRegionHandler(router)}
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
