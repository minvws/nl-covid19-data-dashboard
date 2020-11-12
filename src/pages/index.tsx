import fs from 'fs';
import { useRouter } from 'next/router';
import path from 'path';
import { useState } from 'react';
import ExternalLink from '~/assets/external-link.svg';
import Notification from '~/assets/notification.svg';
import { useSafetyRegionLegendaData } from '~/components/choropleth/legenda/hooks/use-safety-region-legenda-data';
import { MunicipalityChoropleth } from '~/components/choropleth/municipality-choropleth';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectMunicipalHandler } from '~/components/choropleth/select-handlers/create-select-municipal-handler';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { createPositiveTestedPeopleMunicipalTooltip } from '~/components/choropleth/tooltips/municipal/create-positive-tested-people-municipal-tooltip';
import { createPositiveTestedPeopleRegionalTooltip } from '~/components/choropleth/tooltips/region/create-positive-tested-people-regional-tooltip';
import { escalationTooltip } from '~/components/choropleth/tooltips/region/escalation-tooltip';
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
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import css from '@styled-system/css';

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
  const { data, text, escalationLevelCounts } = props;
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
      <article
        className={styles.notification}
        css={css({ mb: 4, ml: [-4, null, 0], mr: [-4, null, 0] })}
      >
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
          metricValueName="escalation_level"
          onSelect={createSelectRegionHandler(router)}
          tooltipContent={escalationTooltip(router)}
        />
      </ChoroplethTile>

      <ChoroplethTile
        title={text.positief_geteste_personen.map_titel}
        metadata={{
          date:
            data.infected_people_delta_normalized.last_value
              .date_of_report_unix,
          source: text.positief_geteste_personen.bron,
        }}
        description={text.positief_geteste_personen.map_toelichting}
        onChangeControls={setSelectedMap}
        legend={
          legendItems // this data value should probably not be optional
            ? {
                title: text.positief_geteste_personen.chloropleth_legenda.titel,
                items: legendItems,
              }
            : undefined
        }
      >
        {selectedMap === 'municipal' && (
          <MunicipalityChoropleth
            metricName="positive_tested_people"
            tooltipContent={createPositiveTestedPeopleMunicipalTooltip(router)}
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
      </ChoroplethTile>
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
