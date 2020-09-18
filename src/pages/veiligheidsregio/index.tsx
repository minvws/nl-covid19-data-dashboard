import { FCWithLayout } from 'components/layout';
import { getSafetyRegionLayout } from 'components/layout/SafetyRegionLayout';
import { useRouter } from 'next/router';
import ExclamationMark from 'assets/exclamation-mark-bubble.svg';
import EmptyBubble from 'assets/empty-bubble.svg';
import text from 'locale';
import styles from 'components/chloropleth/tooltips/tooltip.module.scss';

import getLastGeneratedData from 'static-props/last-generated-data';

import SafetyRegionChloropleth, {
  thresholds,
} from 'components/chloropleth/SafetyRegionChloropleth';
import useMediaQuery from 'utils/useMediaQuery';
import { escalationTooltip } from 'components/chloropleth/tooltips/region/escalationTooltip';

const escalationThresholds = thresholds.escalation_levels.thresholds;

export const EscalationMapLegenda = () => {
  return (
    <div className={styles.legenda} aria-label="legend">
      <h4 className="text-max-width">{text.escalatie_niveau.legenda.titel}</h4>
      {escalationThresholds.map((info) => (
        <div
          className={styles.escalationInfo}
          key={`legenda-item-${info?.threshold}`}
        >
          <div className={styles.bubble}>
            {info.threshold !== 1 && <ExclamationMark fill={info?.color} />}
            {info.threshold === 1 && <EmptyBubble fill={info?.color} />}
          </div>
          <div>
            <strong>
              {
                (text.escalatie_niveau.types as any)[info.threshold.toString()]
                  .titel
              }
            </strong>
            :{' '}
            {
              (text.escalatie_niveau.types as any)[info.threshold.toString()]
                .toelichting
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
const SafetyRegion: FCWithLayout<any> = () => {
  const router = useRouter();
  const isLargeScreen = useMediaQuery('(min-width: 1000px)');

  const onSelectRegion = (context: any) => {
    router.push(
      '/veiligheidsregio/[code]/positief-geteste-mensen',
      `/veiligheidsregio/${context.vrcode}/positief-geteste-mensen`
    );
  };

  const mapHeight = isLargeScreen ? '500px' : '400px';

  return (
    <>
      <article className="map-article layout-two-column">
        <div className="column-item-no-margin column-item-small">
          <h2 className="text-max-width">
            {text.veiligheidsregio_index.selecteer_titel}
          </h2>
          <p className="text-max-width">
            {text.veiligheidsregio_index.selecteer_toelichting}
          </p>
          {isLargeScreen && <EscalationMapLegenda />}
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
        {!isLargeScreen && <EscalationMapLegenda />}
      </article>
    </>
  );
};

SafetyRegion.getLayout = getSafetyRegionLayout();
export const getStaticProps = getLastGeneratedData();

export default SafetyRegion;
