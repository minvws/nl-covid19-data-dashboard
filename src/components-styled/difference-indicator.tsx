import css from '@styled-system/css';
import styled from 'styled-components';
import {
  color,
  ColorProps,
  compose,
  space,
  SpaceProps,
  typography,
  TypographyProps,
} from 'styled-system';
import IconUp from '~/assets/pijl-omhoog.svg';
import IconDown from '~/assets/pijl-omlaag.svg';
import siteText from '~/locale/index';
import { DifferenceDecimal, DifferenceInteger } from '~/types/data';

const text = siteText.toe_en_afname;

type SpanProps = SpaceProps & ColorProps & TypographyProps;

const Span = styled.span<SpanProps>(
  compose(
    color,
    space,
    typography
    // css({
    //   whiteSpace: 'nowrap',
    //   display: 'inline-block',
    //   fontFamily: 'body',

    //   lineHeight: 2,
    // })
  )
);

const Container = styled.div(
  css({
    whiteSpace: 'nowrap',
    display: 'inline-block',
    fontSize: 1,
    lineHeight: 2,

    svg: {
      mr: 1,
      width: '12px',
      verticalAlign: 'middle',
    },
  })
);

interface DifferenceIndicatorProps {
  difference: DifferenceDecimal | DifferenceInteger;
  lastDateOfReport: number;
}

export function DifferenceIndicator(props: DifferenceIndicatorProps) {
  const { difference, old_date_of_report_unix } = props.difference;

  const timespanText = getTimespanText(
    old_date_of_report_unix,
    props.lastDateOfReport
  );

  if (difference > 0) {
    const splitText = text.toename.split(' ');

    return (
      <Container>
        <Span color="red">
          <IconUp />
        </Span>
        <Span fontWeight="bold" mr="0.3em">
          {`${difference} ${splitText[0]}`}
        </Span>
        <Span color="annotation">{`${splitText[1]} ${timespanText}`}</Span>
      </Container>
    );
  }

  if (difference < 0) {
    const splitText = text.afname.split(' ');

    <Container>
      <Span color="green">
        <IconDown />
      </Span>
      <Span fontWeight="bold" mr="0.3em">
        {splitText[0]}
      </Span>
      <Span>{`${splitText[1]} ${timespanText}`}</Span>
    </Container>;
  }

  /**
   * @TODO discuss what to do for equal values. Maybe nothing
   */
  return null;
}

const DAY_IN_SECONDS = 24 * 60 * 60;

function getTimespanText(oldDate: number, newDate: number) {
  const days = Math.round((newDate - oldDate) / DAY_IN_SECONDS);

  /**
   * @TODO discuss logic for this
   *
   * 6 days is more like a week
   * and 13 days more like two weeks
   *
   * Think this way we can prevent rounding errors. In our data timespans should
   * typically be a few days or a week or multiple weeks anyway.
   */

  if (days < 2) {
    return `${text.tijdverloop.gisteren}`;
  }

  if (days < 6) {
    return `${days} ${text.tijdverloop.dagen} ${text.tijdverloop.geleden}`;
  }

  const weeks = Math.round(days / 7);

  if (weeks < 2) {
    return `${weeks} ${text.tijdverloop.week.enkelvoud} ${text.tijdverloop.geleden}`;
  }

  return `${weeks} ${text.tijdverloop.week.meervoud} ${text.tijdverloop.geleden}`;
}
