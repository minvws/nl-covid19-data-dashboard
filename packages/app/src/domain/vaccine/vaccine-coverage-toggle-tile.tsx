import { css } from '@styled-system/css';
import { useState } from 'react';
import { Box } from '~/components/base';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { Metadata, MetadataProps } from '~/components/metadata';
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
  boostered?: number | null;
  dateUnixBoostered?: number;
  third_shot?: number | null;
  birthyear: string;
  fully_vaccinated_label?: string | null;
  has_one_shot_label?: string | null;
  boostered_label?: string | null;
  third_shot_label?: string | null;
};

type VaccinationGradeToggleTypes = {
  booster_date_interval: string;
  description_booster_grade: string;
  description_booster_grade_not_available: string;
  description_vaccination_grade: string;
  description_vaccination_one_shot: string;
  description_vaccination_one_shot_with_percentage: string;
  description_vaccination_third_shot: string;
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
  dateUnix: number;
  dateUnixThirdShot?: number;
  numFractionDigits?: number;
  age12PlusToggleText: VaccinationGradeToggleTypes;
  age18PlusToggleText: VaccinationGradeToggleTypes;
}

export function VaccineCoverageToggleTile({
  title,
  source,
  descriptionFooter,
  dateUnix,
  dateUnixThirdShot,
  age18Plus,
  age12Plus,
  numFractionDigits = 0,
  age12PlusToggleText,
  age18PlusToggleText,
}: VaccineCoverageToggleTileProps) {
  const { siteText } = useIntl();
  const labelTexts =
    siteText.pages.vaccinationsPage.nl.vaccination_grade_toggle_tile.top_labels;
  const [selectedTab, setSelectedTab] = useState(age18PlusToggleText.label);

  const metadata: MetadataProps = {
    date: dateUnix,
    source: source,
  };

  const metadataThirdShot: MetadataProps = {
    date: dateUnixThirdShot,
    source: source,
  };

  return (
    <KpiTile title={title}>
      <Box css={css({ '& div': { justifyContent: 'flex-start' } })} mb={3}>
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
                {age18Plus.dateUnixBoostered && (
                  <Metadata
                    source={source}
                    date={age18Plus.dateUnixBoostered}
                    intervalCount={age18PlusToggleText.booster_date_interval}
                    isTileFooter
                  />
                )}
              </AgeGroupBlock>
            ) : (
              <NoBoosterBlock
                title={labelTexts.booster_grade}
                description={
                  age18PlusToggleText.description_booster_grade_not_available
                }
              />
            )}
            <AgeGroupBlock
              title={labelTexts.vaccination_grade}
              data={age18Plus}
              property="fully_vaccinated"
              secondProperty="has_one_shot"
              thirdProperty="third_shot"
              description={age18PlusToggleText.description_vaccination_grade}
              secondDescription={
                age18PlusToggleText.description_vaccination_one_shot_with_percentage
              }
              thirdDescription={
                age18PlusToggleText.description_vaccination_third_shot
              }
              numFractionDigits={numFractionDigits}
              metadataFullyOrOneShots={metadata}
              metadataThirdShots={metadataThirdShot}
            />
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
                {age12Plus.dateUnixBoostered && (
                  <Metadata
                    source={source}
                    date={age12Plus.dateUnixBoostered}
                    intervalCount={age12PlusToggleText.booster_date_interval}
                    isTileFooter
                  />
                )}
              </AgeGroupBlock>
            ) : (
              <NoBoosterBlock
                title={labelTexts.booster_grade}
                description={
                  age12PlusToggleText.description_booster_grade_not_available
                }
              />
            )}
            <AgeGroupBlock
              title={labelTexts.vaccination_grade}
              data={age12Plus}
              property="fully_vaccinated"
              secondProperty="has_one_shot"
              description={age12PlusToggleText.description_vaccination_grade}
              secondDescription={
                age12PlusToggleText.description_vaccination_one_shot_with_percentage
              }
              numFractionDigits={numFractionDigits}
            >
              {metadata && <Metadata {...metadata} isTileFooter />}
            </AgeGroupBlock>
          </>
        )}
      </TwoKpiSection>
      <Box maxWidth="maxWidthText" mt={36}>
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
  thirdProperty?: KeyWithLabel<AgeTypes>;
  description: string;
  secondDescription?: string;
  thirdDescription?: string;
  numFractionDigits?: number;
  children?: React.ReactNode;
  metadataFullyOrOneShots?: MetadataProps;
  metadataThirdShots?: MetadataProps;
}

function AgeGroupBlock({
  title,
  data,
  property,
  secondProperty,
  thirdProperty,
  description,
  secondDescription,
  thirdDescription,
  numFractionDigits,
  children,
  metadataFullyOrOneShots,
  metadataThirdShots,
}: AgeGroupBlockProps) {
  const { siteText, formatNumber } = useIntl();
  const formatCoveragePercentage =
    useVaccineCoveragePercentageFormatter(numFractionDigits);

  const parsedBirthyearRange = parseBirthyearRange(data.birthyear);

  assert(
    parsedBirthyearRange,
    `[${AgeGroupBlock.name}] Something went wrong with parsing the birthyear: ${data.birthyear}`
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
            siteText.pages.vaccinationsPage.nl.birthyear_ranges[
              parsedBirthyearRange.type
            ],
            parsedBirthyearRange
          ),
        })}
      />
      {secondDescription && secondProperty && (
        <Markdown
          content={replaceVariablesInText(secondDescription, {
            birthyear: replaceVariablesInText(
              siteText.pages.vaccinationsPage.nl.birthyear_ranges[
                parsedBirthyearRange.type
              ],
              parsedBirthyearRange
            ),
            percentage: formatCoveragePercentage(data, secondProperty),
          })}
        />
      )}
      {metadataFullyOrOneShots && (
        <Metadata {...metadataFullyOrOneShots} isTileFooter />
      )}
      {thirdDescription && thirdProperty && (
        <Markdown
          content={replaceVariablesInText(thirdDescription, {
            amount: formatNumber(data.third_shot),
          })}
        />
      )}
      {metadataThirdShots && <Metadata {...metadataThirdShots} isTileFooter />}
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
      <InlineText
        fontWeight="bold"
        css={css({
          display: 'flex',
        })}
      >
        {title}
      </InlineText>
      <Markdown content={description} />
    </Box>
  );
}
