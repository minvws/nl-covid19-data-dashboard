import fs from 'fs';
import { useRouter } from 'next/router';
import path from 'path';
import { useState } from 'react';
import ExternalLink from '~/assets/external-link.svg';
import Notification from '~/assets/notification.svg';
import { ChartRegionControls } from '~/components-styled/chart-region-controls';
import { ChoroplethLegenda } from '~/components/choropleth/legenda/ChoroplethLegenda';
import { useSafetyRegionLegendaData } from '~/components/choropleth/legenda/hooks/useSafetyRegionLegendaData';
import { MunicipalityChoropleth } from '~/components/choropleth/MunicipalityChoropleth';
import { SafetyRegionChoropleth } from '~/components/choropleth/SafetyRegionChoropleth';
import { createSelectMunicipalHandler } from '~/components/choropleth/selectHandlers/createSelectMunicipalHandler';
import { createSelectRegionHandler } from '~/components/choropleth/selectHandlers/createSelectRegionHandler';
import { createPositiveTestedPeopleMunicipalTooltip } from '~/components/choropleth/tooltips/municipal/createPositiveTestedPeopleMunicipalTooltip';
import { createPositiveTestedPeopleRegionalTooltip } from '~/components/choropleth/tooltips/region/createPositiveTestedPeopleRegionalTooltip';
import { escalationTooltip } from '~/components/choropleth/tooltips/region/escalationTooltip';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { TitleWithIcon } from '~/components/titleWithIcon';
import { TALLLanguages } from '~/locale/index';
import { National, Regions, EscalationLevels } from '~/types/data';
import { MDToHTMLString } from '~/utils/MDToHTMLString';
import styles from './index.module.scss';
import { EscalationMapLegenda } from './veiligheidsregio';
import { assert } from '~/utils/assert';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

interface StaticProps {
  props: INationalHomepageData;
}

interface INationalHomepageData {
  data: National;
  text: TALLLanguages;
  lastGenerated: string;
  escalationLevelCounts: EscalationLevelCounts;
}

/*
 * The keys in this object are used to find and replace values in the translation files.
 * Adjustments here need to be applied in Lokalize too.
 * This is also why the keys are a bit more verbose.
 */
type EscalationLevelCounts = {
  escalationLevel1: number;
  escalationLevel2: number;
  escalationLevel3: number;
  escalationLevel4: number;
  escalationLevel5: number;
};

const Home: FCWithLayout<INationalHomepageData> = (props) => {
  const { text, escalationLevelCounts } = props;
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
          <p>
            {replaceVariablesInText(
              text.notificatie.bericht,
              escalationLevelCounts
            )}
          </p>
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

      <article className="metric-article layout-choropleth">
        <div className="choropleth-header">
          <h2>{text.veiligheidsregio_index.selecteer_titel}</h2>
          <div
            dangerouslySetInnerHTML={{
              __html: text.veiligheidsregio_index.selecteer_toelichting,
            }}
          />
          <EscalationMapLegenda text={text} />
        </div>
        <div className="choropleth-chart">
          <SafetyRegionChoropleth
            metricName="escalation_levels"
            metricValueName="escalation_level"
            onSelect={createSelectRegionHandler(router)}
            tooltipContent={escalationTooltip(router)}
          />
        </div>
      </article>

      <article className="metric-article layout-choropleth">
        <div className="choropleth-header">
          <h3>{text.positief_geteste_personen.map_titel}</h3>
          <p>{text.positief_geteste_personen.map_toelichting}</p>
          <div className="choropleth-controls">
            <ChartRegionControls
              onChange={(val: 'region' | 'municipal') => setSelectedMap(val)}
            />
          </div>
        </div>

        <div className="choropleth-chart">
          {selectedMap === 'municipal' && (
            <MunicipalityChoropleth
              metricName="positive_tested_people"
              tooltipContent={createPositiveTestedPeopleMunicipalTooltip(
                router
              )}
              onSelect={createSelectMunicipalHandler(router)}
            />
          )}
          {selectedMap === 'region' && (
            <SafetyRegionChoropleth
              metricName="positive_tested_people"
              tooltipContent={createPositiveTestedPeopleRegionalTooltip(router)}
              onSelect={createSelectRegionHandler(router)}
            />
          )}
        </div>

        <div className="choropleth-legend">
          {legendItems && (
            <ChoroplethLegenda
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

/**
 * Calculate the counts of regions with a certain escalation level
 */
const getEscalationCounts = (
  escalationLevels?: EscalationLevels[]
): EscalationLevelCounts => {
  const counts: EscalationLevelCounts = {
    escalationLevel1: 0,
    escalationLevel2: 0,
    escalationLevel3: 0,
    escalationLevel4: 0,
    escalationLevel5: 0,
  };

  if (escalationLevels) {
    escalationLevels.forEach((region) => {
      assert(
        [1, 2, 3, 4, 5].indexOf(region.escalation_level) !== -1,
        'Escalation level not supported. Value needs to be 1-5.'
      );
      const key = `escalationLevel${region.escalation_level}` as keyof EscalationLevelCounts;
      counts[key] += 1;
    });
  }

  return counts;
};

export async function getStaticProps(): Promise<StaticProps> {
  const text = (await import('../locale/index')).default;

  const serializedContent = MDToHTMLString(
    text.veiligheidsregio_index.selecteer_toelichting
  );

  text.veiligheidsregio_index.selecteer_toelichting = serializedContent;

  const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContents) as National;
  const lastGenerated = data.last_generated;

  const regionsFilePath = path.join(
    process.cwd(),
    'public',
    'json',
    'REGIONS.json'
  );
  const regionsFileContents = fs.readFileSync(regionsFilePath, 'utf8');
  const regionsData = JSON.parse(regionsFileContents) as Regions;

  const escalationLevels = regionsData.escalation_levels;
  const escalationLevelCounts = getEscalationCounts(escalationLevels);

  return { props: { data, escalationLevelCounts, text, lastGenerated } };
}

export default Home;
