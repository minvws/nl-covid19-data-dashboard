import { FCWithLayout } from 'components/layout';
import { getNationalLayout } from 'components/layout/NationalLayout';
import Notification from 'assets/notification.svg';
import ExclamationMark from 'assets/exclamation-mark-bubble.svg';
import ExternalLink from 'assets/external-link.svg';

import getNlData, { INationalData } from 'static-props/nl-data';

import styles from './index.module.scss';

import text from 'locale';
import TitleWithIcon from 'components/titleWithIcon';
import { ReactNode } from 'react';
import SafetyRegionChloropleth from 'components/chloropleth/SafetyRegionChloropleth';

const escalationColors = ['#FCD603', '#F79903', '#F45167'];

const tooltipContent = (context: any): ReactNode => {
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

const Home: FCWithLayout<INationalData> = () => {
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

      <article className="escalation-article layout-two-column">
        <div className="column-item-no-margin">
          <h2 className="text-max-width">{text.escalatie_niveau.titel}</h2>
          <p className="text-max-width">{text.escalatie_niveau.toelichting}</p>
          <div className={styles.legenda}>
            <h4 className="text-max-width">
              {text.escalatie_niveau.legenda.titel}
            </h4>

            <div className={styles.escalationInfo}>
              <div className={`${styles.bubble} `}>
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
        <div className="column-item">
          <SafetyRegionChloropleth
            metricName="escalation_levels"
            metricProperty="escalation_level"
            style={{ height: '500px' }}
            gradient={escalationColors}
            tooltipContent={tooltipContent}
          />
        </div>
      </article>
    </>
  );
};

Home.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default Home;
