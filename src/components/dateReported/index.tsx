import ClockIcon from 'assets/clock.svg';

import replaceVariablesInText from 'utils/replaceVariablesInText';
import formatDate from 'utils/formatDate';

interface IProps {
  dateUnix: number | undefined;
  dateInsertedUnix?: number;
  datumsText: string;
}

export default dateReported;

function dateReported(props: IProps) {
  const { datumsText, dateUnix, dateInsertedUnix } = props;

  if (!dateUnix) return null;

  const dateOfReport = formatDate(dateUnix * 1000, 'relative');
  const dateOfInsertion = dateInsertedUnix
    ? formatDate(dateInsertedUnix * 1000, 'relative')
    : undefined;

  return (
    <div className="dateReported">
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
  );
}
