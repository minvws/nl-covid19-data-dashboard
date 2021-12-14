import {
  NlBoosterAndThirdShotAdministeredValue,
  NlBoosterShotAdministeredValue,
  NlBoosterShotPlannedValue,
  NlThirdShotAdministeredValue,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import { Box } from '~/components/base';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

interface VaccinationsBoosterKpiSectionProps {
  dataBoosterAndThirdShotAdministered: NlBoosterAndThirdShotAdministeredValue;
  dataBoosterShotAdministered: NlBoosterShotAdministeredValue;
  dataBoosterShotPlanned: NlBoosterShotPlannedValue;
  dataThirdShotAdministered: NlThirdShotAdministeredValue;
}

export function VaccinationsBoosterKpiSection({
  dataBoosterAndThirdShotAdministered,
  dataBoosterShotAdministered,
  dataBoosterShotPlanned,
  dataThirdShotAdministered,
}: VaccinationsBoosterKpiSectionProps) {
  const { siteText, formatNumber } = useIntl();

  const text = siteText.vaccinaties.four_kpi_section;

  return (
    <Box spacing={4}>
      <TwoKpiSection>
        <KpiTile
          title={text.total_booster_and_third_shots.title}
          metadata={{
            date: dataBoosterAndThirdShotAdministered.date_unix,
            source: {
              href: text.total_booster_and_third_shots.sources.href,
              text: text.total_booster_and_third_shots.sources.text,
            },
          }}
        >
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
            {formatNumber(
              dataBoosterAndThirdShotAdministered.administered_total
            )}
          </Text>
          <Markdown content={text.total_booster_and_third_shots.description} />
        </KpiTile>

        <KpiTile
          title={text.boosters_ggd.title}
          metadata={{
            date: dataBoosterAndThirdShotAdministered.date_unix,
            source: {
              href: text.boosters_ggd.sources.href,
              text: text.boosters_ggd.sources.text,
            },
          }}
        >
          <KpiValue
            absolute={dataBoosterShotAdministered.ggd_administered_total}
          />
          <Markdown
            content={replaceVariablesInText(text.boosters_ggd.description, {
              lastSevenDaysGgd: formatNumber(
                dataBoosterShotAdministered.ggd_administered_last_7_days
              ),
              plannedSevenDays: formatNumber(
                dataBoosterShotPlanned.planned_7_days
              ),
            })}
          />
        </KpiTile>
      </TwoKpiSection>

      <TwoKpiSection>
        <KpiTile
          title={text.estimated_boosters_other_operators.title}
          metadata={{
            date: dataBoosterAndThirdShotAdministered.date_unix,
            source: {
              href: text.estimated_boosters_other_operators.sources.href,
              text: text.estimated_boosters_other_operators.sources.text,
            },
          }}
        >
          <KpiValue
            absolute={dataBoosterShotAdministered.others_administered_total}
          />
          <Markdown
            content={text.estimated_boosters_other_operators.description}
          />
        </KpiTile>

        <KpiTile
          title={text.third_shots_ggd.title}
          metadata={{
            date: dataBoosterAndThirdShotAdministered.date_unix,
            source: {
              href: text.third_shots_ggd.sources.href,
              text: text.third_shots_ggd.sources.text,
            },
          }}
        >
          <KpiValue absolute={dataThirdShotAdministered.administered_total} />
          <Markdown
            content={replaceVariablesInText(text.third_shots_ggd.description, {
              lastSevenDays: formatNumber(
                dataThirdShotAdministered.administered_last_7_days
              ),
            })}
          />
        </KpiTile>
      </TwoKpiSection>
    </Box>
  );
}
