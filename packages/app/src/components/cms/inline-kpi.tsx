import { formatStyle, getLastFilledValue, isDateSpanValue, KpiConfiguration, TimestampedValue } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { get } from 'lodash';
import { ReactNode } from 'react';
import useSWRImmutable from 'swr/immutable';
import { isDefined, isPresent } from 'ts-is-present';
import { ErrorBoundary } from '~/components/error-boundary';
import { metricNamesHoldingPartialData, PageKpi } from '~/components/page-kpi';
import { Heading } from '~/components/typography';
import { useIntl } from '~/intl';
import { fontSizes, space } from '~/style/theme';
import { Box } from '../base';
import { Markdown } from '../markdown';
import { Metadata, MetadataProps } from '../metadata';
import { InlineLoader } from './inline-loader';

interface InlineKpiProps {
  configuration: KpiConfiguration;
  date?: string;
}

interface ServerData {
  values: Record<string, any>[];
  last_value: Record<string, any>;
}

function getDataUrl(configuration: KpiConfiguration, date?: string) {
  const { code, area, metricName, metricProperty } = configuration;
  const suffix = isDefined(date) ? `?end=${date}` : '';
  return `/api/data/timeseries/${code ?? area}/${metricName}/${metricProperty}${suffix}`;
}

export function InlineKpi({ configuration, date }: InlineKpiProps) {
  const { commonTexts, formatDateFromSeconds } = useIntl();

  const { data } = useSWRImmutable<ServerData>(getDataUrl(configuration, date), (url: string) => fetch(url).then((_) => _.json()));
  const { data: differenceData } = useDifferenceData(configuration);

  if (!isDefined(data) || !isDefined(differenceData)) {
    return <InlineLoader />;
  }

  const allData = configuration.differenceKey?.length
    ? {
        [configuration.metricName]: {
          ...data,
        },
        difference: {
          [configuration.differenceKey]: differenceData[configuration.differenceKey],
        },
      }
    : {
        [configuration.metricName]: {
          ...data,
        },
      };

  const title = get(commonTexts, configuration.titleKey.split('.'), '');
  const source = get(commonTexts, configuration.sourceKey.split('.'), '');

  const lastValue = getLastValue(data, configuration.metricName);

  const metadataDate = isDateSpanValue(lastValue)
    ? formatDateSpanString(lastValue.date_start_unix, lastValue.date_end_unix, formatDateFromSeconds)
    : formatDateValueString(lastValue.date_unix, formatDateFromSeconds);

  return (
    <ErrorBoundary>
      <Box width={{ _: '100%', md: '50%' }}>
        <KpiTile
          title={title}
          iconName={configuration.icon}
          metadata={{
            source,
            date: metadataDate,
          }}
        >
          {isPresent(differenceData) && (
            <PageKpi
              data={allData}
              metricName={configuration.metricName}
              metricProperty={configuration.metricProperty}
              differenceKey={configuration.differenceKey}
              isMovingAverageDifference={configuration.isMovingAverageDifference}
              isAmount={configuration.isAmount}
            />
          )}
          {!isPresent(differenceData) && (
            <PageKpi data={allData} metricName={configuration.metricName} metricProperty={configuration.metricProperty} isAmount={configuration.isAmount} />
          )}
        </KpiTile>
      </Box>
    </ErrorBoundary>
  );
}

function useDifferenceData(configuration: KpiConfiguration) {
  const differenceKey = configuration.differenceKey ? configuration.differenceKey : 'unknown';
  return useSWRImmutable(`/api/data/timeseries/${configuration.code ?? configuration.area}/difference/${differenceKey}`, (url: string) =>
    fetch(url)
      .then((_) => {
        if (!_.ok) {
          return null;
        }
        return _.json();
      })
      .catch((_) => null)
  );
}

interface KpiTileProps {
  title: string;
  description?: string;
  children?: ReactNode;
  metadata?: MetadataProps;
  iconName: string;
}

/**
 * A generic KPI tile which composes its value content using the children prop.
 * Description can be both plain text and html strings.
 */
function KpiTile({ title, description, children, metadata, iconName }: KpiTileProps) {
  return (
    <>
      <Box spacing={3}>
        <Box display="flex" flexDirection="row" flexWrap="nowrap" alignItems="center" spacingHorizontal={{ md: 2 }} paddingRight={{ md: space[2] }}>
          <div
            aria-hidden={true}
            css={css({
              background: `url(/icons/app/${iconName}) no-repeat top left`,
              width: '30px',
              height: '40px',
              color: 'black',
            })}
          />

          <Heading level={3} as="h4" hyphens="auto" style={{ margin: '0' }}>
            {title}
          </Heading>
        </Box>
        {children && <Box spacing={3}>{children}</Box>}

        {description && (
          <Box maxWidth="400px" fontSize={fontSizes[2]} lineHeight={2}>
            <Markdown content={description} />
          </Box>
        )}
      </Box>

      {metadata && (
        <Box paddingTop={space[2]}>
          <Metadata {...metadata} />
        </Box>
      )}
    </>
  );
}

function formatDateSpanString(startDate: number, endDate: number, format: (v: number, s?: formatStyle) => string) {
  return `${format(startDate, 'weekday-long')}} - ${format(endDate, 'weekday-long')}`;
}

function formatDateValueString(date: number, format: (v: number, s?: formatStyle) => string) {
  return format(date, 'medium');
}

function getLastValue(data: ServerData, metricName: string): TimestampedValue {
  return (metricNamesHoldingPartialData.includes(metricName) ? getLastFilledValue(data as any) : get(data, ['last_value'])) as TimestampedValue;
}
