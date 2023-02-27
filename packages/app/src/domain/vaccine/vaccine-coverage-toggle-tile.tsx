import { css } from '@styled-system/css';
import { useState } from 'react';
import { Box } from '~/components/base';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { Metadata, MetadataProps } from '~/components/metadata';
import { RadioGroup } from '~/components/radio-group';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { BoldText } from '~/components/typography';
import { parseBirthyearRange } from '~/domain/vaccine/logic/parse-birthyear-range';
import { useIntl } from '~/intl';
import { SiteText } from '~/locale';
import { space } from '~/style/theme';
import { assert } from '~/utils/assert';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { KeyWithLabel, useVaccineCoveragePercentageFormatter } from './logic/use-vaccine-coverage-percentage-formatter';

type AgeTypes = {
  fully_vaccinated: number | null;
  has_one_shot: number | null;
  boostered?: number | null;
  dateUnixBoostered?: number;
  third_shot?: number | null;
  birthyear: string;
  fully_vaccinated_label?: string | null;
  has_one_shot_label?: string | null;
  boostered_label?: string | null;
};

type VaccinationGradeToggleTypes = {
  booster_date_interval: string;
  description_booster_grade: string;
  description_booster_grade_not_available: string;
  description_vaccination_grade: string;
  description_vaccination_one_shot_with_percentage: string;
  label: string;
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
  dateUnix: number | null;
  numFractionDigits?: number;
  age12PlusToggleText: VaccinationGradeToggleTypes;
  age18PlusToggleText: VaccinationGradeToggleTypes;
  labelTexts: SiteText['pages']['vaccinations_page']['nl']['vaccination_grade_toggle_tile']['top_labels'];
}

export function VaccineCoverageToggleTile({
  title,
  source,
  descriptionFooter,
  dateUnix,
  age18Plus,
  age12Plus,
  numFractionDigits = 0,
  age12PlusToggleText,
  age18PlusToggleText,
  labelTexts,
}: VaccineCoverageToggleTileProps) {
  const [selectedTab, setSelectedTab] = useState(age18PlusToggleText.label);

  const metadata: MetadataProps = {
    date: dateUnix ?? undefined,
    source: source,
  };

  return (
    <KpiTile title={title}>
      <Box css={css({ '& div': { justifyContent: 'flex-start' } })} marginBottom={space[3]}>
        <RadioGroup
          value={selectedTab}
          onChange={(value) => setSelectedTab(value)}
          items={[
            {
              label: age18PlusToggleText.label,
              value: age18PlusToggleText.label,
            },
            {
              label: age12PlusToggleText.label,
              value: age12PlusToggleText.label,
            },
          ]}
        />
      </Box>
      <TwoKpiSection spacing={5}>
        {selectedTab === age18PlusToggleText.label && (
          <>
            {age18Plus.boostered ? (
              <AgeGroupBlock
                title={labelTexts.booster_grade}
                data={age18Plus}
                property="boostered"
                description={age18PlusToggleText.description_booster_grade}
                numFractionDigits={numFractionDigits}
              >
                {age18Plus.dateUnixBoostered && <Metadata source={source} date={age18Plus.dateUnixBoostered} isTileFooter />}
              </AgeGroupBlock>
            ) : (
              <NoBoosterBlock title={labelTexts.booster_grade} description={age18PlusToggleText.description_booster_grade_not_available} />
            )}
            <AgeGroupBlock
              title={labelTexts.vaccination_grade}
              data={age18Plus}
              property="fully_vaccinated"
              secondProperty="has_one_shot"
              description={age18PlusToggleText.description_vaccination_grade}
              secondDescription={age18PlusToggleText.description_vaccination_one_shot_with_percentage}
              numFractionDigits={numFractionDigits}
            >
              {metadata && <Metadata {...metadata} isTileFooter />}
            </AgeGroupBlock>
          </>
        )}
        {selectedTab === age12PlusToggleText.label && (
          <>
            {age12Plus.boostered ? (
              <AgeGroupBlock
                title={labelTexts.booster_grade}
                data={age12Plus}
                property="boostered"
                description={age12PlusToggleText.description_booster_grade}
                numFractionDigits={numFractionDigits}
              >
                {age12Plus.dateUnixBoostered && <Metadata source={source} date={age12Plus.dateUnixBoostered} isTileFooter />}
              </AgeGroupBlock>
            ) : (
              <NoBoosterBlock title={labelTexts.booster_grade} description={age12PlusToggleText.description_booster_grade_not_available} />
            )}
            <AgeGroupBlock
              title={labelTexts.vaccination_grade}
              data={age12Plus}
              property="fully_vaccinated"
              secondProperty="has_one_shot"
              description={age12PlusToggleText.description_vaccination_grade}
              secondDescription={age12PlusToggleText.description_vaccination_one_shot_with_percentage}
              numFractionDigits={numFractionDigits}
            >
              {metadata && <Metadata {...metadata} isTileFooter />}
            </AgeGroupBlock>
          </>
        )}
      </TwoKpiSection>
      <Box maxWidth="maxWidthText" marginTop="36px">
        <Markdown content={descriptionFooter} />
      </Box>
    </KpiTile>
  );
}

interface AgeGroupBlockProps {
  title: string;
  data: AgeTypes;
  property: KeyWithLabel<AgeTypes>;
  secondProperty?: KeyWithLabel<AgeTypes>;
  description: string;
  secondDescription?: string;
  numFractionDigits?: number;
  children?: React.ReactNode;
}

function AgeGroupBlock({ title, data, property, secondProperty, description, secondDescription, numFractionDigits, children }: AgeGroupBlockProps) {
  const { commonTexts } = useIntl();
  const formatCoveragePercentage = useVaccineCoveragePercentageFormatter(numFractionDigits);

  const parsedBirthyearRange = parseBirthyearRange(data.birthyear);

  assert(parsedBirthyearRange, `[${AgeGroupBlock.name}] Something went wrong with parsing the birthyear: ${data.birthyear}`);

  return (
    <Box spacing={2}>
      <BoldText
        css={css({
          display: 'flex',
        })}
      >
        {title}
      </BoldText>
      <KpiValue text={formatCoveragePercentage(data, property)} />
      <Markdown
        content={replaceVariablesInText(description, {
          birthyear: replaceVariablesInText(commonTexts.common.birthyear_ranges[parsedBirthyearRange.type], parsedBirthyearRange),
        })}
      />
      {secondDescription && secondProperty && (
        <Markdown
          content={replaceVariablesInText(secondDescription, {
            birthyear: replaceVariablesInText(commonTexts.common.birthyear_ranges[parsedBirthyearRange.type], parsedBirthyearRange),
            percentage: formatCoveragePercentage(data, secondProperty),
          })}
        />
      )}
      {children}
    </Box>
  );
}

interface NoBoosterBlockProps {
  title: string;
  description: string;
}

function NoBoosterBlock({ title, description }: NoBoosterBlockProps) {
  return (
    <Box spacing={2}>
      <BoldText
        css={css({
          display: 'flex',
        })}
      >
        {title}
      </BoldText>
      <Markdown content={description} />
    </Box>
  );
}
