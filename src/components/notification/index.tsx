import styles from './notification.module.scss';

import Inform from './inform.svg';
import ExternalLink from './external-link.svg';

import text from 'locale';

export default Notification;

function Notification() {
  return (
    <aside className={styles.aside}>
      <div className={styles.desktopInform}>
        <Inform />
      </div>
      <div className={styles.textgroup}>
        <div className={styles.headergroup}>
          <Inform />
          <p className={styles.header}>{text.notificatie.titel}</p>
        </div>
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
    </aside>
  );
}
