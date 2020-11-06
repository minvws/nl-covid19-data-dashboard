import { useContext } from 'react';
import LocaleContext, { ILocale } from '~/locale/localeContext';
import styles from './styles.module.scss';
import { ValueAnnotation } from '~/components-styled/value-annotation';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { formatDateFromSeconds } from '~/utils/formatDate';

type IProps = {
  title?: string;
  textKey: string;
  value?: number;
  format?: (value?: number) => string;
  descriptionDate: number;
  valueAnnotation?: string;
};

export function MetricKPI(props: IProps) {
  const { value, format, title, descriptionDate, valueAnnotation } = props;
  const { siteText }: ILocale = useContext(LocaleContext);

  const description = (text: { dateOfReport: string }) =>
    replaceVariablesInText(text.dateOfReport, {
      dateOfReport: formatDateFromSeconds(
        siteText.utils,
        descriptionDate,
        'relative'
      ),
    });

  return (
    <div className={styles.root}>
      <h4 className={styles.title}>{siteText[textKey].titel_kpi}</h4>
      <div className={styles.wrapper}>
        <p className={styles.value}>{format ? format(value) : value}</p>
        <p className={styles.description}>
          {description(siteText.common.metricKPI)}
        </p>
      </div>
      {valueAnnotation && <ValueAnnotation>{valueAnnotation}</ValueAnnotation>}
    </div>
  );
}
