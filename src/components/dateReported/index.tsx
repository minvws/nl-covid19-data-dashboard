import { long } from 'data/months';
import ClockIcon from 'assets/clock.svg';

interface IProps {
  dateUnix: number;
  hasDailyInterval?: boolean;
}

const dateReported: React.FC<IProps> = (props) => {
  const { dateUnix, hasDailyInterval } = props;

  const date = new Date(dateUnix * 1000);
  const lastDay = `${date.getDate()} ${long[date.getMonth()]}`;
  const interval = hasDailyInterval ? 'dagelijks' : 'wekelijks';

  return (
    <p className="dateReported">
      <span aria-hidden>
        <ClockIcon />
      </span>
      Waarde van {lastDay}.<br /> Wordt {interval} bijgewerkt.
    </p>
  );
};

export default dateReported;
