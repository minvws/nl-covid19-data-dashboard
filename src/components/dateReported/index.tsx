import ClockIcon from 'assets/clock.svg';
import styles from './dateReported.module.scss';

const DateReported: React.FC = (props) => {
  const { children } = props;

  return (
    <div className={styles.dateReported}>
      <span>
        <ClockIcon aria-hidden />
      </span>
      <p>{children}</p>
    </div>
  );
};

export { DateReported };
