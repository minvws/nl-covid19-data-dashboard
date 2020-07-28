import ClockIcon from 'assets/clock.svg';
import { ReactElement } from 'react';

interface IProps {
  children: ReactElement;
}

const DateReported: React.FC<IProps> = (props) => {
  const { children } = props;

  return (
    <div className="dateReported">
      <span>
        <ClockIcon aria-hidden />
      </span>
      <p>{children}</p>
    </div>
  );
};

export default DateReported;
