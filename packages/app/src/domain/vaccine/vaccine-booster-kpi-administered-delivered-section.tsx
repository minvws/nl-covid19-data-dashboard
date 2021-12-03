import {
  NlBoosterShotAdministeredValue,
  NlBoosterShotDeliveredValue,
  NlBoosterShotPlannedValue,
} from '@corona-dashboard/common';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

interface VaccineBoosterKpiAdministeredDeliveredSectionProps {
  dataAdministered: NlBoosterShotAdministeredValue;
  dataPlanned: NlBoosterShotPlannedValue;
  dateDelivered: NlBoosterShotDeliveredValue;
}

export function VaccineBoosterKpiAdministeredDeliveredSection({
  dataAdministered,
  dataPlanned,
  dateDelivered,
}: VaccineBoosterKpiAdministeredDeliveredSectionProps) {
  const { siteText, formatNumber } = useIntl();

  const text = siteText.vaccinaties.booster_administered_delivered_section;

  return (
    <TwoKpiSection spacing={5}>
      <KpiTile
        title={text.administered.title}
        metadata={{
          date: [
            dataAdministered.date_start_unix,
            dataAdministered.date_end_unix,
          ],
          source: {
            ...text.administered.source,
          },
        }}
      >
        <KpiValue absolute={dataAdministered.administered_total} />
        <Markdown
          content={replaceVariablesInText(text.administered.description, {
            administeredLastSevenDays: formatNumber(
              dataAdministered.administered_last_7_days
            ),
            plannedSevenDays: formatNumber(dataPlanned.planned_7_days),
          })}
        />
      </KpiTile>

      <KpiTile
        title={text.delivered.title}
        metadata={{
          date: dateDelivered.date_unix,
          source: {
            ...text.delivered.source,
          },
        }}
      >
        <KpiValue absolute={dateDelivered.delivered_total} />

        <Markdown content={text.delivered.description} />
      </KpiTile>
    </TwoKpiSection>
  );
}
