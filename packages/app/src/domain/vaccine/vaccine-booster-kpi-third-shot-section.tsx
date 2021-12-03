import { NlThirdShotAdministeredValue } from '@corona-dashboard/common';
import { Box } from '~/components/base';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

interface VaccineBoosterKpiThirdShotSectionProps {
  data: NlThirdShotAdministeredValue;
}

export function VaccineBoosterKpiThirdShotSection({
  data,
}: VaccineBoosterKpiThirdShotSectionProps) {
  const { siteText, formatNumber } = useIntl();
  const text = siteText.vaccinaties.third_shot_kpi_section;

  return (
    <TwoKpiSection spacing={5}>
      <KpiTile
        title={text.title}
        metadata={{
          date: data.date_start_unix,
          source: {
            ...text.source,
          },
        }}
      >
        <KpiValue absolute={data.administered_total} />
        <Box maxWidth="maxWidthText">
          <Markdown
            content={replaceVariablesInText(text.description, {
              administeredLastSevenDays: formatNumber(
                data.administered_last_7_days
              ),
            })}
          />
        </Box>
      </KpiTile>
    </TwoKpiSection>
  );
}
