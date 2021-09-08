import { DifferenceDecimal, DifferenceInteger } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { Gelijk } from '@corona-dashboard/icons';
import { Up } from '@corona-dashboard/icons';
import { Down } from '@corona-dashboard/icons';
import { useIntl } from '~/intl';
import { Container, IconContainer } from './containers';
import { Markdown } from '~/components/markdown';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { InlineText } from '~/components/typography';

export function TileDifference({
  value,
  maximumFractionDigits,
  isPercentage,
  showOldDateUnix,
  hasHigherLowerText,
}: {
  value: DifferenceDecimal | DifferenceInteger;
  maximumFractionDigits?: number;
  isPercentage?: boolean;
  showOldDateUnix?: boolean;
  hasHigherLowerText?: boolean;
}) {
  const { siteText, formatNumber, formatDateFromSeconds } = useIntl();
  const text = siteText.toe_en_afname;
  const { difference } = value;

  const formattedDifference = formatNumber(
    Math.abs(difference),
    maximumFractionDigits ? maximumFractionDigits : undefined
  );

  let content;
  let containerWithIcon;

  if (difference > 0) {
    content = hasHigherLowerText ? text.waarde_hoger : text.waarde_meer;

    containerWithIcon = <ContainerWithIcon icon={<Up />} color="red" />;
  }

  if (difference < 0) {
    content = hasHigherLowerText ? text.waarde_lager : text.waarde_minder;

    containerWithIcon = (
      <ContainerWithIcon icon={<Down />} color="data.primary" />
    );
  }

  if (!content) {
    content = text.gelijk;

    containerWithIcon = (
      <ContainerWithIcon icon={<Gelijk />} color="data.neutral" />
    );
  }

  return (
    <Container
      css={css({
        display: 'flex',
      })}
    >
      {containerWithIcon}
      <Markdown
        renderersOverrides={{
          paragraph: 'span',
          strong: (props) => (
            <InlineText fontWeight="bold">{props.children}</InlineText>
          ),
        }}
        content={replaceVariablesInText(
          `${content} ${
            showOldDateUnix ? text.dan_waarde_datum : text.vorige_waarde
          }`,
          {
            amount: `${formattedDifference}${isPercentage ? '%' : ''}`,
            date: formatDateFromSeconds(value.old_date_unix),
          }
        )}
      />
    </Container>
  );
}

interface ContainerWithIconsProps {
  icon: React.ReactNode;
  color: string;
}

function ContainerWithIcon({ icon, color }: ContainerWithIconsProps) {
  return (
    <IconContainer color={color} mr={1}>
      {icon}
    </IconContainer>
  );
}
