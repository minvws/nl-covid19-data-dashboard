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
  ariaLabel,
}: {
  value: DifferenceDecimal | DifferenceInteger;
  maximumFractionDigits?: number;
  isPercentage?: boolean;
  showOldDateUnix?: boolean;
  isAmount: boolean;
  ariaLabel?: string;
}) {
  const { commonTexts, formatNumber, formatDateFromSeconds } = useIntl();
  const text = commonTexts.toe_en_afname;
  const { difference } = value;
  const TrendLabelUp = ariaLabel || commonTexts.accessibility.visual_context_accessibility_labels.up_trend_label
  const TrendLabelDown = ariaLabel || commonTexts.accessibility.visual_context_accessibility_labels.down_trend_label
  const TrendLabelNeutral = ariaLabel || commonTexts.accessibility.visual_context_accessibility_labels.neutral_trend_label

  const formattedDifference = formatNumber(
    Math.abs(difference),
    maximumFractionDigits ? maximumFractionDigits : undefined
  );

  let content;
  let containerWithIcon;

  if (difference > 0) {
    content = isAmount ? text.waarde_meer : text.waarde_hoger;

    containerWithIcon = <ContainerWithIcon icon={<Up aria-label={TrendLabelUp} />} color="red2" />;
  }

  if (difference < 0) {
    content = isAmount ? text.waarde_minder : text.waarde_lager;

    containerWithIcon = (
      <ContainerWithIcon icon={<Down aria-label={TrendLabelDown} />} color="primary" />
    );
  }

  if (!content) {
    content = text.waarde_gelijk;

    containerWithIcon = (
      <ContainerWithIcon icon={<Dot aria-label={TrendLabelNeutral} />} color="neutral" />
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
