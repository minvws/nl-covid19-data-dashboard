import Link from 'next/link';
import styles from './linkCard.module.scss';
import Arrow from 'assets/white-arrow-lg.svg';
import { WithChildren } from 'types';

interface IProps {
  href: string;
  icon: string;
  iconAlt: string;
  children: WithChildren;
}

export default LinkCard;

function LinkCard(props: WithChildren<IProps>) {
  const { children, href, icon, iconAlt = '' } = props;

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
