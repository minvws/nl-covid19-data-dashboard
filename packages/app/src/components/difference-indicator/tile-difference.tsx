import css from '@styled-system/css';
import { DifferenceDecimal, DifferenceInteger } from '@corona-dashboard/common';
import { Markdown } from '~/components/markdown';
import { BoldText } from '~/components/typography';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { Container, IconContainer } from './containers';
import { TrendDirection, TrendIcon } from '../trend-icon';

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

  const formattedDifference = formatNumber(Math.abs(difference), maximumFractionDigits ? maximumFractionDigits : undefined);

  let content: string = text.waarde_gelijk;
  let containerWithIcon: React.ReactNode = <ContainerWithIcon icon={<TrendIcon trendDirection={TrendDirection.NEUTRAL} />} color="neutral" />;

  const containerWithIconMapping = [
    {
      condition: difference > 0,
      content: isAmount ? text.waarde_meer : text.waarde_hoger,
      icon: <ContainerWithIcon icon={<TrendIcon trendDirection={TrendDirection.UP} />} color="red2" />,
    },
    {
      condition: difference < 0,
      content: isAmount ? text.waarde_minder : text.waarde_lager,
      icon: <ContainerWithIcon icon={<TrendIcon trendDirection={TrendDirection.DOWN} />} color="primary" />,
    },
  ];

  containerWithIconMapping.forEach((mapping) => {
    const { condition, content: mappingContent, icon } = mapping;
    if (condition) {
      content = mappingContent;
      containerWithIcon = icon;
    }
  });
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
          `${content} ${showOldDateUnix ? (content === text.waarde_gelijk ? text.vorige_waarde_geljk_datum : text.vorige_waarde_datum) : text.vorige_waarde}`,
          {
            amount: `${formattedDifference}${isPercentage ? '%' : ''}`,
            date: showOldDateUnix ? formatDateFromSeconds(value.old_date_unix, 'weekday-long') : '',
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
