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
  dateUnix?: number;
  dateInsertedUnix?: number;
  datumsText: string;
}

const text = siteText.common.metadata;

export function Metadata(props: IProps) {
  const { dataSource, datumsText, dateUnix, dateInsertedUnix } = props;

  if (!dateUnix) return null;

  const dateOfReport = formatDateFromSeconds(dateUnix, 'relative');
  const dateOfInsertion = dateInsertedUnix
    ? formatDateFromSeconds(dateInsertedUnix, 'relative')
    : undefined;

  return (
    <div>
      <div className={styles.item}>
        <span>
          <ClockIcon aria-hidden />
        </span>
        <p>
          {replaceVariablesInText(datumsText, {
            dateOfReport,
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
