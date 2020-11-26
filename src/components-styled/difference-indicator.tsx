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
import IconGelijk from '~/assets/gelijk.svg';
import IconUp from '~/assets/pijl-omhoog.svg';
import IconDown from '~/assets/pijl-omlaag.svg';
import siteText from '~/locale/index';
import { DifferenceDecimal, DifferenceInteger } from '~/types/data';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';

const text = siteText.toe_en_afname;
const DAY_IN_SECONDS = 24 * 60 * 60;

interface DifferenceIndicatorProps {
  value: DifferenceDecimal | DifferenceInteger;
  isContextSidebar?: boolean;
  isDecimal?: boolean;
}

export function DifferenceIndicator(props: DifferenceIndicatorProps) {
  const { isContextSidebar, value, isDecimal } = props;

  return isContextSidebar
    ? renderSidebarIndicator(value)
    : renderTileIndicator(value, isDecimal);
}

function renderSidebarIndicator(value: DifferenceDecimal | DifferenceInteger) {
  const { difference } = value;

  if (difference > 0) {
    return (
      <Container>
        <Span color="red">
          <IconUp />
        </Span>
      </Container>
    );
  }

  if (difference < 0) {
    return (
      <Container>
        <Span color="data.primary">
          <IconDown />
        </Span>
      </Container>
    );
  }

  return (
    <Container>
      <Span color="lightGray">
        <IconGelijk />
      </Span>
    </Container>
  );
}

function renderTileIndicator(
  value: DifferenceDecimal | DifferenceInteger,
  isDecimal?: boolean
) {
  const { difference, old_date_of_report_unix } = value;

  const differenceFormattedString = isDecimal
    ? formatPercentage(Math.abs(difference))
    : formatNumber(Math.abs(difference));

  const timespanText = getTimespanText(old_date_of_report_unix);

  if (difference > 0) {
    const splitText = text.toename.split(' ');

    return (
      <Container>
        <Span color="red">
          <IconUp />
        </Span>
        <Span fontWeight="bold" mr="0.3em">
          {`${differenceFormattedString} ${splitText[0]}`}
        </Span>
        <Span color="annotation">{`${splitText[1]} ${timespanText}`}</Span>
      </Container>
    );
  }

  if (difference < 0) {
    const splitText = text.afname.split(' ');

    return (
      <Container>
        <Span color="data.primary">
          <IconDown />
        </Span>
        <Span fontWeight="bold" mr="0.3em">
          {`${differenceFormattedString} ${splitText[0]}`}
        </Span>
        <Span>{`${splitText[1]} ${timespanText}`}</Span>
      </Container>
    );
  }

  return (
    <Container>
      <Span color="lightGray">
        <IconGelijk />
      </Span>
      <Span>{`${text.gelijk} ${timespanText}`}</Span>
    </Container>
  );
}

type SpanProps = SpaceProps & ColorProps & TypographyProps;

const Span = styled.span<SpanProps>(compose(color, space, typography));

const Container = styled.div(
  css({
    whiteSpace: 'nowrap',
    display: 'inline-block',
    fontSize: 1,
    svg: {
      mr: 1,
      width: '1em',
      verticalAlign: 'middle',
    },
  })
);

/**
 * @TODO discuss logic for this
 *
 * 6 days is more like a week
 * and 13 days more like two weeks
 *
 * Think this way we can prevent rounding errors. In our data timespans should
 * typically be a few days or a week or multiple weeks anyway.
 */
function getTimespanText(oldDate: number) {
  const days = Math.round((Date.now() / 1000 - oldDate) / DAY_IN_SECONDS);

  if (days < 2) {
    return text.tijdverloop.gisteren;
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
