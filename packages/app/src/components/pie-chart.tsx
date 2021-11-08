import type { KeysOfType } from '@corona-dashboard/common';
import { Chevron } from '@corona-dashboard/icons';
import css from '@styled-system/css';
import { Group } from '@visx/group';
import Pie from '@visx/shape/lib/shapes/Pie';
import { isEmpty } from 'lodash';
import { useMemo } from 'react';
import { Box, Spacer } from '~/components/base';
import { LinkWithIcon } from '~/components/link-with-icon';
import { Markdown } from '~/components/markdown';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

const ICON_SIZE = 55;

interface SeriesConfigType<T> {
  metricProperty: KeysOfType<T, number, true>;
  color: string;
  label: string;
}

export interface PieChartProps<T> {
  data: T;
  dataConfig: SeriesConfigType<T>[];
  paddingLeft?: number;
  innerSize?: number;
  donutWidth?: number;
  padAngle?: number;
  minimumPercentage?: number;
  icon?: JSX.Element;
  verticalLayout?: boolean;
  title?: string;
  link?: {
    href: string;
    text: string;
  };
}

export function PieChart<T>({
  data,
  dataConfig,
  paddingLeft = 40,
  innerSize = 200,
  donutWidth = 35,
  padAngle = 0.03,
  minimumPercentage = 0.5,
  icon,
  verticalLayout,
  title,
  link,
}: PieChartProps<T>) {
  const {
    formatNumber,
    formatPercentage,
    formatDate,
    formatDateFromSeconds,
    formatDateFromMilliseconds,
    formatRelativeDate,
    formatDateSpan,
  } = useIntl();

  const totalValue = dataConfig.reduce(
    (previousValue, currentValue) =>
      previousValue + data[currentValue.metricProperty],
    0
  );

  const mappedDataWithValues = useMemo(
    () =>
      dataConfig.map((config) => {
        const currentProperty = data[config.metricProperty];

        return {
          __value: Math.max(
            currentProperty,
            totalValue * (minimumPercentage / 100) * 2
          ),
          ...config,
        };
      }),
    [data, dataConfig, minimumPercentage, totalValue]
  );

  const radius = innerSize / 2;

  return (
    <Box width="100%">
      <Box
        display="flex"
        spacingHorizontal={{ sm: 4, lg: 5 }}
        spacing={verticalLayout ? 4 : { _: 4, sm: 0 }}
        alignItems={verticalLayout ? 'flex-start' : { sm: 'center' }}
        flexDirection={verticalLayout ? 'column' : { _: 'column', sm: 'row' }}
      >
        <Box
          alignSelf={{ _: 'center', xs: 'self-start' }}
          height={innerSize}
          position="relative"
          marginLeft={{ xs: paddingLeft }}
        >
          {icon && (
            <Box
              width={ICON_SIZE}
              height={ICON_SIZE}
              top={`calc(50% - ${ICON_SIZE / 2}px)`}
              left={`calc(50% - ${ICON_SIZE / 2}px)`}
              position="absolute"
              display="flex"
              alignItems="center"
              justifyContent="center"
              css={css({
                svg: {
                  height: '100%',
                  fill: 'silver',
                },
              })}
            >
              {icon}
            </Box>
          )}

          <svg
            width={innerSize}
            height={innerSize}
            aria-hidden="true"
            css={css({
              minWidth: innerSize,
            })}
          >
            <Group top={innerSize / 2} left={innerSize / 2}>
              <Pie
                data={mappedDataWithValues}
                outerRadius={radius}
                innerRadius={radius - donutWidth}
                pieValue={(x) => x.__value}
                // Sort by the order of the config
                pieSortValues={(d, i) => i}
                padAngle={padAngle}
              >
                {(pie) => {
                  return pie.arcs.map((arc, index) => {
                    const arcPath = pie.path(arc);

                    return (
                      <path
                        d={arcPath as string}
                        fill={arc.data.color}
                        key={`arc-${index}`}
                      />
                    );
                  });
                }}
              </Pie>
            </Group>
          </svg>
        </Box>

        <Box spacing={2}>
          {title && (
            <InlineText
              fontWeight="bold"
              css={css({
                display: 'block',
              })}
            >
              {title}
            </InlineText>
          )}
          <Box
            spacing={2}
            as="ol"
            width={{ _: '100%', md: 'auto' }}
            css={css({
              listStyleType: 'none',
            })}
          >
            {dataConfig.map((item, index) => (
              <Box
                as="li"
                key={`${item.color}-${index}`}
                display="flex"
                alignItems="center"
                spacingHorizontal={2}
              >
                <Box
                  width={12}
                  height={12}
                  backgroundColor={item.color}
                  borderRadius="50%"
                />
                <Markdown
                  content={replaceVariablesInText(item.label, data as any, {
                    formatNumber,
                    formatPercentage,
                    formatDate,
                    formatDateFromSeconds,
                    formatDateFromMilliseconds,
                    formatRelativeDate,
                    formatDateSpan,
                  })}
                />
              </Box>
            ))}
          </Box>
          {
            /**
             * Check also for empty link text, so that clearing it in Lokalize
             * actually removes the link altogether
             */
            link && !isEmpty(link.text) && (
              <LinkWithIcon
                href={link.href}
                icon={<Chevron />}
                iconPlacement="right"
              >
                {link.text}
              </LinkWithIcon>
            )
          }
        </Box>
      </Box>

      <Spacer mb={3} />
    </Box>
  );
}
