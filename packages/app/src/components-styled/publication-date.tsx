import css from '@styled-system/css';
import { formatSanityDate } from '~/utils/formatDate';

type PublicationDateProps = {
  date: string;
};

export function PublicationDate({ date }: PublicationDateProps) {
  return (
    <time css={css({ color: 'gray' })} dateTime={date}>
      {formatSanityDate(date, 'medium')}
    </time>
  );
}
