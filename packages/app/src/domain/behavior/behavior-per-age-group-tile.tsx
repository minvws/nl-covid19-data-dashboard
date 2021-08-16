import { NlBehaviorPerAgeGroup } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { Fragment } from 'react';
import styled from 'styled-components';
import { isDefined, isPresent } from 'ts-is-present';
import { Box } from '~/components/base';
import { Tile } from '~/components/tile';
import { Heading, InlineText, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { asResponsiveArray } from '~/style/utils';
import { assert } from '~/utils/assert';
import { SelectBehavior } from './components/select-behavior';
import { BehaviorIdentifier } from './logic/behavior-types';

const AGE_KEYS = ['70_plus', '55_69', '40_54', '25_39', '16_24'] as const;

interface BehaviorPerAgeGroupProps {
  title: string;
  description: string;
  complianceExplanation: string;
  supportExplanation: string;
  data: NlBehaviorPerAgeGroup;
  currentId: BehaviorIdentifier;
  setCurrentId: React.Dispatch<React.SetStateAction<BehaviorIdentifier>>;
}

export function BehaviorPerAgeGroup({
  title,
  description,
  data,
  complianceExplanation,
  supportExplanation,
  currentId,
  setCurrentId,
}: BehaviorPerAgeGroupProps) {
  const { siteText } = useIntl();

  const complianceValue = data[`${currentId}_compliance` as keyof typeof data];
  const supportValue = data[`${currentId}_support` as keyof typeof data];

  assert(
    typeof complianceValue !== 'number',
    'There is a problem by filtering the numbers out'
  );
  assert(
    typeof supportValue !== 'number',
    'There is a problem by filtering the numbers out'
  );

  return (
    <Tile>
      <Heading level={3}>{title}</Heading>
      <Text>{description}</Text>

      <Box mb={4}>
        <SelectBehavior value={currentId} onChange={setCurrentId} />
      </Box>
      <Box overflow="auto">
        {isDefined(complianceValue) || isDefined(supportValue) ? (
          <Box overflow="auto">
            <StyledTable>
              <thead>
                <tr>
                  <HeaderCell
                    css={css({
                      width: asResponsiveArray({ _: 150, md: 200 }),
                    })}
                  >
                    {siteText.gedrag_leeftijden.tabel.age_group}
                  </HeaderCell>
                  <HeaderCell>
                    {siteText.gedrag_leeftijden.tabel.recent_research}
                  </HeaderCell>
                </tr>
              </thead>
              <tbody>
                {AGE_KEYS.map((age, index) => (
                  <Fragment key={index}>
                    {supportValue &&
                      complianceValue &&
                      isPresent(complianceValue[age]) &&
                      isPresent(supportValue[age]) && (
                        <tr>
                          <Cell>{siteText.gedrag_leeftijden.tabel[age]}</Cell>
                          <Cell>
                            <PercentageBar
                              color={colors.data.cyan}
                              amount={complianceValue[age]}
                            />
                            <PercentageBar
                              color={colors.data.yellow}
                              amount={supportValue[age]}
                            />
                          </Cell>
                        </tr>
                      )}
                  </Fragment>
                ))}
              </tbody>
            </StyledTable>
            <Box display="flex" flexWrap="wrap" mb={{ _: 2, xs: 4 }}>
              <Box mr={3} mb={1}>
                <ExplanationBox background={colors.data.cyan} />
                {complianceExplanation}
              </Box>
              <Box>
                <ExplanationBox background={colors.data.yellow} />
                {supportExplanation}
              </Box>
            </Box>
          </Box>
        ) : (
          <Box
            display="flex"
            alignItems="center"
            minHeight={325}
            maxWidth={300}
            width="100%"
            mx="auto"
          >
            <Text textAlign="center" mb={0}>
              {siteText.gedrag_leeftijden.tabel.error}
            </Text>
          </Box>
        )}
      </Box>
    </Tile>
  );
}

interface PercentageBarProps {
  amount: number | null;
  color: string;
}

function PercentageBar({ amount, color }: PercentageBarProps) {
  if (!isPresent(amount)) {
    return null;
  }

  return (
    <Box display="flex" alignItems="center">
      <InlineText
        fontWeight="bold"
        css={css({ minWidth: 50 })}
      >{`${amount}%`}</InlineText>
      <Box maxWidth={100} width="100%">
        <Box
          width={`${amount}%`}
          height={8}
          backgroundColor={color}
          css={css({ transition: 'width .3s' })}
        />
      </Box>
    </Box>
  );
}

const StyledTable = styled.table(
  css({
    borderCollapse: 'collapse',
    width: '100%',
    mb: 4,
  })
);

const HeaderCell = styled.th(
  css({
    textAlign: 'left',
  })
);

const Cell = styled.td((x) =>
  css({
    color: x.color,
    borderBottom: '1px solid',
    borderBottomColor: 'lightGray',
    p: 0,
    py: 2,
    minHeight: 100,
  })
);

const ExplanationBox = styled.div<{ background: string }>((x) =>
  css({
    height: '17px',
    width: '17px',
    background: x.background,
    float: 'left',
    mt: '3px',
    mr: 1,
    borderRadius: '3px',
  })
);
