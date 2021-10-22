import type { KeysOfType } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { Group } from '@visx/group';
import Pie from '@visx/shape/lib/shapes/Pie';
import { useMemo } from 'react';
import { Box, Spacer } from '~/components/base';
import { Markdown } from '~/components/markdown';
import { useIntl } from '~/intl';
import { asResponsiveArray } from '~/style/utils';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

interface SeriesConfigType<T> {
  metricProperty: KeysOfType<T, number, true>;
  color: string;
  label: string;
}

type PieChartProps<T> = {
  data: T;
  dataConfig: SeriesConfigType<T>[];
  paddingLeft?: number;
  innerSize?: number;
  donutWidth?: number;
  padAngle?: number;
  minimumPercentage?: number;
};

export function PieChart<T>({
  data,
  dataConfig,
  paddingLeft = 40,
  innerSize = 200,
  donutWidth = 35,
  padAngle = 0.03,
  minimumPercentage = 0.5,
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
    <>
      <Box
        display="flex"
        spacingHorizontal={{ sm: 4, lg: 5 }}
        spacing={{ _: 4, sm: 0 }}
        alignItems={{ sm: 'center' }}
        flexDirection={{ _: 'column', sm: 'row' }}
      >
        <svg
          width={innerSize}
          height={innerSize}
          aria-hidden="true"
          css={css({
            minWidth: innerSize,
            marginLeft: asResponsiveArray({ xs: paddingLeft }),
            alignSelf: asResponsiveArray({ _: 'center', xs: 'self-start' }),
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

        <Box
          spacing={3}
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
      </Box>

      <Spacer mb={{ _: 3, md: 4 }} />
    </>
  );
}
