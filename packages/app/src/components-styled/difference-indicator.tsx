import css from '@styled-system/css';
import { useEffect, useState } from 'react';
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
import { formatDateFromMilliseconds } from '~/utils/formatDate';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';

const text = siteText.toe_en_afname;
const DAY_IN_SECONDS = 24 * 60 * 60;

interface DifferenceIndicatorProps {
  value: DifferenceDecimal | DifferenceInteger;
  isContextSidebar?: boolean;
  isDecimal?: boolean;
  staticTimespan?: string;
}

export function DifferenceIndicator(props: DifferenceIndicatorProps) {
  const { isContextSidebar, value, isDecimal, staticTimespan } = props;

  return isContextSidebar
    ? renderSidebarIndicator(value)
    : renderTileIndicator(value, isDecimal, staticTimespan);
}

function renderSidebarIndicator(value: DifferenceDecimal | DifferenceInteger) {
  const { difference } = value;

  if (difference > 0) {
    return (
      <Container>
        <IconContainer color="red">
          <IconUp />
        </IconContainer>
      </Container>
    );
  }

  if (difference < 0) {
    return (
      <Container>
        <IconContainer color="data.primary">
          <IconDown />
        </IconContainer>
      </Container>
    );
  }

  return (
    <Container>
      <IconContainer color="lightGray">
        <IconGelijk />
      </IconContainer>
    </Container>
  );
}

function renderTileIndicator(
  value: DifferenceDecimal | DifferenceInteger,
  isDecimal?: boolean,
  staticTimespan?: string
) {
  const { difference, old_date_unix } = value;

  const differenceFormattedString = isDecimal
    ? formatPercentage(Math.abs(difference))
    : formatNumber(Math.abs(difference));

  const timespanTextNode = staticTimespan ?? (
    <TimespanText date={old_date_unix} />
  );

  if (difference > 0) {
    const splitText = text.toename.split(' ');

    return (
      <Container>
        <IconContainer color="red">
          <IconUp />
        </IconContainer>
        <Span fontWeight="bold" mr="0.3em">
          {differenceFormattedString} {splitText[0]}
        </Span>

        <Span color="annotation">
          {splitText[1]} {timespanTextNode}
        </Span>
      </Container>
    );
  }

  if (difference < 0) {
    const splitText = text.afname.split(' ');

    return (
      <Container>
        <IconContainer color="data.primary">
          <IconDown />
        </IconContainer>
        <Span fontWeight="bold" mr="0.3em">
          {differenceFormattedString} {splitText[0]}
        </Span>
        <Span>
          {splitText[1]} {timespanTextNode}
        </Span>
      </Container>
    );
  }

  return (
    <Container>
      <IconContainer color="lightGray">
        <IconGelijk />
      </IconContainer>
      <Span>
        {text.gelijk} {timespanTextNode}
      </Span>
    </Container>
  );
}

type SpanProps = SpaceProps & ColorProps & TypographyProps;

const Span = styled.span<SpanProps>(compose(color, space, typography));
const IconContainer = styled(Span)(
  css({
    svg: {
      mr: 1,
      width: '19px',
      height: '19px',
    },
  })
);

const Container = styled.div(
  css({
    whiteSpace: 'nowrap',
    display: 'inline-block',
    fontSize: 2,
    svg: {
      mr: 1,
      width: '1.2em',
      verticalAlign: 'text-bottom',
    },
  })
);

function TimespanText({ date }: { date: number }) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const fullDate = formatDateFromMilliseconds(date * 1000, 'medium');
  const text = getTimespanText(date);

  return <Span title={fullDate}>{isMounted ? text : fullDate}</Span>;
}

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
  const days = Math.floor((Date.now() / 1000 - oldDate) / DAY_IN_SECONDS);

  if (days < 2) {
    return text.tijdverloop.gisteren;
  }

  if (days < 7) {
    return `${days} ${text.tijdverloop.dagen} ${text.tijdverloop.ervoor}`;
  }

  const weeks = Math.floor(days / 7);

  if (weeks < 2) {
    return `${weeks} ${text.tijdverloop.week.enkelvoud} ${text.tijdverloop.ervoor}`;
  }

  return `${weeks} ${text.tijdverloop.week.meervoud} ${text.tijdverloop.ervoor}`;
}
