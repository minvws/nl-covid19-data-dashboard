import { TwoKpiSection } from '~/components/two-kpi-section';
import { KpiTile } from '~/components/kpi-tile';
import { RadioGroup } from '~/components/radio-group';
import { useState } from 'react';
import { Box } from '~/components/base';
import { css } from '@styled-system/css';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { InlineText } from '~/components/typography';
import { parseBirthyearRange } from '~/domain/vaccine/logic/parse-birthyear-range';
import { useIntl } from '~/intl';
import { assert } from '~/utils/assert';

type AgeGroupTypes = {
  description_vaccination_grade: string;
  description_vaccination_one_shot: string;
  label: string;
};

interface VaccineCoverageToggleTileProps {
  title: string;
  topLabels: {
    one_shot: string;
    vaccination_grade: string;
  };
  source: {
    text: string;
    href: string;
  };
  ageGroupText: {
    age_18_plus: AgeGroupTypes;
    age_12_plus: AgeGroupTypes;
  };
  descriptionFooter: string;
}

export function VaccineCoverageToggleTile({
  title,
  topLabels,
  source,
  ageGroupText,
  descriptionFooter,
}: VaccineCoverageToggleTileProps) {
  /**
   * @TODO: remove mock data
   */
  const data = {
    date_unix: 123456789,
    age_18_plus_fully_vaccinated: 123456,
    age_18_plus_has_one_shot: 654312,
    age_18_plus_birthyear: '-2003',
    age_12_plus_fully_vaccinated: 654312,
    age_12_plus_has_one_shot: 123456,
    age_12_plus_birthyear: '-2009',
  };

  const [selectedTab, setSelectedTab] = useState(
    ageGroupText.age_18_plus.label
  );

  return (
    <KpiTile
      title={title}
      metadata={{
        date: data.date_unix,
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
                label: ageGroupText.age_18_plus.label,
                value: ageGroupText.age_18_plus.label,
              },
              {
                label: ageGroupText.age_12_plus.label,
                value: ageGroupText.age_12_plus.label,
              },
            ]}
          />
        </Box>
        <TwoKpiSection>
          {selectedTab === ageGroupText.age_18_plus.label && (
            <>
              <AgeGroupBlock
                title={topLabels.one_shot}
                kpiValue={data.age_18_plus_fully_vaccinated}
                description={
                  ageGroupText.age_18_plus.description_vaccination_one_shot
                }
                birthyear={data.age_18_plus_birthyear}
              />
              <AgeGroupBlock
                title={topLabels.vaccination_grade}
                kpiValue={data.age_18_plus_has_one_shot}
                description={
                  ageGroupText.age_18_plus.description_vaccination_grade
                }
                birthyear={data.age_18_plus_birthyear}
              />
            </>
          )}
          {selectedTab === ageGroupText.age_12_plus.label && (
            <>
              <AgeGroupBlock
                title={topLabels.one_shot}
                kpiValue={data.age_12_plus_fully_vaccinated}
                description={
                  ageGroupText.age_12_plus.description_vaccination_one_shot
                }
                birthyear={data.age_12_plus_birthyear}
              />
              <AgeGroupBlock
                title={topLabels.vaccination_grade}
                kpiValue={data.age_12_plus_has_one_shot}
                description={
                  ageGroupText.age_12_plus.description_vaccination_grade
                }
                birthyear={data.age_12_plus_birthyear}
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
  kpiValue: number;
  description: string;
  birthyear: string;
}

function AgeGroupBlock({
  title,
  kpiValue,
  description,
  birthyear,
}: AgeGroupBlockProps) {
  const { siteText } = useIntl();

  const parsedBirthyearRange = parseBirthyearRange(birthyear);

  assert(
    parsedBirthyearRange,
    `Something went wrong with parsing the birthyear: ${birthyear}`
  );

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
      <KpiValue percentage={kpiValue} />
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
