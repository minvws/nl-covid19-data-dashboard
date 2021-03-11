import {
  DifferenceDecimal,
  DifferenceInteger,
  formatNumber,
  formatPercentage,
} from '@corona-dashboard/common';
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

const text = siteText.toe_en_afname;

interface DifferenceIndicatorProps {
  value: DifferenceDecimal | DifferenceInteger;
  isDecimal?: boolean;
  context?: 'sidebar' | 'tile' | 'inline';
  staticTimespan?: string;
  differenceFractionDigits?: number;
}

export function DifferenceIndicator(props: DifferenceIndicatorProps) {
  const {
    value,
    isDecimal,
    context,
    staticTimespan,
    differenceFractionDigits,
  } = props;

  if (context === 'sidebar') {
    return renderSidebarIndicator(value);
  }

  if (context === 'inline') {
    return renderInlineIndicator(value, isDecimal, differenceFractionDigits);
  }

  return renderTileIndicator(
    value,
    isDecimal,
    staticTimespan,
    differenceFractionDigits
  );
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

function renderInlineIndicator(
  value: DifferenceDecimal | DifferenceInteger,
  isDecimal?: boolean,
  differenceFractionDigits?: number
) {
  const { difference } = value;

  const differenceFormattedString = isDecimal
    ? formatPercentage(Math.abs(difference), differenceFractionDigits)
    : formatNumber(Math.abs(difference));

  if (difference > 0) {
    const splitText = text.toename.split(' ');

    return (
      <Container>
        <Span fontWeight="bold">{differenceFormattedString}</Span>
        <IconContainer color="red">
          <IconUp />
        </IconContainer>
        <Span>{splitText[0]}</Span>
      </Container>
    );
  }

  if (difference < 0) {
    const splitText = text.afname.split(' ');

    return (
      <Container>
        <Span fontWeight="bold">{differenceFormattedString}</Span>
        <IconContainer color="data.primary">
          <IconDown />
        </IconContainer>
        <Span>{splitText[0]}</Span>
      </Container>
    );
  }

  return (
    <Container>
      <IconContainer color="lightGray">
        <IconGelijk />
      </IconContainer>
      <Span>{text.gelijk}</Span>
    </Container>
  );
}

function renderTileIndicator(
  value: DifferenceDecimal | DifferenceInteger,
  isDecimal?: boolean,
  staticTimespan?: string,
  maximumFractionDigits?: number
) {
  const { difference } = value;

  const differenceFormattedString = isDecimal
    ? formatPercentage(Math.abs(difference), maximumFractionDigits)
    : formatNumber(Math.abs(difference));

  const timespanTextNode = staticTimespan ?? text.vorige_waarde;

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

const Container = styled.span(
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
