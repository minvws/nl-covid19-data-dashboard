import { TimestampedValue } from '@corona-dashboard/common';
import { ReactNode } from 'react';
import { ArrowIconRight } from '~/components/arrow-icon';
import { Box } from '~/components/base';
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
  const intl = useIntl();

  const { icon, title, text, trendData, metricProperty, href } = props;

  const value = trendData[trendData.length - 1][metricProperty];

  const { sm } = useBreakpoints(true);

  return (
    <Box position="relative" pb={{ _: '1.5rem', md: 0 }}>
      <Box width="4rem" height="4rem" position="absolute" left={0} mr={1}>
        {icon}
      </Box>
      <Heading
        level={3}
        as="h2"
        py={2}
        pl="3.5rem"
        mb={2}
        lineHeight={{ md: 0, lg: 1 }}
        fontSize="1.25rem"
      >
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
      <Text
        fontSize="2.25rem"
        fontWeight="bold"
        my={0}
        lineHeight={0}
        mb={2}
        data-cy={metricProperty}
      >
        {intl.formatNumber(value as unknown as number)}
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
            type: 'split-bar',
            label: title,
            fillOpacity: 1,
            splitPoints: [
              {
                color: colors.data.scale.blue[0],
                label: intl.siteText.escalatie_niveau.types['1'].titel,
                value: 1100,
              },
              {
                color: colors.data.scale.blue[1],
                label: intl.siteText.escalatie_niveau.types['2'].titel,
                value: 2600,
              },
              {
                color: colors.data.scale.blue[2],
                label: intl.siteText.escalatie_niveau.types['3'].titel,
                value: 4800,
              },
              {
                color: colors.data.scale.blue[4],
                label: intl.siteText.escalatie_niveau.types['4'].titel,
                value: Infinity,
              },
            ],
          },
        ]}
      />
    </Box>
  );
}
