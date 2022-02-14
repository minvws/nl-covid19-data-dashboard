import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { useIntl } from '~/intl';
import { Tile } from '~/components/tile';
import { Metadata, MetadataProps } from '~/components/metadata';
import { Message } from '~/components/message';

interface VaccinationsBoosterKpiSectionProps {
  thirdGgdValue: number;
  metadateThirdGgd: MetadataProps;
}

export function VaccinationsBoosterKpiSection({
  thirdGgdValue,
  metadateThirdGgd,
}: VaccinationsBoosterKpiSectionProps) {
  const { siteText, formatNumber } = useIntl();

  const text = siteText.pages.vaccinationsPage.nl.booster_and_third_kpi;

  return (
    <Tile>
      <TwoKpiSection>
        <KpiTile title={text.third_ggd.title} hasNoBorder>
          <KpiValue text={formatNumber(thirdGgdValue)} />
          <Markdown content={text.third_ggd.description} />
          {text.third_ggd.warning && (
            <Message variant="warning">{text.third_ggd.warning}</Message>
          )}
          <Metadata {...metadateThirdGgd} />
        </KpiTile>
        <KpiTile hasNoBorder />
      </TwoKpiSection>
    </Tile>
  );
}
