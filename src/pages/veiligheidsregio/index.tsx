import fs from 'fs';
import { useRouter } from 'next/router';
import path from 'path';
import { EscalationLevelIcon } from '~/components-styled/escalation-level-icon';
import { MessageTile } from '~/components-styled/message-tile';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { escalationTooltip } from '~/components/choropleth/tooltips/region/escalation-tooltip';
import styles from '~/components/choropleth/tooltips/tooltip.module.scss';
import { FCWithLayout } from '~/components/layout';
import { getSafetyRegionLayout } from '~/components/layout/SafetyRegionLayout';
import { SEOHead } from '~/components/seoHead';
import { TALLLanguages } from '~/locale/index';
import { parseMarkdownInLocale } from '~/utils/parse-markdown-in-locale';

const escalationThresholds = regionThresholds.escalation_levels.thresholds;

interface EscalationMapLegendaProps {
  text: TALLLanguages;
}

export const EscalationMapLegenda = (props: EscalationMapLegendaProps) => {
  const { text } = props;

  return (
    <div className={styles.legenda} aria-label="legend">
      <h3 className="text-max-width">{text.escalatie_niveau.legenda.titel}</h3>
      {escalationThresholds.map((info) => (
        <div
          className={styles.escalationInfoLegenda}
          key={`legenda-item-${info?.threshold}`}
        >
          <div className={styles.bubbleLegenda}>
            <EscalationLevelIcon level={info.threshold} />
          </div>
          <div className={styles.escalationTextLegenda}>
            {text.escalatie_niveau.types[info.threshold].titel}
          </div>
        </div>
      ))}
    </div>
  );
};

// Passing `any` to `FCWithLayout` because we
// can't do `getStaticProps` on this page because we require
// a code, but is is the screen we select a code (safety region).
// All other pages which use `getSafetyRegionLayout` can assume
// the data is always there. Making the data optional would mean
// lots of unnecessary null checks on those pages.

const SafetyRegion: FCWithLayout<any> = (props) => {
  const router = useRouter();

  const { text } = props;

  return (
    <>
      <SEOHead
        title={text.veiligheidsregio_index.metadata.title}
        description={text.veiligheidsregio_index.metadata.description}
      />

      {text.regionaal_index.belangrijk_bericht && (
        <MessageTile message={text.regionaal_index.belangrijk_bericht} />
      )}

      <article className="index-article layout-choropleth">
        <div className="choropleth-header">
          <h2>{text.veiligheidsregio_index.selecteer_titel}</h2>
          {/**
           * This is rendering html content which has been generated from
           * markdown text.
           */}
          <div
            dangerouslySetInnerHTML={{
              __html: text.veiligheidsregio_index.selecteer_toelichting,
            }}
          />
        </div>

        <div className="choropleth-chart">
          <SafetyRegionChoropleth
            metricName="escalation_levels"
            metricValueName="escalation_level"
            onSelect={createSelectRegionHandler(router)}
            tooltipContent={escalationTooltip(router)}
          />
        </div>

        <div className="choropleth-legend">
          <EscalationMapLegenda text={text} />
        </div>
      </article>
    </>
  );
};

SafetyRegion.getLayout = getSafetyRegionLayout();

interface StaticProps {
  text: TALLLanguages;
  lastGenerated: string;
}

export async function getStaticProps(): Promise<{ props: StaticProps }> {
  const text = parseMarkdownInLocale(
    (await import('../../locale/index')).default
  );

  const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const lastGenerated = JSON.parse(fileContents).last_generated;

  return { props: { text, lastGenerated } };
}

export default SafetyRegion;
