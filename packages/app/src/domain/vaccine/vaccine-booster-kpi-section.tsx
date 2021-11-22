import { NlBoosterShotValue } from '@corona-dashboard/common';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

interface VaccineBoosterKpiSectionProps {
  data: NlBoosterShotValue;
}

export function VaccineBoosterKpiSection({
  data,
}: VaccineBoosterKpiSectionProps) {
  const { siteText, formatNumber } = useIntl();

  const text = siteText.vaccinaties.booster_shots_kpi;

  return (
    <TwoKpiSection spacing={5}>
      <KpiTile
        title={text.total_section.title}
        metadata={{
          date: [data.total_date_start_unix, data.total_date_end_unix],
          source: text.total_section.sources,
        }}
      >
        <KpiValue
          absolute={data.partially_or_fully_vaccinated_total_amount_of_people}
        />
        <Markdown
          content={replaceVariablesInText(text.total_section.description, {
            amountOfPeople: formatNumber(
              data.partially_or_fully_vaccinated_total_amount_of_people
            ),
          })}
        />
      </KpiTile>

      <KpiTile
        title={text.last_week_section.title}
        metadata={{
          date: [data.total_date_start_unix, data.total_date_end_unix],
          source: text.last_week_section.sources,
        }}
      >
        <KpiValue absolute={data.total_shots_last_seven_days} />
        <Markdown
          content={replaceVariablesInText(text.last_week_section.description, {
            totalShots: formatNumber(data.total_shots_last_seven_days),
            receivedBoosters: formatNumber(
              data.received_booster_last_seven_days
            ),
          })}
        />
      </KpiTile>
    </TwoKpiSection>
  );
}
