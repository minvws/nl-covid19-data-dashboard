import { TimestampedValue } from '@corona-dashboard/common';
import { ReactNode } from 'react';
import { ArrowIconRight } from '~/components/arrow-icon';
import { Box } from '~/components/base';
import { ErrorBoundary } from '~/components/error-boundary';
import { LinkWithIcon } from '~/components/link-with-icon';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { Heading, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { useBreakpoints } from '~/utils/use-breakpoints';

// This type limits the allowed property names to those with a number type,
// so its like keyof T, but filtered down to only the appropriate properties.
type NumberProperty<T extends TimestampedValue> = {
  [K in keyof T]: T[K] extends number | null ? K : never;
}[keyof T];

export type MiniTrendTileProps<T extends TimestampedValue = TimestampedValue> =
  {
    icon: JSX.Element;
    title: string;
    text: ReactNode;
    trendData: T[];
    metricProperty: NumberProperty<T>;
    href: string;
    areas?: { header: string; chart: string };
  };

export function MiniTrendTile<T extends TimestampedValue>(
  props: MiniTrendTileProps<T>
) {
  const { formatNumber } = useIntl();

  const { icon, title, text, trendData, metricProperty, href, areas } = props;

  const value = trendData[trendData.length - 1][metricProperty];

  const { sm } = useBreakpoints(true);

  return (
    <>
      <Box gridArea={areas?.header} position="relative">
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
          {formatNumber(value as unknown as number)}
        </Text>

        <Box>{text}</Box>
      </Box>
      <Box gridArea={areas?.chart} pb={{ _: '1.5rem', md: 0 }}>
        <div>
          <ErrorBoundary>
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
          </ErrorBoundary>
        </div>
      </Box>
    </>
  );
}
