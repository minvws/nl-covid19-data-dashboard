import ClockIcon from 'assets/clock.svg';

import replaceVariablesInText from 'utils/replaceVariablesInText';
import formatDate from 'utils/formatDate';

interface IProps {
  dateUnix: number | undefined;
  dateInsertedUnix?: number;
  datumsText: string;
}

const dateReported: React.FC<IProps> = (props) => {
  const { datumsText, dateUnix, dateInsertedUnix } = props;

  if (!dateUnix) return null;

  const dateOfReport = formatDate(dateUnix * 1000);
  const dateOfInsertion = dateInsertedUnix
    ? formatDate(dateInsertedUnix * 1000)
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
};

export default dateReported;
