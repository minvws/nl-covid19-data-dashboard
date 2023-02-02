import { Box } from '~/components/base';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { Metadata, MetadataProps } from '~/components/metadata';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { BoldText, Text } from '~/components/typography';
import { parseBirthyearRange } from '~/domain/vaccine/logic/parse-birthyear-range';
import { useIntl } from '~/intl';
import { asResponsiveArray } from '~/style/utils';
import { assert } from '~/utils/assert';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { Bar } from '../components/bar';
import styled from 'styled-components';
import { colors } from '@corona-dashboard/common';
import { space } from '~/style/theme';

type BarType = {
  value: number;
  color: string;
};

export type AgeDataType = {
  value: number | null;
  birthyear: string | null;
  title: string;
  description: string;
  bar: BarType;
};

interface VaccineCoverageTileProps {
  title: string;
  description: string;
  source: {
    text: string;
    href: string;
  };
  descriptionFooter: string;
  coverageData: [AgeDataType, AgeDataType];
  dateUnix: number;
}

export const VaccineCoverageTile = ({ title, description, source, descriptionFooter, dateUnix, coverageData }: VaccineCoverageTileProps) => {
  const metadata: MetadataProps = {
    date: dateUnix,
    source: source,
  };

  return (
    <KpiTile title={title} hasNoPaddingBottom>
      <Text>{description}</Text>
      <TwoKpiSection spacing={5}>
        <KpiContent>
          {coverageData.map((tile, index) => {
            return (
              <AgeGroupWrapper key={index}>
                <AgeGroupBlock data={tile} bar={tile.bar} />
              </AgeGroupWrapper>
            );
          })}
        </KpiContent>
      </TwoKpiSection>
      <Metadata {...metadata} isTileFooter />
      <Box maxWidth="maxWidthText" marginTop="36px">
        <Markdown content={descriptionFooter} />
      </Box>
    </KpiTile>
  );
};

interface AgeGroupBlockProps {
  data: AgeDataType;
  bar: BarType;
  children?: React.ReactNode;
}

const AgeGroupBlock = ({ data, bar, children }: AgeGroupBlockProps) => {
  const { commonTexts, formatPercentage } = useIntl();

  const parsedAgePercentage = data.value ? `${formatPercentage(data.value)}%` : '-';

  const parsedBirthyearRange = data.birthyear ? parseBirthyearRange(data.birthyear) : null;

  assert(parsedBirthyearRange, `[${AgeGroupBlock.name}] Something went wrong with parsing the birthyear: ${data.birthyear}`);

  return (
    <Box>
      <BoldText>{data.title}</BoldText>
      <Box paddingTop={space[3]} paddingBottom={space[1]}>
        <KpiValue text={parsedAgePercentage} color={bar.color} />
      </Box>
      <Box paddingTop={space[2]} paddingBottom={space[3]}>
        <Bar value={bar.value} color={bar.color} height={12} />
      </Box>
      <Markdown
        content={replaceVariablesInText(data.description, {
          birthyear: replaceVariablesInText(commonTexts.common.birthyear_ranges[parsedBirthyearRange.type], parsedBirthyearRange),
        })}
      />
      {children}
    </Box>
  );
};

const AgeGroupWrapper = styled.div`
  display: 'flex';
  justify-content: 'start';
  overflow-wrap: 'break-word';
  word-wrap: 'break-word';
  hyphens: 'auto';
  padding-left: ${asResponsiveArray({ _: '3px', xs: '24px' })};
  padding-right: ${asResponsiveArray({ _: '3px', xs: '24px' })};
  padding-bottom: 24px;
  padding-top: 24px;
`;

const KpiContent = styled.button`
  border: 1px solid ${colors.gray3};
  position: 'relative';
  display: 'flex';
  flex-direction: ${asResponsiveArray({ _: 'column', sm: 'row' })};
  justify-content: 'space-between';
  color: 'black';
`;
