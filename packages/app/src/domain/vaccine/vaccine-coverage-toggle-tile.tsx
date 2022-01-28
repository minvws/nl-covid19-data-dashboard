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
  birthyear: string;
  fully_vaccinated_label?: string | null;
  has_one_shot_label?: string | null;
  boostered_label?: string | null;
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
  dateUnixBoostered?: number;
  numFractionDigits?: number;
}

export function VaccineCoverageToggleTile({
  title,
  source,
  descriptionFooter,
  dateUnix,
  dateUnixBoostered,
  age18Plus,
  age12Plus,
  numFractionDigits = 0,
}: VaccineCoverageToggleTileProps) {
  const { siteText } = useIntl();
  const text = siteText.pages.vaccinations.nl.vaccination_grade_toggle_tile;
  const [selectedTab, setSelectedTab] = useState(text.age_18_plus.label);

  const metadata: MetadataProps = {
    date: dateUnix,
    source: source,
  };

  const metadataBooster: MetadataProps = {
    date: dateUnixBoostered,
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
      <TwoKpiSection spacing={5}>
        {selectedTab === text.age_18_plus.label && (
          <>
            {age18Plus.boostered ?
              <AgeGroupBlock
                title={text.top_labels.booster_grade}
                data={age18Plus}
                property="boostered"
                description={text.age_18_plus.description_booster_grade}
                numFractionDigits={numFractionDigits}
              >
                {metadataBooster && (
                  <Metadata
                    {...metadataBooster}
                    intervalCount={text.age_18_plus.booster_date_interval}
                    isTileFooter
                  />
                )}
              </AgeGroupBlock>
            : <NoBoosterBlock
                title={text.top_labels.booster_grade}
                description={text.age_18_plus.description_booster_grade_not_available}
              />
            }
            <AgeGroupBlock
              title={text.top_labels.vaccination_grade}
              data={age18Plus}
              property="fully_vaccinated"
              secondProperty="has_one_shot"
              description={text.age_18_plus.description_vaccination_grade}
              secondDescription={text.age_18_plus.description_vaccination_one_shot}
              numFractionDigits={numFractionDigits}
            >
              {metadata && <Metadata {...metadata} isTileFooter />}
            </AgeGroupBlock>
          </>
        )}
        {selectedTab === text.age_12_plus.label && (
          <>
            {age12Plus.boostered ?
              <AgeGroupBlock
                title={text.top_labels.booster_grade}
                data={age12Plus}
                property="boostered"
                description={text.age_12_plus.description_booster_grade}
                numFractionDigits={numFractionDigits}
              >
                {metadataBooster && (
                  <Metadata
                    {...metadataBooster}
                    intervalCount={text.age_12_plus.booster_date_interval}
                    isTileFooter
                  />
                )}
              </AgeGroupBlock>
            : <NoBoosterBlock
                title={text.top_labels.booster_grade}
                description={text.age_12_plus.description_booster_grade_not_available}
              />
            }
            <AgeGroupBlock
              title={text.top_labels.vaccination_grade}
              data={age12Plus}
              property="fully_vaccinated"
              secondProperty="has_one_shot"
              description={text.age_12_plus.description_vaccination_grade}
              secondDescription={text.age_12_plus.description_vaccination_one_shot}
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
  description: string;
  secondDescription?: string,
  numFractionDigits?: number;
  children?: React.ReactNode;
}

function AgeGroupBlock({
  title,
  data,
  property,
  secondProperty,
  description,
  secondDescription,
  numFractionDigits,
  children,
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
            siteText.pages.vaccinations.nl.birthyear_ranges[
              parsedBirthyearRange.type
            ],
            parsedBirthyearRange
          ),
        })}
      />
      {secondDescription && secondProperty &&
        <Markdown
          content={replaceVariablesInText(secondDescription, {
            birthyear: replaceVariablesInText(
              siteText.pages.vaccinations.nl.birthyear_ranges[
                parsedBirthyearRange.type
              ],
              parsedBirthyearRange
            ),
            percentage: formatCoveragePercentage(data, secondProperty),
          })}
        />
      }
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
