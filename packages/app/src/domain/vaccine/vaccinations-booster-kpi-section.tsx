import css from '@styled-system/css';
import { Box } from '~/components/base';
import { KpiTile } from '~/components/kpi-tile';
import { Markdown } from '~/components/markdown';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Text } from '~/components/typography';
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
    <Box spacing={4}>
      <TwoKpiSection>
        <KpiTile title={text.booster_last_7_days.title}>
          <Text
            as="div"
            css={css({
              color: 'data.primary',
              fontSize: 9,
              fontWeight: 600,
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
            })}
          >
            {formatNumber(dataBoosterShotAdministered)}
          </Text>
          <Markdown content={text.booster_last_7_days.description} />
          <Metadata {...metadataBoosterShotAdministered} isTileFooter />
        </KpiTile>
        <KpiTile title={text.booster_planned_7_days.title}>
          <Text
            as="div"
            css={css({
              color: 'data.primary',
              fontSize: 9,
              fontWeight: 600,
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
            })}
          >
            {formatNumber(dataBoosterShotPlanned)}
          </Text>
          <Markdown content={text.booster_planned_7_days.description} />
          <Metadata {...metadataBoosterShotPlanned} isTileFooter />
        </KpiTile>
      </TwoKpiSection>
    </Box>
  );
}
