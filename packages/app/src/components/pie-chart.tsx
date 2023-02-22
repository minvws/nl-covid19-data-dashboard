import { ChevronRight } from '@corona-dashboard/icons';
import css from '@styled-system/css';
import { Group } from '@visx/group';
import Pie from '@visx/shape/lib/shapes/Pie';
import { isEmpty } from 'lodash';
import { useMemo } from 'react';
import { Box } from '~/components/base';
import { ErrorBoundary } from '~/components/error-boundary';
import { LinkWithIcon } from '~/components/link-with-icon';
import { Markdown } from '~/components/markdown';
import { BoldText } from '~/components/typography';
import { useIntl } from '~/intl';
import { WithTooltip } from '~/lib/tooltip';
import { space } from '~/style/theme';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
const ICON_SIZE = 55;

export interface PiePartConfig<T> {
  metricProperty: keyof T;
  color: string;
  label: string;
  tooltipLabel: string;
}

export interface PieChartProps<T> {
  data: T;
  dataConfig: PiePartConfig<T>[];
  marginLeft?: number;
  marginRight?: number;
  innerSize?: number;
  donutWidth?: number;
  padAngle?: number;
  minimumPercentage?: number;
  icon?: JSX.Element;
  iconFill?: string;
  verticalLayout?: boolean;
  title?: string;
  link?: {
    href: string;
    text: string;
  };
  hasHoverState?: boolean;
}

export function PieChart<T>({
  data,
  dataConfig,
  marginLeft = 40,
  marginRight = 40,
  innerSize = 200,
  donutWidth = 35,
  padAngle = 0.03,
  minimumPercentage = 0.5,
  icon,
  iconFill = 'gray3',
  verticalLayout,
  title,
  link,
  hasHoverState,
}: PieChartProps<T>) {
  const { formatNumber, formatPercentage, formatDate, formatDateFromSeconds, formatDateFromMilliseconds, formatRelativeDate, formatDateSpan } = useIntl();

  const formatters = {
    formatNumber,
    formatPercentage,
    formatDate,
    formatDateFromSeconds,
    formatDateFromMilliseconds,
    formatRelativeDate,
    formatDateSpan,
  };

  const totalValue = dataConfig.reduce((previousValue, currentValue) => {
    const metricPropertyValue = data[currentValue.metricProperty];
    return previousValue + (typeof metricPropertyValue === 'number' ? metricPropertyValue : 0);
  }, 0);

  const mappedDataWithValues = useMemo(
    () =>
      dataConfig.map((config) => {
        const currentProperty = data[config.metricProperty];

        return {
          __value: Math.max(typeof currentProperty === 'number' ? currentProperty : 0, totalValue * (minimumPercentage / 100) * 2),
          ...config,
        };
      }),
    [data, dataConfig, minimumPercentage, totalValue]
  );

  const radius = innerSize / 2;

  return (
    <Box width="100%">
      <ErrorBoundary>
        <Box
          display="flex"
          spacingHorizontal={4}
          spacing={verticalLayout ? 4 : { _: 4, xs: 0 }}
          alignItems={verticalLayout ? 'flex-start' : { xs: 'center' }}
          flexDirection={verticalLayout ? 'column' : { _: 'column', xs: 'row' }}
          justifyContent={{ _: 'flex-start', xl: 'flex-end' }}
          marginTop={{ _: space[3], lg: '0' }}
        >
          <Box alignSelf={{ _: 'center', md: 'self-start' }} height={innerSize} position="relative" css={css({ marginLeft, marginRight })} spacingHorizontal={2}>
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
                    fill: iconFill,
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
                '&:hover, &:focus-within': hasHoverState
                  ? {
                      'path:not(:hover):not(:focus-visible)': {
                        opacity: 0.4,
                      },
                    }
                  : null,
              })}
              pointerEvents="none"
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
                      const side = (arc.startAngle + arc.endAngle) / 2 > Math.PI ? 'left' : 'right';
                      const alternativeSide = side === 'left' ? 'end' : 'start';

                      return hasHoverState ? (
                        <WithTooltip
                          content={<Markdown content={replaceVariablesInText(dataConfig[index].tooltipLabel, data as any, formatters)} />}
                          key={`arc-${index}`}
                          placement={side}
                          popperOptions={{
                            modifiers: [
                              {
                                name: 'flip',
                                options: {
                                  fallbackPlacements: [`top-${alternativeSide}`, `bottom-${alternativeSide}`],
                                },
                              },
                            ],
                          }}
                          arrow={false}
                        >
                          <path
                            d={arcPath as string}
                            fill={arc.data.color}
                            tabIndex={0}
                            pointerEvents="all"
                            // Prevents paths from keeping 0.4 opacity when clicked
                            onMouseLeave={(e) => (e.target as SVGPathElement).blur()}
                          />
                        </WithTooltip>
                      ) : (
                        <path d={arcPath as string} fill={arc.data.color} tabIndex={0} pointerEvents="all" />
                      );
                    });
                  }}
                </Pie>
              </Group>
            </svg>
          </Box>

          <Box spacing={2}>
            {title && (
              <BoldText
                css={css({
                  display: 'block',
                })}
              >
                {title}
              </BoldText>
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
                <Box as="li" key={`${item.color}-${index}`} display="flex" alignItems="center" spacingHorizontal={2}>
                  <Box width="12px" height="12px" backgroundColor={item.color} borderRadius="50%" />
                  <Markdown content={replaceVariablesInText(item.label, data as any, formatters)} />
                </Box>
              ))}
            </Box>
            {
              /**
               * Check also for empty link text, so that clearing it in Lokalize
               * actually removes the link altogether
               */
              link && !isEmpty(link.text) && (
                <LinkWithIcon href={link.href} icon={<ChevronRight />} iconPlacement="right">
                  {link.text}
                </LinkWithIcon>
              )
            }
          </Box>
        </Box>
      </ErrorBoundary>
    </Box>
  );
}
