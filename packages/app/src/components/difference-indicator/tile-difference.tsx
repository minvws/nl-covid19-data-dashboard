import css from '@styled-system/css';
import { DifferenceDecimal, DifferenceInteger } from '@corona-dashboard/common';
import { Down, Dot, Up } from '@corona-dashboard/icons';
import { Markdown } from '~/components/markdown';
import { BoldText } from '~/components/typography';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { Container, IconContainer } from './containers';

export function TileDifference({
  value,
  maximumFractionDigits,
  isPercentage,
  showOldDateUnix,
  isAmount,
}: {
  value: DifferenceDecimal | DifferenceInteger;
  maximumFractionDigits?: number;
  isPercentage?: boolean;
  showOldDateUnix?: boolean;
  isAmount: boolean;
}) {
  const { commonTexts, formatNumber, formatDateFromSeconds } = useIntl();
  const text = commonTexts.toe_en_afname;
  const { difference } = value;

  const formattedDifference = formatNumber(
    Math.abs(difference),
    maximumFractionDigits ? maximumFractionDigits : undefined
  );

  let content;
  let containerWithIcon;

  if (difference > 0) {
    content = isAmount ? text.waarde_meer : text.waarde_hoger;

    containerWithIcon = <ContainerWithIcon icon={<Up />} color="red" />;
  }

  if (difference < 0) {
    content = isAmount ? text.waarde_minder : text.waarde_lager;

    containerWithIcon = (
      <ContainerWithIcon icon={<Down />} color="data.primary" />
    );
  }

  if (!content) {
    content = text.waarde_gelijk;

    containerWithIcon = (
      <ContainerWithIcon icon={<Dot />} color="data.neutral" />
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
          strong: (props) => <BoldText>{props.children}</BoldText>,
        }}
        content={replaceVariablesInText(
          `${content} ${
            showOldDateUnix
              ? content === text.waarde_gelijk
                ? text.vorige_waarde_geljk_datum
                : text.vorige_waarde_datum
              : text.vorige_waarde
          }`,
          {
            amount: `${formattedDifference}${isPercentage ? '%' : ''}`,
            date: showOldDateUnix
              ? formatDateFromSeconds(value.old_date_unix)
              : '',
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
