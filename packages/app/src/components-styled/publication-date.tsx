import css from '@styled-system/css';
import { formatDate } from '~/utils/formatDate';

type PublicationDateProps = {
  date: string;
};

export function PublicationDate({ date }: PublicationDateProps) {
  return (
    <time css={css({ color: 'annotation' })} dateTime={date}>
      {formatDate(new Date(date), 'medium')}
    </time>
  );
}
