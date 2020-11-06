import { useContext } from 'react';
import LocaleContext, { ILocale } from '~/locale/localeContext';
import ClockIcon from '~/assets/clock.svg';
import DatabaseIcon from '~/assets/database.svg';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import styles from './metadata.module.scss';

interface IProps {
  dataSource: {
    href: string;
    text: string;
  };
  dateUnix: number;
  dateInsertedUnix?: number;
  datumsText: string;
}

export function Metadata(props: IProps) {
  const { dataSource, datumsText, dateUnix, dateInsertedUnix } = props;
  const { siteText }: ILocale = useContext(LocaleContext);

  const dateOfReport = formatDateFromSeconds(
    siteText.utils,
    dateUnix,
    'weekday-medium'
  );
  const dateOfInsertion = dateInsertedUnix
    ? formatDateFromSeconds(siteText.utils, dateInsertedUnix, 'weekday-medium')
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
          {siteText.common.metadata.source}:{' '}
          <a href={dataSource.href} rel="noopener noreferrer" target="_blank">
            {dataSource.text}
          </a>
        </p>
      </div>
    </div>
  );
}
