import { DifferenceDecimal, DifferenceInteger } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { Gelijk } from '@corona-dashboard/icons';
import { Up } from '@corona-dashboard/icons';
import { Down } from '@corona-dashboard/icons';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { Container, IconContainer } from './containers';
import { Markdown } from '~/components/markdown';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

export function TileDifference({
  value,
  isDecimal,
  maximumFractionDigits,
  isPercentage,
  showOldDateUnix,
  hasHigherLowerText,
}: {
  value: DifferenceDecimal | DifferenceInteger;
  isDecimal?: boolean;
  maximumFractionDigits?: number;
  isPercentage?: boolean;
  showOldDateUnix?: boolean;
  hasHigherLowerText?: boolean;
}) {
  const { siteText, formatNumber, formatPercentage, formatDateFromSeconds } =
    useIntl();

  const { difference } = value;

  const differenceFormattedString = isDecimal
    ? formatPercentage(
        Math.abs(difference),
        maximumFractionDigits ? { maximumFractionDigits } : undefined
      )
    : formatNumber(Math.abs(difference));

  let content;
  let icon;

  if (difference > 0) {
    if (showOldDateUnix) {
      content = hasHigherLowerText
        ? '**{{amount}} hoger** dan de waarde van {{date}}'
        : '**{{amount}} meer dan** de waarde van {{date}}';
    } else {
      content = hasHigherLowerText
        ? '**{{amount}} hoger dan** de vorige waarde'
        : '**{{amount}} meer dan** de vorige waarde';
    }

    icon = (
      <IconContainer color="red" mr={1}>
        <Up />
      </IconContainer>
    );
  }

  if (difference < 0) {
    if (showOldDateUnix) {
      content = hasHigherLowerText
        ? '**{{amount}} minder dan** de waarde van {{date}}'
        : '**{{amount}} lager dan de** waarde van {{date}}';
    } else {
      content = hasHigherLowerText
        ? '**{{amount}} minder dan** de vorige waarde'
        : '**{{amount}} lager dan** de vorige waarde';
    }

    icon = (
      <IconContainer color="data.primary" mr={1}>
        <Down />
      </IconContainer>
    );
  }

  // When there is no increase or decrease in the difference
  if (!content) {
    content = showOldDateUnix
      ? 'gelijk dan de zelfde waarde als {{date}}'
      : 'gelijk aan de vorige waarde';

    icon = (
      <IconContainer color="data.neutral" mr={1}>
        <Gelijk />
      </IconContainer>
    );
  }

  return (
    <Container
      css={css({
        display: 'flex',
      })}
    >
      {icon}
      <Markdown
        content={replaceVariablesInText(content, {
          amount: differenceFormattedString,
          date: showOldDateUnix ? value.old_date_unix : '',
        })}
      />
    </Container>
  );

  // const { siteText, formatNumber, formatPercentage, formatDateFromSeconds } =
  //   useIntl();
  const text = siteText.toe_en_afname;

  // const { difference } = value;

  // const differenceFormattedString = isDecimal
  //   ? formatPercentage(
  //       Math.abs(difference),
  //       maximumFractionDigits ? { maximumFractionDigits } : undefined
  //     )
  //   : formatNumber(Math.abs(difference));

  const timespanTextNode = showOldDateUnix
    ? formatDateFromSeconds(value.old_date_unix)
    : text.vorige_waarde;

  if (difference > 0) {
    const splitText = hasHigherLowerText
      ? text.hoger.split(' ')
      : text.toename.split(' ');

    return (
      <Container>
        <IconContainer color="red" mr={1}>
          <Up />
        </IconContainer>
        <InlineText fontWeight="bold">
          {`${differenceFormattedString}${isPercentage ? '%' : ''} ${
            splitText[0]
          }`}
        </InlineText>{' '}
        <InlineText color="annotation">
          {`${splitText[1]} ${timespanTextNode}`}
        </InlineText>
      </Container>
    );
  }

  if (difference < 0) {
    const splitText = hasHigherLowerText
      ? text.lager.split(' ')
      : text.afname.split(' ');

    return (
      <Container>
        <IconContainer color="data.primary" mr={1}>
          <Down />
        </IconContainer>
        <InlineText fontWeight="bold">
          {`${differenceFormattedString}${isPercentage ? '%' : ''} ${
            splitText[0]
          }`}
        </InlineText>{' '}
        <InlineText>{`${splitText[1]} ${timespanTextNode}`}</InlineText>
      </Container>
    );
  }

  return (
    <Container>
      <IconContainer color="data.neutral" mr={1}>
        <Gelijk />
      </IconContainer>
      <InlineText>{`${text.gelijk} ${timespanTextNode}`}</InlineText>
    </Container>
  );
}
