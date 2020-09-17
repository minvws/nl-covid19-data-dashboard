import { FCWithLayout } from 'components/layout';
import { getSafetyRegionLayout } from 'components/layout/SafetyRegionLayout';
import { NextRouter, useRouter } from 'next/router';
import ExclamationMark from 'assets/exclamation-mark-bubble.svg';
import EmptyBubble from 'assets/empty-bubble.svg';
import text from 'locale';
import styles from './index.module.scss';

import getLastGeneratedData from 'static-props/last-generated-data';

import { ReactNode } from 'react';
import SafetyRegionChloropleth, {
  thresholds,
} from 'components/chloropleth/SafetyRegionChloropleth';
import formatDate from 'utils/formatDate';
import replaceVariablesInText from 'utils/replaceVariablesInText';
import useMediaQuery from 'utils/useMediaQuery';

const escalationThresholds = thresholds.escalation_levels.thresholds;

const escalationTooltipContent = (router: NextRouter) => {
  return (context: any): ReactNode => {
    const type: number = context?.value;

    const thresholdInfo = escalationThresholds.find(
      (value) => value.threshold === type
    );

    const onSelectRegion = (event: any) => {
      event.stopPropagation();
      event.stopImmediatePropagation();
      router.push(
        '/veiligheidsregio/[code]/positief-geteste-mensen',
        `/veiligheidsregio/${context.vrcode}/positief-geteste-mensen`
      );
    };

    return (
      type && (
        <div className={styles.escalationTooltip} onClick={onSelectRegion}>
          <div className={styles.escalationTooltipHeader}>
            <h4>{context?.vrname}</h4>
          </div>
          {
            <div className={styles.escalationInfo}>
              <div className={styles.bubble}>
                {type !== 1 && <ExclamationMark fill={thresholdInfo?.color} />}
                {type === 1 && <EmptyBubble fill={thresholdInfo?.color} />}
              </div>
              <div>
                <strong>
                  {(text.escalatie_niveau.types as any)[type].titel}
                </strong>
                : {(text.escalatie_niveau.types as any)[type].toelichting}
                <br />
                {replaceVariablesInText(text.escalatie_niveau.valid_from, {
                  validFrom: formatDate(context.valid_from_unix),
                })}
              </div>
            </div>
          }
        </div>
      )
    );
  };
};

const EscalationMapLegenda = () => {
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
            tooltipContent={escalationTooltipContent(router)}
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
