import { FCWithLayout } from 'components/layout';
import { getSafetyRegionLayout } from 'components/layout/SafetyRegionLayout';
import { useRouter } from 'next/router';
import ExclamationMark from 'assets/exclamation-mark-bubble.svg';
import text from 'locale';
import styles from './index.module.scss';

import getLastGeneratedData from 'static-props/last-generated-data';

import { ReactNode } from 'react';
import SafetyRegionChloropleth from 'components/chloropleth/SafetyRegionChloropleth';

const escalationColors = ['#FCD603', '#F79903', '#F45167'];

const escalationTooltipContent = (context: any): ReactNode => {
  const type: string = context?.value;
  return (
    type && (
      <div className={styles.escalationTooltip}>
        <h4>Situatie in {context?.vrname}</h4>
        {
          <div className={styles.escalationInfo}>
            <div className={styles.bubble}>
              <ExclamationMark
                className={`${styles[`escalationColor${type}`]}`}
              />
            </div>
            <div>
              <strong>
                {(text.escalatie_niveau.types as any)[type].titel}
              </strong>
              :&nbsp;
              {(text.escalatie_niveau.types as any)[type].toelichting}
            </div>
          </div>
        }
      </div>
    )
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

  const onSelectRegion = (context: any) => {
    router.push(
      '/veiligheidsregio/[code]/positief-geteste-mensen',
      `/veiligheidsregio/${context.vrcode}/positief-geteste-mensen`
    );
  };

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
          <div className={styles.legenda}>
            <h4 className="text-max-width">
              {text.escalatie_niveau.legenda.titel}
            </h4>

            <div className={styles.escalationInfo}>
              <div className={styles.bubble}>
                <ExclamationMark className={styles.escalationColor1} />
              </div>
              <div>
                <strong>{text.escalatie_niveau.types['1'].titel}</strong>
                :&nbsp;
                {text.escalatie_niveau.types['1'].toelichting}
              </div>
            </div>

            <div className={styles.escalationInfo}>
              <div className={styles.bubble}>
                <ExclamationMark className={styles.escalationColor2} />
              </div>
              <div>
                <strong>{text.escalatie_niveau.types['2'].titel}</strong>
                :&nbsp;
                {text.escalatie_niveau.types['2'].toelichting}
              </div>
            </div>

            <div className={styles.escalationInfo}>
              <div className={styles.bubble}>
                <ExclamationMark className={styles.escalationColor3} />
              </div>
              <div>
                <strong>{text.escalatie_niveau.types['3'].titel}</strong>
                :&nbsp;
                {text.escalatie_niveau.types['3'].toelichting}
              </div>
            </div>
          </div>
        </div>
        <div className="column-item-no-margin column-item">
          <SafetyRegionChloropleth
            metricName="escalation_levels"
            metricProperty="escalation_level"
            style={{ height: '500px' }}
            gradient={escalationColors}
            onSelect={onSelectRegion}
            tooltipContent={escalationTooltipContent}
          />
        </div>
      </article>
    </>
  );
};

SafetyRegion.getLayout = getSafetyRegionLayout();
export const getStaticProps = getLastGeneratedData();

export default SafetyRegion;
