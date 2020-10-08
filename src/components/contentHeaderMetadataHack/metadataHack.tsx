import siteText from '~/locale/index';

import styles from './metadata.module.scss';

import ClockIcon from '~/assets/clock.svg';
import DatabaseIcon from '~/assets/database.svg';

import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { formatDateFromSeconds } from '~/utils/formatDate';

interface IProps {
  dataSourceA: {
    href: string;
    text: string;
  };
  dataSourceB: {
    href: string;
    text: string;
  };
  dateUnix?: number;
  dateInsertedUnix?: number;
  datumsText: string;
}

const text = siteText.common.metadata;

export function MetadataHack(props: IProps) {
  const {
    dataSourceA,
    dataSourceB,
    datumsText,
    dateUnix,
    dateInsertedUnix,
  } = props;

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
          <a href={dataSourceA.href} rel="noopener noreferrer" target="_blank">
            {dataSourceA.text}
          </a>
          {' & '}
          <a href={dataSourceB.href} rel="noopener noreferrer" target="_blank">
            {dataSourceB.text}
          </a>
        </p>
      </div>
    </div>
  );
}
