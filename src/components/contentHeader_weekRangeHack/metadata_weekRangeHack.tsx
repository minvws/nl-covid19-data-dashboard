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
  /**
   * These all depend on each other so really the text should be passed in
   * already formatted. There is no point in using separate props for this.
   */
  weekStartUnix: number;
  weekEndUnix: number;
  dateOfInsertionUnix: number;
  datumsText: string;
}

export function Metadata(props: IProps) {
  const {
    dataSource,
    datumsText,
    weekStartUnix,
    weekEndUnix,
    dateOfInsertionUnix,
  } = props;
  const { siteText }: ILocale = useContext(LocaleContext);

  const weekStart = formatDateFromSeconds(
    siteText.utils,
    weekStartUnix,
    'relative'
  );
  const weekEnd = formatDateFromSeconds(
    siteText.utils,
    weekEndUnix,
    'relative'
  );
  const dateOfInsertion = formatDateFromSeconds(
    siteText.utils,
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
          {siteText.common.metadata.source}:{' '}
          <a href={dataSource.href} rel="noopener noreferrer" target="_blank">
            {dataSource.text}
          </a>
        </p>
      </div>
    </div>
  );
}
