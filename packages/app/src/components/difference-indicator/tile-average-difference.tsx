import { DifferenceDecimal, DifferenceInteger } from '@corona-dashboard/common';
import { Down, Gelijk, Up } from '@corona-dashboard/icons';
import { InlineText } from '~/components/typography';
import css from '@styled-system/css';
import { useIntl } from '~/intl';
import { Container, IconContainer } from './containers';
import { Markdown } from '~/components/markdown';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

export function TileAverageDifference({
  value,
  isPercentage,
  isAmount,
  maximumFractionDigits,
}: {
  value: DifferenceDecimal | DifferenceInteger;
  isPercentage?: boolean;
  isAmount: boolean;
  maximumFractionDigits?: number;
}) {
  const { commonTexts, formatNumber } = useIntl();
  const { difference, old_value } = value;
  const text = commonTexts.toe_en_afname;

  const formattedDifference = formatNumber(
    Math.abs(difference),
    maximumFractionDigits ? maximumFractionDigits : undefined
  );

  let content;
  let containerWithIcon;

  if (difference > 0) {
    content = isAmount
      ? text.zeven_daags_gemiddelde_waarde_meer
      : text.zeven_daags_gemiddelde_waarde_hoger;

    containerWithIcon = <ContainerWithIcon icon={<Up />} color="red" />;
  }

  if (difference < 0) {
    content = isAmount
      ? text.zeven_daags_gemiddelde_waarde_minder
      : text.zeven_daags_gemiddelde_waarde_lager;

    containerWithIcon = (
      <ContainerWithIcon icon={<Down />} color="data.primary" />
    );
  }

  if (!content) {
    content = text.zeven_daags_gemiddelde_waarde_gelijk;

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
        content={replaceVariablesInText(content, {
          amount: `${formattedDifference}${isPercentage ? '%' : ''}`,
          totalAverage: formatNumber(old_value),
        })}
      />
    </Container>
  );

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
}
