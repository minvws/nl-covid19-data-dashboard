import {
  DataScopeKey,
  DonutChartConfiguration,
  MetricKeys,
  ScopedData,
} from '@corona-dashboard/common';
import { Clock } from '@corona-dashboard/icons';
import css from '@styled-system/css';
import { get } from 'lodash';
import useSWRImmutable from 'swr/immutable';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components/base';
import { PieChart, PiePartConfig } from '~/components/pie-chart';
import { useIntl } from '~/intl';
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
    return (
      <Box width="100%">
        <Clock width="3em" height="3em" />
      </Box>
    );
  }

  const dataConfig = configuration.metricProperties.map<PiePartConfig<any>>(
    (x) => ({
      metricProperty: x.propertyName as any,
      color: getColor(x.color),
      label: get(siteText, x.labelKey.split('.'), null),
    })
  );

  return (
    <PieChart
      data={data}
      dataConfig={dataConfig}
      icon={
        <div
          aria-hidden={true}
          css={css({
            background: `url(/icons/app/${configuration.icon}) no-repeat top left`,
            width: '30px',
            height: '40px',
            color: '#000',
          })}
        />
      }
    />
  );
}
