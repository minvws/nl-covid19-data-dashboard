import Link from 'next/link';
import { WithChildren } from 'types';
import styles from './linkCard.module.scss';
import Arrow from 'assets/white-arrow-lg.svg';

interface IProps {
  href: string;
  icon: string;
  iconAlt: string;
  children: WithChildren;
}

function LinkCard({ href, icon, iconAlt = '', children }: IProps) {
  return (
    <Link href={href} passHref>
      <a className={`linkCard ${styles.linkCardLink}`}>
        <div className={styles.linkCard}>
          <img
            src={icon}
            className={styles.linkCardIcon}
            alt={iconAlt}
            loading="lazy"
          />
          <div className={styles.linkCardContent}>{children}</div>
          <Arrow className={styles.linkCardArrow} />
        </div>
      </a>
    </Link>
  );
}

export default LinkCard;
