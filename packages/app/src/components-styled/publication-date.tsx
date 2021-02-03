import css from '@styled-system/css';
import { formatDateFromString } from '~/utils/formatDate';

type PublicationDateProps = {
  date: string;
};

export function PublicationDate({ date }: PublicationDateProps) {
  return (
    <time css={css({ color: 'annotation' })} dateTime={date}>
      {formatDateFromString(date, 'medium')}
    </time>
  );
}
