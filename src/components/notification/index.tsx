import { FC } from 'react';

import styles from './notification.module.scss';

import Inform from './inform.svg';
import ExternalLink from './external-link.svg';

const Notification: FC = () => {
  return (
    <aside className={styles.aside}>
      <div className={styles.desktopInform}>
        <Inform />
      </div>
      <div className={styles.textgroup}>
        <div className={styles.headergroup}>
          <Inform />
          <p className={styles.header}>Toename in besmettingen COVID-19</p>
        </div>
        <p>
          Het aantal nieuwe personen dat positief getest is in Nederland neemt
          verder toe. Het reproductiegetal ligt net als vorige week boven de 1.
        </p>
      </div>
      <a
        className={styles.link}
        href="https://www.rivm.nl/coronavirus-covid-19/actueel"
        target="_blank"
        rel="noopener noreferrer"
      >
        <ExternalLink />
        <span>Bekijk de actuele informatie van het RIVM</span>
      </a>
    </aside>
  );
};

export default Notification;
