import css from '@styled-system/css';
import { DifferenceDecimal, DifferenceInteger } from '@corona-dashboard/common';
import { Down, Dot, Up } from '@corona-dashboard/icons';
import { BoldText } from '~/components/typography';
import { useIntl } from '~/intl';
import { Container, IconContainer } from './containers';
import { Markdown } from '~/components/markdown';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { space } from '~/style/theme';

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

  const formattedDifference = formatNumber(Math.abs(difference), maximumFractionDigits ? maximumFractionDigits : undefined);

  let content;
  let containerWithIcon;

  if (difference > 0) {
    content = isAmount ? text.zeven_daags_gemiddelde_waarde_meer : text.zeven_daags_gemiddelde_waarde_hoger;

    containerWithIcon = <ContainerWithIcon icon={<Up />} color="red2" />;
  }

  if (difference < 0) {
    content = isAmount ? text.zeven_daags_gemiddelde_waarde_minder : text.zeven_daags_gemiddelde_waarde_lager;

    containerWithIcon = <ContainerWithIcon icon={<Down />} color="primary" />;
  }

  if (!content) {
    content = text.zeven_daags_gemiddelde_waarde_gelijk;

    containerWithIcon = <ContainerWithIcon icon={<Dot />} color="neutral" />;
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
      <IconContainer color={color} marginRight={space[1]}>
        {icon}
      </IconContainer>
    );
  }
}
