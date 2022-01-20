import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { useIntl } from '~/intl';
import { Metadata, MetadataProps } from '~/components/metadata';

interface VaccinationsBoosterKpiSectionProps {
  dataBoosterShotAdministered: number;
  dataBoosterShotPlanned: number;
  metadataBoosterShotPlanned: MetadataProps;
  metadataBoosterShotAdministered: MetadataProps;
}

export function VaccinationsBoosterKpiSection({
  dataBoosterShotAdministered,
  dataBoosterShotPlanned,
  metadataBoosterShotPlanned,
  metadataBoosterShotAdministered,
}: VaccinationsBoosterKpiSectionProps) {
  const { siteText, formatNumber } = useIntl();

  const text = siteText.pages.vaccinations.nl.booster_ggd_kpi_section;

  return (
    <TwoKpiSection>
      <KpiTile title={text.booster_last_7_days.title}>
        <KpiValue text={formatNumber(dataBoosterShotAdministered)} />
        <Markdown content={text.booster_last_7_days.description} />
        <Metadata {...metadataBoosterShotAdministered} />
      </KpiTile>
      <KpiTile title={text.booster_planned_7_days.title}>
        <KpiValue text={formatNumber(dataBoosterShotPlanned)} />
        <Markdown content={text.booster_planned_7_days.description} />
        <Metadata {...metadataBoosterShotPlanned} isTileFooter />
      </KpiTile>
    </TwoKpiSection>
  );
}
