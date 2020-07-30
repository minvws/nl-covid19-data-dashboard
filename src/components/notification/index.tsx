import { FC } from 'react';

import styles from './notification.module.scss';

import Inform from './inform.svg';
import ExternalLink from './external-link.svg';

const Notification: FC = () => {
  return (
    <aside className={styles.aside}>
      <div>
        <div className={styles.headergroup}>
          <Inform />
          <p className={styles.header}>
            We zien een toename in het aantal COVID-19 besmettingen
          </p>
        </div>
        <p>
          Het nieuwe coronavirus verspreidt zich weer meer in Nederland. Het
          aantal mensen dat besmet is met het nieuwe coronavirus neemt toe. In
          de teststraten stijgt het percentage positieve testen en het
          reproductiegetal (Rt Real Time) ligt boven de 1.
        </p>
      </div>
      <a
        className={styles.link}
        href="https://www.rivm.nl/nieuws/aantal-besmettingen-covid-19-neemt-verder-toe"
      >
        <ExternalLink />
        <span>Lees het gehele bericht van de RIVM</span>
      </a>
    </aside>
  );
};

export default Notification;
