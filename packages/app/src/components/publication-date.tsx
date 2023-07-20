import { useIntl } from '~/intl';

type PublicationDateProps = {
  date: string;
  className?: string;
};

export function PublicationDate({ date, className }: PublicationDateProps) {
  const { formatDate } = useIntl();

  return (
    <time className={className} dateTime={date}>
      {formatDate(new Date(date), 'medium')}
    </time>
  );
}
