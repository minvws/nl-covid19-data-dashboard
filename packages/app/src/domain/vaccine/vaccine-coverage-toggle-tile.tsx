import { css } from '@styled-system/css';
import { useState } from 'react';
import { isPresent } from 'ts-is-present';
import { Box } from '~/components/base';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { RadioGroup } from '~/components/radio-group';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { InlineText } from '~/components/typography';
import { parseBirthyearRange } from '~/domain/vaccine/logic/parse-birthyear-range';
import { parseFullyVaccinatedPercentageLabel } from '~/domain/vaccine/logic/parse-fully-vaccinated-percentage-label';
import { useIntl } from '~/intl';
import { assert } from '~/utils/assert';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

type AgeTypes = {
  fully_vaccinated: number | null;
  has_one_shot: number | null;
  birthyear: string;
  label_fully_vaccinated?: string | null;
  label_has_one_shot?: string | null;
};

interface VaccineCoverageToggleTileProps {
  title: string;
  source: {
    text: string;
    href: string;
  };
  descriptionFooter: string;
  age18Plus: AgeTypes;
  age12Plus: AgeTypes;
  dateUnix: number;
  numFractionDigits?: number;
}

export function VaccineCoverageToggleTile({
  title,
  source,
  descriptionFooter,
  dateUnix,
  age18Plus,
  age12Plus,
  numFractionDigits = 0,
}: VaccineCoverageToggleTileProps) {
  const { siteText } = useIntl();
  const text = siteText.vaccinaties.vaccination_grade_toggle_tile;

  const [selectedTab, setSelectedTab] = useState(text.age_18_plus.label);

  return (
    <KpiTile
      title={title}
      metadata={{
        date: dateUnix,
        source: source,
      }}
    >
      <>
        <Box css={css({ '& div': { justifyContent: 'flex-start' } })} mb={3}>
          <RadioGroup
            value={selectedTab}
            onChange={(value) => setSelectedTab(value)}
            items={[
              {
                label: text.age_18_plus.label,
                value: text.age_18_plus.label,
              },
              {
                label: text.age_12_plus.label,
                value: text.age_12_plus.label,
              },
            ]}
          />
        </Box>
        <TwoKpiSection spacing={4}>
          {selectedTab === text.age_18_plus.label && (
            <>
              <AgeGroupBlock
                title={text.top_labels.one_shot}
                kpiValue={age18Plus.has_one_shot}
                birthyear={age18Plus.birthyear}
                label={age18Plus.label_has_one_shot}
                description={text.age_18_plus.description_vaccination_one_shot}
                numFractionDigits={numFractionDigits}
              />
              <AgeGroupBlock
                title={text.top_labels.vaccination_grade}
                kpiValue={age18Plus.fully_vaccinated}
                birthyear={age18Plus.birthyear}
                label={age18Plus.label_fully_vaccinated}
                description={text.age_18_plus.description_vaccination_one_shot}
                numFractionDigits={numFractionDigits}
              />
            </>
          )}
          {selectedTab === text.age_12_plus.label && (
            <>
              <AgeGroupBlock
                title={text.top_labels.one_shot}
                kpiValue={age12Plus.has_one_shot}
                birthyear={age12Plus.birthyear}
                label={age12Plus.label_has_one_shot}
                description={text.age_12_plus.description_vaccination_grade}
                numFractionDigits={numFractionDigits}
              />
              <AgeGroupBlock
                title={text.top_labels.vaccination_grade}
                kpiValue={age12Plus.fully_vaccinated}
                birthyear={age12Plus.birthyear}
                label={age12Plus.label_fully_vaccinated}
                description={text.age_12_plus.description_vaccination_grade}
                numFractionDigits={numFractionDigits}
              />
            </>
          )}
        </TwoKpiSection>
      </>
      <Box maxWidth="maxWidthText">
        <Markdown content={descriptionFooter} />
      </Box>
    </KpiTile>
  );
}

interface AgeGroupBlockProps {
  title: string;
  kpiValue: number | null;
  description: string;
  birthyear: string;
  label?: string | null;
  numFractionDigits?: number;
}

function AgeGroupBlock({
  title,
  kpiValue,
  description,
  birthyear,
  label,
  numFractionDigits,
}: AgeGroupBlockProps) {
  const { siteText, formatPercentage } = useIntl();

  const parsedBirthyearRange = parseBirthyearRange(birthyear);

  assert(
    parsedBirthyearRange,
    `Something went wrong with parsing the birthyear: ${birthyear}`
  );

  let parsedVaccinatedLabel;
  if (isPresent(label)) {
    parsedVaccinatedLabel = parseFullyVaccinatedPercentageLabel(label);
  }

  return (
    <Box spacing={2}>
      <InlineText
        fontWeight="bold"
        css={css({
          display: 'flex',
        })}
      >
        {title}
      </InlineText>
      {parsedVaccinatedLabel ? (
        <KpiValue
          text={
            parsedVaccinatedLabel.sign === '>'
              ? replaceVariablesInText(
                  siteText.vaccinaties_common.labels.meer_dan,
                  {
                    value:
                      formatPercentage(parsedVaccinatedLabel.value, {
                        minimumFractionDigits: numFractionDigits,
                        maximumFractionDigits: numFractionDigits,
                      }) + '%',
                  }
                )
              : replaceVariablesInText(
                  siteText.vaccinaties_common.labels.minder_dan,
                  {
                    value:
                      formatPercentage(parsedVaccinatedLabel.value, {
                        minimumFractionDigits: numFractionDigits,
                        maximumFractionDigits: numFractionDigits,
                      }) + '%',
                  }
                )
          }
        />
      ) : (
        <KpiValue percentage={kpiValue} numFragmentDigits={numFractionDigits} />
      )}
      <Markdown
        content={replaceVariablesInText(description, {
          birthyear: replaceVariablesInText(
            siteText.vaccinaties.birthyear_ranges[parsedBirthyearRange.type],
            parsedBirthyearRange
          ),
        })}
      />
    </Box>
  );
}
