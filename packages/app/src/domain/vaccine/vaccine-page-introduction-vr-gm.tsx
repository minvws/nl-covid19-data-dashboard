import {
  GmVaccineCoveragePerAgeGroupValue,
  VrVaccineCoveragePerAgeGroupValue,
} from '@corona-dashboard/common';
import { isPresent } from 'ts-is-present';
import { Box } from '~/components/base';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { Tile } from '~/components/tile';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Heading } from '~/components/typography';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { VaccineHeaderWithIcon } from './components/vaccine-header-with-icon';
import { parseFullyVaccinatedPercentageLabel } from './logic/parse-fully-vaccinated-percentage-label';
interface VaccinePageIntroductionVrGm {
  title: string;
  description: string;
  kpiTitle: string;
  data: VrVaccineCoveragePerAgeGroupValue | GmVaccineCoveragePerAgeGroupValue;
}

export function VaccinePageIntroductionVrGm({
  title,
  description,
  kpiTitle,
  data,
}: VaccinePageIntroductionVrGm) {
  const { formatPercentage, siteText } = useIntl();

  let parsedVaccinatedLabel;
  if (isPresent(data.fully_vaccinated_percentage_label)) {
    parsedVaccinatedLabel = parseFullyVaccinatedPercentageLabel(
      data.fully_vaccinated_percentage_label
    );
  }

  return (
    <Tile>
      <Box spacing={3}>
        <VaccineHeaderWithIcon title={title} />

        <TwoKpiSection>
          <Box as="article" spacing={2} px={{ md: 5 }}>
            <Heading level={3}>{kpiTitle}</Heading>
            {isPresent(parsedVaccinatedLabel) ? (
              <KpiValue
                text={
                  parsedVaccinatedLabel.sign === '>'
                    ? replaceVariablesInText(
                        siteText.vaccinaties_common.labels.meer_dan,
                        {
                          value:
                            formatPercentage(parsedVaccinatedLabel.value) + '%',
                        }
                      )
                    : replaceVariablesInText(
                        siteText.vaccinaties_common.labels.minder_dan,
                        {
                          value:
                            formatPercentage(parsedVaccinatedLabel.value) + '%',
                        }
                      )
                }
              />
            ) : (
              <KpiValue percentage={data.fully_vaccinated_percentage} />
            )}
            <Markdown content={description} />
          </Box>

          <div />
        </TwoKpiSection>
      </Box>
    </Tile>
  );
}
