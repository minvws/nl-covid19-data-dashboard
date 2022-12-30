import { css } from '@styled-system/css';
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
      <Box maxWidth="maxWidthText" mt={36}>
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
      <Box pt={3} pb={1}>
        <KpiValue text={parsedAgePercentage} color={bar.color} />
      </Box>
      <Box pt={2} pb={3}>
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

const AgeGroupWrapper = styled.div(
  css({
    display: 'flex',
    justifyContent: 'start',
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
    hyphens: 'auto',
    px: asResponsiveArray({ _: 3, xs: 24 }),
    py: 24,
  })
);

const KpiContent = styled.div(
  css({
    border: `1px solid ${colors.gray3}`,
    position: 'relative',
    display: 'flex',
    flexDirection: asResponsiveArray({ _: 'column', sm: 'row' }),
    justifyContent: 'space-between',
    color: 'black',
  })
);
