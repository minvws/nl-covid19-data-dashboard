import path from 'path';
import fs from 'fs';

import { FCWithLayout } from 'components/layout';
import { getSafetyRegionLayout } from 'components/layout/SafetyRegionLayout';
import { useRouter } from 'next/router';
import EscalationLevel1 from 'assets/niveau-1.svg';
import EscalationLevel2 from 'assets/niveau-2.svg';
import EscalationLevel3 from 'assets/niveau-3.svg';
import styles from 'components/chloropleth/tooltips/tooltip.module.scss';

import siteText from 'locale';
import MDToHTMLString from 'utils/MDToHTMLString';

import SafetyRegionChloropleth, {
  thresholds,
} from 'components/chloropleth/SafetyRegionChloropleth';
import useMediaQuery from 'utils/useMediaQuery';
import { escalationTooltip } from 'components/chloropleth/tooltips/region/escalationTooltip';

const escalationThresholds = thresholds.escalation_levels.thresholds;

export const EscalationMapLegenda = (props: any) => {
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
            {info.threshold === 1 && <EscalationLevel1 color={info?.color} />}
            {info.threshold === 2 && <EscalationLevel2 color={info?.color} />}
            {info.threshold === 3 && <EscalationLevel3 color={info?.color} />}
          </div>
          <div className={styles.escalationTextLegenda}>
            {
              (text.escalatie_niveau.types as any)[info.threshold.toString()]
                .titel
            }
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
  const isLargeScreen = useMediaQuery('(min-width: 1000px)');

  const { text } = props;

  const onSelectRegion = (context: any) => {
    router.push(
      '/veiligheidsregio/[code]/positief-geteste-mensen',
      `/veiligheidsregio/${context.vrcode}/positief-geteste-mensen`
    );
  };

  const mapHeight = isLargeScreen ? '500px' : '400px';

  return (
    <>
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
            onSelect={onSelectRegion}
            tooltipContent={escalationTooltip(router)}
          />
        </div>
      </article>
    </>
  );
};

SafetyRegion.getLayout = getSafetyRegionLayout();

interface StaticProps {
  props: {
    text: typeof siteText;
    lastGenerated: string;
  };
}

export async function getStaticProps(): Promise<StaticProps> {
  const text = require('../../locale/index').default;

  const serializedContent = MDToHTMLString(
    text.veiligheidsregio_index.selecteer_toelichting
  );

  text.veiligheidsregio_index.selecteer_toelichting = serializedContent;

  const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const lastGenerated = JSON.parse(fileContents).last_generated;

  return { props: { text, lastGenerated } };
}

export default SafetyRegion;
