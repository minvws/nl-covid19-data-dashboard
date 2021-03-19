import css from '@styled-system/css';
import { useIntl } from '~/intl';

type PublicationDateProps = {
  date: string;
};

export function PublicationDate({ date }: PublicationDateProps) {
  const { formatDate } = useIntl();

  return (
    <time css={css({ color: 'annotation' })} dateTime={date}>
      {formatDate(new Date(date), 'medium')}
    </time>
  );
}
