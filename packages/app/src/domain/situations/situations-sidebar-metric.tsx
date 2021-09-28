import { SidebarKpiValue } from '~/components/sidebar-metric/sidebar-kpi-value';
import { useIntl } from '~/intl';

export function SituationsSidebarMetric() {
  const { siteText } = useIntl();
  return <SidebarKpiValue title={siteText.brononderzoek.kpi_titel} />;
}
