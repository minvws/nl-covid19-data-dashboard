import { long } from 'data/months';
import ClockIcon from 'assets/clock.svg';

interface IProps {
  dateUnix: number;
}

const dateReported: React.FC<IProps> = (props) => {
  const { dateUnix } = props;

  const date = new Date(dateUnix);
  const lastDay = `${date.getDate()} ${long[date.getMonth()]}`;

  return (
    <p className="dateReported">
      <span aria-hidden>
        <ClockIcon />
      </span>
      Waarde van {lastDay}.<br /> Wordt wekelijks bijgewerkt.
    </p>
  );
};

export default dateReported;
