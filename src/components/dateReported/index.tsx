import ClockIcon from 'assets/clock.svg';
import { ReactElement } from 'react';

// import { FormattedMessage } from 'react-intl';
// import formatDistanceToNow from 'date-fns/formatDistanceToNow';
// import { nl } from 'date-fns/locale';

import { long } from 'data/months';
import replaceVariablesInText from 'utils/replaceVariablesInText';

interface IPropsIntl {
  children: ReactElement;
}

const DateReportedIntl: React.FC<IPropsIntl> = (props) => {
  const { children } = props;
  // const { dateUnix } = props;

  return (
    <div className="dateReported">
      <span>
        <ClockIcon aria-hidden />
      </span>
      <p>{children}</p>
      {/* <FormattedMessage
        defaultMessage="hello {relativeTime}"
        values={{
          relativeTime: formatDistanceToNow(new Date(dateUnix), {
            locale: nl,
            addSuffix: true,
          }),
        }}
      /> */}
    </div>
  );
};

interface IProps {
  dateUnix: number | undefined;
  dateInsertedUnix?: number;
  datumsText: string;
}

function formatDate(number: number) {
  const date = new Date(number * 1000);
  return `${date.getDate()} ${long[date.getMonth()]}`;
}

const DateReported: React.FC<IProps> = (props) => {
  const { datumsText, dateUnix, dateInsertedUnix } = props;

  if (!dateUnix) return null;

  const dateOfReport = formatDate(dateUnix);
  const dateOfInsertion = dateInsertedUnix
    ? formatDate(dateInsertedUnix)
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

export { DateReported, DateReportedIntl };
