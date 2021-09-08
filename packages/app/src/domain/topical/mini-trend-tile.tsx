import {
  KeysOfType,
  TimeframeOption,
  TimestampedValue,
} from '@corona-dashboard/common';
import { Warning } from '@corona-dashboard/icons';
import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { ArrowIconRight } from '~/components/arrow-icon';
import { Box } from '~/components/base';
import { ErrorBoundary } from '~/components/error-boundary';
import { InlineTooltip } from '~/components/inline-tooltip';
import { HeadingLinkWithIcon } from '~/components/link-with-icon';
import { MiniTrendChart } from '~/components/mini-trend-chart';
import { Heading, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { AccessibilityDefinition } from '~/utils/use-accessibility-annotations';

type MiniTrendTileProps<T extends TimestampedValue = TimestampedValue> = {
  /**
   * The mandatory AccessibilityDefinition provides a reference to annotate the
   * graph with a label and description.
   */
  accessibility: AccessibilityDefinition;
  icon: JSX.Element;
  title: string;
  text: ReactNode;
  timeframe?: TimeframeOption;
  trendData: T[];
  metricProperty: KeysOfType<T, number | null, true>;
  href: string;
  areas?: { header: string; chart: string };
  warning?: string;
};

export function MiniTrendTile<T extends TimestampedValue>(
  props: MiniTrendTileProps<T>
) {
  const { formatNumber, siteText } = useIntl();

  const {
    accessibility,
    icon,
    title,
    text,
    timeframe = '5weeks',
    trendData,
    metricProperty,
    href,
    areas,
    warning,
  } = props;

  const value = trendData[trendData.length - 1][metricProperty];

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
          {warning && (
            <InlineTooltip content={warning}>
              <WarningIconWrapper aria-label={siteText.aria_labels.warning}>
                <Warning />
              </WarningIconWrapper>
            </InlineTooltip>
          )}
        </Text>

        <Box>{text}</Box>
      </Box>

      <Box gridArea={areas?.chart} pb={{ _: '1.5rem', md: 0 }}>
        <div>
          <ErrorBoundary>
            <MiniTrendChart
              accessibility={accessibility}
              timeframe={timeframe}
              title={title}
              values={trendData}
              metricProperty={metricProperty}
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

const WarningIconWrapper = styled.span(
  css({
    display: 'inline-flex',
    width: '1em',
    height: '1em',
    marginLeft: 2,
    backgroundColor: 'warningYellow',
    borderRadius: 1,
    alignItems: 'center',
    justifyContent: 'center',

    svg: {
      fill: 'black',
    },
  })
);
