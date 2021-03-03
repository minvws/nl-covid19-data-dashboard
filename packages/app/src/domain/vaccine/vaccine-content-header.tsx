import { National } from '@corona-dashboard/common';
import { AxisBottom, AxisLeft, TickFormatter } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { ParentSize } from '@visx/responsive';
import VaccinatieIcon from '~/assets/vaccinaties.svg';
import { Box } from '~/components-styled/base';
import { ContentHeader } from '~/components-styled/content-header';
import { HeadingWithIcon } from '~/components-styled/heading-with-icon';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChart } from '~/components-styled/line-chart';
import { ComponentCallbackInfo } from '~/components-styled/line-chart/components';
import { createBackgroundRectangle } from '~/components-styled/line-chart/logic/background-rectangle';
import { Tile } from '~/components-styled/tile';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Heading, InlineText, Text } from '~/components-styled/typography';
import siteText, { Locale } from '~/locale';
import { colors } from '~/style/theme';
import { createDate } from '~/utils/createDate';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { DateRange } from '~/utils/get-trailing-date-range';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';

interface VaccinesContentHeaderProps {
  text: Locale['vaccinaties'];
  data: National;
}

export function VaccineContentHeader({
  text,
  data,
}: VaccinesContentHeaderProps) {
  return (
    <Box spacing={4}>
      <Tile>
        <HeadingWithIcon
          icon={<VaccinatieIcon />}
          title={text.title}
          headingLevel={1}
        />

        <Box spacing={4} pt={4} px={{ md: 5 }}>
          <Text fontSize="1.625rem" m={0}>
            {replaceComponentsInText(
              text.current_amount_of_administrations_text,
              {
                amount: (
                  <InlineText color="data.primary" fontWeight="bold">
                    {formatPercentage(
                      data.vaccine_administered_total.last_value.estimated /
                        1_000_000
                    )}{' '}
                    {siteText.common.miljoen}
                  </InlineText>
                ),
              }
            )}
          </Text>

          <TwoKpiSection spacing={4}>
            <Box as="article" spacing={3}>
              <Heading level={3}>Gezette prikken over tijd</Heading>
              <Text m={0}>
                Deze grafiek toont het berekend totaal aantal gezette prikken
                sinds 4 januari 2021.
              </Text>

              <ParentSize>
                {(parent) => (
                  <LineChart
                    width={parent.width}
                    timeframe="all"
                    values={data.vaccine_administered_total.values}
                    height={180}
                    linesConfig={[
                      {
                        metricProperty: 'estimated',
                        areaFillOpacity: 0.25,
                        strokeWidth: 3,
                      },
                    ]}
                    componentCallback={componentCallback}
                    showMarkerLine
                    formatTooltip={(values) => formatNumber(values[0].__value)}
                    padding={{
                      top: 13,
                      left: 0,
                      right: 0,
                    }}
                  />
                )}
              </ParentSize>
            </Box>

            <Box as="article" spacing={3}>
              <Heading level={3}>Geplande prikken deze week</Heading>
              <KpiValue
                absolute={data.vaccine_administered_total.last_value.estimated}
              />
              <Text m={0}>
                Berekend aantal prikken die gepland zijn van 22 tot en met 28
                februari. Dit aantal kan afwijken door bijvoorbeeld annuleringen
                of logistieke factoren.
              </Text>
            </Box>
          </TwoKpiSection>
        </Box>
      </Tile>

      <Box px={{ _: 3, sm: 4 }}>
        <ContentHeader
          subtitle={text.description}
          reference={text.reference}
          metadata={{
            datumsText: text.datums,
            dateOrRange: data.vaccine_administered_total.last_value.date_unix,
            dateOfInsertionUnix:
              data.vaccine_administered_total.last_value.date_of_insertion_unix,
            dataSources: [],
          }}
        />
      </Box>
    </Box>
  );

  function componentCallback(callbackInfo: ComponentCallbackInfo) {
    switch (callbackInfo.type) {
      case 'CustomBackground': {
        const { xScale, yScale, bounds } = callbackInfo.props;

        const dateRange: DateRange = [
          createDate(data.vaccine_administered_total.values[0].date_unix),
          new Date('30 January 2021'),
        ];

        return createBackgroundRectangle(dateRange, xScale, yScale, bounds, {
          fill: colors.data.underReported,
        });
      }
      case 'GridRows': {
        const domain = callbackInfo.props.scale.domain();
        const lastItem = domain[domain.length - 1];
        return (
          <GridRows
            {...(callbackInfo.props as any)}
            tickValues={[0, lastItem / 2, lastItem]}
          />
        );
      }
      case 'AxisBottom': {
        const domain = callbackInfo.props.scale.domain();
        const defaultTickFormat = callbackInfo.props.tickFormat;
        const tickFormat = (d: Date) => {
          if (d === domain[0]) {
            return defaultTickFormat ? defaultTickFormat(d, 0, domain) : '';
          }
          return formatLastDate(d, defaultTickFormat);
        };

        const tickLabelProps = (value: Date, index: number) => {
          const labelProps = callbackInfo.props.tickLabelProps
            ? callbackInfo.props.tickLabelProps(value, index)
            : {};
          labelProps.textAnchor = value === domain[0] ? 'start' : 'end';
          labelProps.dx = 0;
          labelProps.dy = -4;
          return labelProps;
        };

        return (
          <AxisBottom
            {...(callbackInfo.props as any)}
            tickLabelProps={tickLabelProps}
            tickFormat={tickFormat}
            tickValues={domain}
          />
        );
      }
      case 'AxisLeft': {
        const domain = callbackInfo.props.scale.domain();
        const lastItem = domain[domain.length - 1];

        const tickLabelProps = (value: Date, index: number) => {
          const labelProps = callbackInfo.props.tickLabelProps
            ? callbackInfo.props.tickLabelProps(value, index)
            : {};
          labelProps.textAnchor = 'start';
          labelProps.dx = 10;
          labelProps.dy = -9;
          return labelProps;
        };

        return (
          <AxisLeft
            {...(callbackInfo.props as any)}
            tickLabelProps={tickLabelProps}
            tickValues={[lastItem]}
          />
        );
      }
    }
  }
}

const DAY_IN_SECONDS = 24 * 60 * 60;
function formatLastDate(date: Date, defaultFormat?: TickFormatter<any>) {
  const days = Math.floor(
    (Date.now() / 1000 - date.valueOf() / 1000) / DAY_IN_SECONDS
  );

  if (days < 1) {
    return siteText.common.vandaag;
  }

  if (days < 2) {
    return siteText.common.gisteren;
  }

  return defaultFormat ? defaultFormat(date, 0, []) : '';
}
