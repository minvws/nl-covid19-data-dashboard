import { TimestampedValue } from '@corona-dashboard/common';
import { ReactNode } from 'react';
import { ArrowIconRight } from '~/components/arrow-icon';
import { Box } from '~/components/base';
import { IconContainer } from '~/components/icon-container';
import { NumberProperty } from '~/components/line-chart/logic';
import { LinkWithIcon } from '~/components/link-with-icon';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { Heading, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { useBreakpoints } from '~/utils/use-breakpoints';

type MiniTrendTileProps<T extends TimestampedValue> = {
  icon: JSX.Element;
  title: string;
  text: ReactNode;
  trendData: T[];
  metricProperty: NumberProperty<T>;
  href: string;
};

export function MiniTrendTile<T extends TimestampedValue>(
  props: MiniTrendTileProps<T>
) {
  const { formatNumber } = useIntl();

  const { icon, title, text, trendData, metricProperty, href } = props;

  const value = trendData[trendData.length - 1][metricProperty];

  const { sm } = useBreakpoints(true);

  return (
    <Box pb={{ _: '1.5rem', md: 0 }}>
      <Box display="flex" alignItems="center">
        <IconContainer width="2rem" height="2.5rem">
          {icon}
        </IconContainer>
        <Heading level={3} as="h2" mb={0} fontSize="1.25rem">
          <LinkWithIcon
            href={href}
            icon={<ArrowIconRight />}
            iconPlacement="right"
            fontWeight="bold"
            headingLink
          >
            {title}
          </LinkWithIcon>
        </Heading>
      </Box>
      <Text
        fontSize="2.25rem"
        fontWeight="bold"
        my={0}
        lineHeight={0}
        mb={2}
        data-cy={metricProperty}
      >
        {formatNumber((value as unknown) as number)}
      </Text>

      <Box>{text}</Box>

      <TimeSeriesChart
        initialWidth={400}
        minHeight={sm ? 180 : 140}
        timeframe="5weeks"
        values={trendData}
        displayTooltipValueOnly
        numGridLines={2}
        seriesConfig={[
          {
            metricProperty,
            type: 'area',
            label: title,
            color: colors.data.primary,
          },
        ]}
      />
    </Box>
  );
}
