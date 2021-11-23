import {
  DataScopeKey,
  DonutChartConfiguration,
  MetricKeys,
  ScopedData,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import { get } from 'lodash';
import useSWRImmutable from 'swr/immutable';
import { isDefined } from 'ts-is-present';
import { PieChart, PiePartConfig } from '~/components/pie-chart';
import { useIntl } from '~/intl';
import { ErrorBoundary } from '../error-boundary';
import { Metadata } from '../metadata';
import { InlineLoader } from './inline-loader';
import { getColor } from './logic/get-color';
import { getDataUrl } from './logic/get-data-url';
interface InlineDonutChartProps<
  S extends DataScopeKey,
  M extends MetricKeys<ScopedData[S]>
> {
  startDate?: string;
  endDate?: string;
  configuration: DonutChartConfiguration<S, M>;
}

export function InlineDonutChart<
  S extends DataScopeKey,
  M extends MetricKeys<ScopedData[S]>
>(props: InlineDonutChartProps<S, M>) {
  const { startDate, endDate, configuration } = props;
  const { siteText } = useIntl();

  const dateUrl = getDataUrl(startDate, endDate, configuration, 'donut');

  const { data } = useSWRImmutable(dateUrl, (url: string) =>
    fetch(url).then((_) => _.json())
  );

  if (!isDefined(data)) {
    return <InlineLoader />;
  }

  const dataConfig = configuration.metricProperties.map<PiePartConfig<any>>(
    (x) => ({
      metricProperty: x.propertyName as any,
      color: getColor(x.color),
      label: get(siteText, x.labelKey.split('.'), null),
      tooltipLabel: get(siteText, x.tooltipLabelKey.split('.'), null),
    })
  );

  const title = get(siteText, configuration.labelKey.split('.'), '');
  const source = get(siteText, configuration.sourceKey.split('.'), '');

  return (
    <ErrorBoundary>
      <PieChart
        title={title}
        data={data}
        dataConfig={dataConfig}
        paddingLeft={configuration.paddingLeft}
        innerSize={configuration.innerSize}
        donutWidth={configuration.donutWidth}
        padAngle={configuration.padAngle}
        minimumPercentage={configuration.minimumPercentage}
        verticalLayout={configuration.verticalLayout}
        icon={
          <>
            <div
              aria-hidden={true}
              css={css({
                background: `url(/icons/app/${configuration.icon}) no-repeat top left`,
                width: '55px',
                height: '55px',
                position: 'absolute',
                left: configuration.verticalLayout ? undefined : '14px',
                backgroundPosition: '12px',
              })}
            />
            <div
              css={css({
                backgroundColor: 'white',
                width: '55px',
                height: '55px',
                position: 'absolute',
                left: configuration.verticalLayout ? undefined : '14px',
                opacity: 0.7,
              })}
            />
          </>
        }
      />
      <Metadata
        date={[data.date_start_unix, data.date_end_unix]}
        source={source}
        isTileFooter
      />
    </ErrorBoundary>
  );
}
