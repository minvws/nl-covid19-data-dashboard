import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { useIntl } from '~/intl';
import { Tile } from '~/components/tile';
import { Metadata, MetadataProps } from '~/components/metadata';
import { Message } from '~/components/message';

interface VaccinationsThirdShotKpiSectionProps {
  thirdShotValue: number;
  metadateThirdShot: MetadataProps;
}

export function VaccinationsThirdShotKpiSection({
  thirdShotValue,
  metadateThirdShot,
}: VaccinationsThirdShotKpiSectionProps) {
  const { siteText, formatNumber } = useIntl();

  const text = siteText.pages.vaccinationsPage.nl.booster_and_third_kpi;

  return (
    <Tile>
      <TwoKpiSection>
        <KpiTile title={text.third_shots.title} hasNoBorder>
          <KpiValue text={formatNumber(thirdShotValue)} />
          <Markdown content={text.third_shots.description} />
          {text.third_shots.warning && (
            <Message variant="warning">{text.third_shots.warning}</Message>
          )}
          <Metadata {...metadateThirdShot} />
        </KpiTile>
        <KpiTile hasNoBorder />
      </TwoKpiSection>
    </Tile>
  );
}
