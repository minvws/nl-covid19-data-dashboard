import { useIntl } from '~/intl';

type PublicationDateProps = {
  date: string;
};

export function PublicationDate({ date }: PublicationDateProps) {
  const { formatDate } = useIntl();

  return (
    <time dateTime={date}>
      {formatDate(date ? new Date(date) : new Date(), 'medium')}
    </time>
  );
}
