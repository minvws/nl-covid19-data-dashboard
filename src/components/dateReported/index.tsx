import { long } from 'data/months';

import ClockIcon from 'assets/clock.svg';

import replaceVariablesInText from 'utils/replaceVariablesInText';

interface IProps {
  dateUnix: number | undefined;
  dateInsertedUnix?: number;
  datumsText: string;
}

function formatDate(number: number) {
  const date = new Date(number * 1000);
  return `${date.getDate()} ${long[date.getMonth()]}`;
}

const dateReported: React.FC<IProps> = (props) => {
  const { datumsText, dateUnix, dateInsertedUnix } = props;

  if (!dateUnix) return null;

  const dateOfReport = formatDate(dateUnix);
  const dateOfInsertion = dateInsertedUnix
    ? formatDate(dateInsertedUnix)
    : undefined;

  return (
    <div className="dateReported">
      <ClockIcon aria-hidden />
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
