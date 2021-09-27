import { css } from '@styled-system/css';
import { useState } from 'react';
import { Box } from '~/components/base';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { RadioGroup } from '~/components/radio-group';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { InlineText } from '~/components/typography';
import { parseBirthyearRange } from '~/domain/vaccine/logic/parse-birthyear-range';
import { useIntl } from '~/intl';
import { assert } from '~/utils/assert';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import {
  KeyWithLabel,
  useVaccineCoveragePercentageFormatter,
} from './logic/use-vaccine-coverage-percentage-formatter';

type AgeTypes = {
  fully_vaccinated: number | null;
  has_one_shot: number | null;
  birthyear: string;
  fully_vaccinated_label?: string | null;
  has_one_shot_label?: string | null;
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
                data={age18Plus}
                property="has_one_shot"
                description={text.age_18_plus.description_vaccination_one_shot}
                numFractionDigits={numFractionDigits}
              />
              <AgeGroupBlock
                title={text.top_labels.vaccination_grade}
                data={age18Plus}
                property="fully_vaccinated"
                description={text.age_18_plus.description_vaccination_grade}
                numFractionDigits={numFractionDigits}
              />
            </>
          )}
          {selectedTab === text.age_12_plus.label && (
            <>
              <AgeGroupBlock
                title={text.top_labels.one_shot}
                data={age12Plus}
                property="has_one_shot"
                description={text.age_12_plus.description_vaccination_one_shot}
                numFractionDigits={numFractionDigits}
              />
              <AgeGroupBlock
                title={text.top_labels.vaccination_grade}
                data={age12Plus}
                property="fully_vaccinated"
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
  data: AgeTypes;
  property: KeyWithLabel<AgeTypes>;
  description: string;
  numFractionDigits?: number;
}

function AgeGroupBlock({
  title,
  data,
  property,
  description,
  numFractionDigits,
}: AgeGroupBlockProps) {
  const { siteText } = useIntl();
  const formatCoveragePercentage =
    useVaccineCoveragePercentageFormatter(numFractionDigits);

  const parsedBirthyearRange = parseBirthyearRange(data.birthyear);

  assert(
    parsedBirthyearRange,
    `Something went wrong with parsing the birthyear: ${data.birthyear}`
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
      <KpiValue text={formatCoveragePercentage(data, property)} />
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
