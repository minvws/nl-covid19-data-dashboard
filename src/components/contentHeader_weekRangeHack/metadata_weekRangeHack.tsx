import ClockIcon from '~/assets/clock.svg';
import DatabaseIcon from '~/assets/database.svg';
import siteText from '~/locale/index';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import styles from './metadata.module.scss';

interface IProps {
  dataSource: {
    href: string;
    text: string;
  };
  /**
   * These all depend on each other so really the text should be passed in
   * already formatted. There is no point in using separate props for this.
   */
  weekStartUnix: number;
  weekEndUnix: number;
  dateOfInsertionUnix: number;
  datumsText: string;
}

const text = siteText.common.metadata;

export function Metadata(props: IProps) {
  const {
    dataSource,
    datumsText,
    weekStartUnix,
    weekEndUnix,
    dateOfInsertionUnix,
  } = props;

  const weekStart = formatDateFromSeconds(weekStartUnix, 'relative');
  const weekEnd = formatDateFromSeconds(weekEndUnix, 'relative');
  const dateOfInsertion = formatDateFromSeconds(
    dateOfInsertionUnix,
    'relative'
  );

  return (
    <div>
      <div className={styles.item}>
        <span>
          <ClockIcon aria-hidden />
        </span>
        <p>
          {replaceVariablesInText(datumsText, {
            weekStart,
            weekEnd,
            dateOfInsertion,
          })}
        </p>
      </div>

      <div className={styles.item}>
        <span>
          <DatabaseIcon aria-hidden />
        </span>
        <p>
          {text.source}:{' '}
          <a href={dataSource.href} rel="noopener noreferrer" target="_blank">
            {dataSource.text}
          </a>
        </p>
      </div>
    </div>
  );
}
