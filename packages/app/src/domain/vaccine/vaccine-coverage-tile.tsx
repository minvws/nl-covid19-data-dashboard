import { css } from '@styled-system/css';
import { Box } from '~/components/base';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { Metadata, MetadataProps } from '~/components/metadata';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { BoldText } from '~/components/typography';
import { parseBirthyearRange } from '~/domain/vaccine/logic/parse-birthyear-range';
import { useIntl } from '~/intl';
import { SiteText } from '~/locale';
import { asResponsiveArray } from '~/style/utils';
import { assert } from '~/utils/assert';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { Bar } from './components/bar';
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
};

type VaccinationGradeToggleTypes = {
  booster_date_interval: string;
  description_booster_grade: string;
  description_booster_grade_not_available: string;
  description_vaccination_grade: string;
  description_vaccination_one_shot: string;
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
  dateUnix: number;
  numFractionDigits?: number;
  age12PlusToggleText: VaccinationGradeToggleTypes;
  age18PlusToggleText: VaccinationGradeToggleTypes;
  labelTexts: SiteText['pages']['vaccinations_page']['nl']['vaccination_grade_toggle_tile']['top_labels'];
}

export function VaccineCoverageTile({
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
  const metadata: MetadataProps = {
    date: dateUnix,
    source: source,
  };

  return (
    <KpiTile title="Vaccinatiegraad Najaarsprik">
      <TwoKpiSection spacing={5}>
        <Box
          borderColor="#CCCCCC"
          borderWidth="1px"
          borderStyle="solid"
          position="relative"
          display="flex"
          flexDirection={'row'}
          justifyContent={'space-between'}
          color="#000000"
        >
          <Box
            css={css({
              display: 'flex',
              justifyContent: 'start',
              paddingLeft: asResponsiveArray({ _: 3, xs: 4 }),
              paddingRight: 0,
              paddingTop: asResponsiveArray({ _: 3, xs: 4 }),
              paddingBottom: asResponsiveArray({ _: 3, xs: 4 }),
              overflowWrap: 'break-word',
              wordWrap: 'break-word',
              hyphens: 'auto',
            })}
          >
            <AgeGroupBlock
              title="60 jaar en ouder"
              data={age18Plus}
              property="fully_vaccinated"
              secondProperty="has_one_shot"
              description={age18PlusToggleText.description_vaccination_grade}
              numFractionDigits={numFractionDigits}
            >
              <Box spacing={1}>
                <Bar value="80" color="#002F5F" />
              </Box>
            </AgeGroupBlock>
          </Box>
          <Box
            css={css({
              display: 'flex',
              justifyContent: 'start',
              paddingLeft: asResponsiveArray({ _: 3, xs: 4 }),
              paddingRight: 24,
              paddingTop: asResponsiveArray({ _: 3, xs: 4 }),
              paddingBottom: asResponsiveArray({ _: 3, xs: 4 }),
              overflowWrap: 'break-word',
              wordWrap: 'break-word',
              hyphens: 'auto',
            })}
          >
            <AgeGroupBlock
              title="12 jaar en ouder"
              data={age12Plus}
              property="fully_vaccinated"
              secondProperty="has_one_shot"
              description={age12PlusToggleText.description_vaccination_grade}
              numFractionDigits={numFractionDigits}
            >
              <Box spacing={1}>
                <Bar value="80" color="#002F5F" />
              </Box>
            </AgeGroupBlock>
          </Box>
        </Box>
      </TwoKpiSection>
      <Box> {metadata && <Metadata {...metadata} isTileFooter />}</Box>{' '}
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
  secondDescription?: string;
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
  const { commonTexts } = useIntl();
  const formatCoveragePercentage =
    useVaccineCoveragePercentageFormatter(numFractionDigits);

  const parsedBirthyearRange = parseBirthyearRange(data.birthyear);

  assert(
    parsedBirthyearRange,
    `[${AgeGroupBlock.name}] Something went wrong with parsing the birthyear: ${data.birthyear}`
  );

  return (
    <Box spacing={2}>
      <BoldText>{title}</BoldText>
      <KpiValue text={formatCoveragePercentage(data, property)} />
      <Markdown
        content={replaceVariablesInText(description, {
          birthyear: replaceVariablesInText(
            commonTexts.common.birthyear_ranges[parsedBirthyearRange.type],
            parsedBirthyearRange
          ),
        })}
      />
      {secondDescription && secondProperty && (
        <Markdown
          content={replaceVariablesInText(secondDescription, {
            birthyear: replaceVariablesInText(
              commonTexts.common.birthyear_ranges[parsedBirthyearRange.type],
              parsedBirthyearRange
            ),
            percentage: formatCoveragePercentage(data, secondProperty),
          })}
        />
      )}
      {children}
    </Box>
  );
}
