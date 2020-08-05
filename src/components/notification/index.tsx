import { FC } from 'react';

import styles from './notification.module.scss';

import Inform from './inform.svg';
import ExternalLink from './external-link.svg';

import text from 'locale';

const Notification: FC = () => {
  return (
    <aside className={styles.aside}>
      <div className={styles.desktopInform}>
        <Inform />
      </div>
      <div className={styles.textgroup}>
        <div className={styles.headergroup}>
          <Inform />
          <p className={styles.header}>{text.notificatie.titel.translation}</p>
        </div>
        <p>{text.notificatie.bericht.translation}</p>
      </div>
      <a
        className={styles.link}
        href={text.notificatie.link.href.translation}
        target="_blank"
        rel="noopener noreferrer"
      >
        <ExternalLink />
        <span>{text.notificatie.link.text.translation}</span>
      </a>
    </aside>
  );
};

export default Notification;
