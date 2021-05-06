import { DifferenceDecimal, DifferenceInteger } from '@corona-dashboard/common';
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
import { useIntl } from '~/intl';
import { InlineText } from '~/components/typography';

interface DifferenceIndicatorProps {
  value: DifferenceDecimal | DifferenceInteger;
  isDecimal?: boolean;
  context?: 'sidebar' | 'tile' | 'inline';
  maximumFractionDigits?: number;
  staticTimespan?: string;
  absoluteMovingAverage?: number;
}

export function DifferenceIndicator(props: DifferenceIndicatorProps) {
  switch (props.context) {
    case 'sidebar':
      return <SidebarIndicator {...props} />;

    case 'inline':
      return <InlineIndicator {...props} />;

    default:
      return <TileIndicator {...props} />;
  }
}

function SidebarIndicator({
  value,
}: {
  value: DifferenceDecimal | DifferenceInteger;
}) {
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

function InlineIndicator({
  value,
  isDecimal,
  maximumFractionDigits,
}: {
  value: DifferenceDecimal | DifferenceInteger;
  isDecimal?: boolean;
  maximumFractionDigits?: number;
}) {
  const { siteText, formatPercentage, formatNumber } = useIntl();
  const text = siteText.toe_en_afname;

  const { difference } = value;

  const differenceFormattedString = isDecimal
    ? formatPercentage(
        Math.abs(difference),
        maximumFractionDigits ? { maximumFractionDigits } : undefined
      )
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

function TileIndicator({
  value,
  isDecimal,
  staticTimespan,
  maximumFractionDigits,
  absoluteMovingAverage,
}: {
  value: DifferenceDecimal | DifferenceInteger;
  isDecimal?: boolean;
  maximumFractionDigits?: number;
  staticTimespan?: string;
  absoluteMovingAverage?: number;
}) {
  const { siteText, formatNumber, formatPercentage } = useIntl();
  const text = siteText.toe_en_afname;

  const { difference } = value;

  const differenceFormattedString = isDecimal
    ? formatPercentage(
        Math.abs(difference),
        maximumFractionDigits ? { maximumFractionDigits } : undefined
      )
    : formatNumber(Math.abs(difference));

  const timespanTextNode = staticTimespan ?? text.vorige_waarde;

  if (difference > 0) {
    const splitText = text.toename.split(' ');

    if (absoluteMovingAverage)
      return (
        <Container>
          <IconContainer color="red">
            <IconUp />
          </IconContainer>
          <InlineText fontWeight="bold">
            {formatNumber(value.difference)} {siteText.toe_en_afname.hoger}{' '}
          </InlineText>
          <InlineText>
            {siteText.toe_en_afname.zeven_daags_gemiddelde}
            {` (${formatNumber(absoluteMovingAverage)})`}
          </InlineText>
        </Container>
      );

    return (
      <Container>
        <IconContainer color="red">
          <IconUp />
        </IconContainer>
        <Span fontWeight="bold" mr="0.3em">
          {differenceFormattedString} {splitText[0]}{' '}
        </Span>

        <Span color="annotation">
          {splitText[1]} {timespanTextNode}
        </Span>
      </Container>
    );
  }

  if (difference < 0) {
    if (absoluteMovingAverage)
      return (
        <Container>
          <IconContainer color="red">
            <IconUp />
          </IconContainer>
          lager dan het gemiddelde van de afgelopen 7 dagen (NUMMER)
        </Container>
      );

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

export function InlineIndicatorWithoutValue({ value }: { value: number }) {
  if (value > 0)
    return (
      <Container>
        hoger
        <IconContainer color="data.primary">
          <IconUp />
        </IconContainer>
      </Container>
    );
  if (value < 0)
    return (
      <Container>
        lager
        <IconContainer color="red">
          <IconDown />
        </IconContainer>
      </Container>
    );
  return (
    <Container>
      in lijn
      <IconContainer color="data.primary">
        <IconDown />
      </IconContainer>
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
      height: '19qpx',
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
