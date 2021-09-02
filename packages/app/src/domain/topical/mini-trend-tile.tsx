import { KeysOfType, TimestampedValue } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { ArrowIconRight } from '~/components/arrow-icon';
import { Box } from '~/components/base';
import { ErrorBoundary } from '~/components/error-boundary';
import { HeadingLinkWithIcon } from '~/components/link-with-icon';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { Heading, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { AccessibilityDefinition } from '~/utils/use-accessibility-annotations';
import { useBreakpoints } from '~/utils/use-breakpoints';

type MiniTrendTileProps<T extends TimestampedValue = TimestampedValue> = {
  /**
   * The mandatory AccessibilityDefinition provides a reference to annotate the
   * graph with a label and description.
   */
  accessibility: AccessibilityDefinition;
  icon: JSX.Element;
  title: string;
  text: ReactNode;
  trendData: T[];
  metricProperty: KeysOfType<T, number | null, true>;
  href: string;
  areas?: { header: string; chart: string };
};

export function MiniTrendTile<T extends TimestampedValue>(
  props: MiniTrendTileProps<T>
) {
  const { formatNumber } = useIntl();

  const {
    icon,
    title,
    text,
    trendData,
    metricProperty,
    href,
    areas,
    accessibility,
  } = props;

  const value = trendData[trendData.length - 1][metricProperty];

  const { sm } = useBreakpoints(true);

  return (
    <>
      <Box gridArea={areas?.header} position="relative" spacing={2} pb={3}>
        <Heading level={3} as="h2">
          <Box as="span" fontWeight="bold" display="flex" alignItems="center">
            <Icon>{icon}</Icon>
            <HeadingLinkWithIcon
              href={href}
              icon={<ArrowIconRight />}
              iconPlacement="right"
            >
              {title}
            </HeadingLinkWithIcon>
          </Box>
        </Heading>
        <Text variant="h1" data-cy={metricProperty}>
          {formatNumber(value as unknown as number)}
        </Text>

        <Box>{text}</Box>
      </Box>

      <Box gridArea={areas?.chart} pb={{ _: '1.5rem', md: 0 }}>
        <div>
          <ErrorBoundary>
            <TimeSeriesChart
              accessibility={accessibility}
              initialWidth={400}
              minHeight={sm ? 180 : 140}
              timeframe="5weeks"
              xTickNumber={2}
              values={trendData}
              displayTooltipValueOnly
              numGridLines={3}
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

const Icon = styled.span(
  css({
    svg: {
      height: '3rem',
      mr: 3,
      ml: '2px',
    },
  })
);
