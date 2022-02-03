import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { useIntl } from '~/intl';
import { Tile } from '~/components/tile';
import { Metadata, MetadataProps } from '~/components/metadata';

interface VaccinationsBoosterKpiSectionProps {
  dataBoosterShotAdministered: number;
  metadataBoosterShotAdministered: MetadataProps;
}

export function VaccinationsBoosterKpiSection({
  dataBoosterShotAdministered,
  metadataBoosterShotAdministered,
}: VaccinationsBoosterKpiSectionProps) {
  const { siteText, formatNumber } = useIntl();

  const text = siteText.pages.vaccinationsPage.nl.booster_ggd_kpi_section;

  return (
    <Tile>
      <TwoKpiSection>
        <KpiTile title={text.booster_last_7_days.title} hasNoBorder>
          <KpiValue text={formatNumber(dataBoosterShotAdministered)} />
          <Markdown content={text.booster_last_7_days.description} />
          <Metadata {...metadataBoosterShotAdministered} />
        </KpiTile>
        <KpiTile hasNoBorder />
      </TwoKpiSection>
    </Tile>
  );
}
