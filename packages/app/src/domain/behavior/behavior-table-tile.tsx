import { Anchor, InlineText, Text } from '~/components/typography';
import { BehaviorIcon } from './components/behavior-icon';
import { BehaviorIdentifier } from './logic/behavior-types';
import { BehaviorTrend } from './components/behavior-trend';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { colors, NlBehaviorValue, VrBehaviorArchived_20221019Value } from '@corona-dashboard/common';
import { compose, display, DisplayProps, width, WidthProps, minWidth, MinWidthProps, border, BorderProps } from 'styled-system';
import { fontWeights, space } from '~/style/theme';
import { getPercentageData } from '~/components/tables/logic/get-percentage-data';
import { isDefined, isPresent } from 'ts-is-present';
import { MobileTable } from '~/components/tables/mobile-table';
import { PercentageBar } from '~/components/percentage-bar';
import { PercentageDataPoint } from '~/components/tables/components/percentage-data';
import { SiteText } from '~/locale';
import { useBehaviorLookupKeys } from './logic/use-behavior-lookup-keys';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { WidePercentage } from '../vaccine/components/wide-percentage';
import React, { useMemo } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';
import styled from 'styled-components';

interface BehaviorTableTileProps {
  title: string;
  description: string;
  complianceExplanation: string;
  supportExplanation: string;
  value: NlBehaviorValue | VrBehaviorArchived_20221019Value;
  annotation: string;
  setCurrentId: React.Dispatch<React.SetStateAction<BehaviorIdentifier>>;
  scrollRef: { current: HTMLDivElement | null };
  text: SiteText['pages']['behavior_page']['shared'];
}

const trendColumnWidth = 125;

export function BehaviorTableTile({ title, description, value, annotation, setCurrentId, scrollRef, text }: BehaviorTableTileProps) {
  const breakpoints = useBreakpoints(true);
  const behaviorsTableData = useBehaviorTableData(value as NlBehaviorValue);
  const titles = { first: 'Coronaregel volgen', second: 'Coronaregel steunen' };
  const colorValues = { first: colors.blue6, second: colors.yellow3 };
  const percentageKeys = { 
    first: { propertyKey: 'compliancePercentage', shouldFormat: false },
    second: { propertyKey: 'supportPercentage', shouldFormat: false }
  }
  const trendDirectionKeys = {
    first: { propertyKey: 'complianceTrend' },
    second: { propertyKey: 'supportTrend' }
  }
  const percentageData: PercentageDataPoint[][] = getPercentageData(behaviorsTableData, titles, colorValues, percentageKeys, trendDirectionKeys);
  
  const anchorButtonClickHandler = (id: BehaviorIdentifier, scrollRef: { current: HTMLDivElement | null }) => {
    scrollIntoView(scrollRef.current as Element);
    setCurrentId(id);
  };

  return (
    <ChartTile title={title} description={description}>
      {breakpoints.lg ? (
        <Box overflow="auto">
          <StyledTable>
            <thead>
              <Row>
                <HeaderCell width={{ _: '100%', md: 'auto', lg: '300px', xl: '400px' }} display={{ _: 'none', md: 'table-cell' }}>{text.basisregels.header_basisregel}</HeaderCell>
                <HeaderCell width={{ md: '150px' }} display={{ _: 'none', md: 'table-cell' }}>
                  Coronaregel volgen
                </HeaderCell>
                <HeaderCell width={{ md: trendColumnWidth }} display={{ _: 'none', md: 'table-cell' }}>
                  Coronaregel steunen
                </HeaderCell>
                <HeaderCell display={{ _: 'none', md: 'table-cell' }}></HeaderCell>
              </Row>
            </thead>
            <tbody>
              {behaviorsTableData.map((behavior) => (
                <>
                  {/* Desktop/wide screens */}
                  <Row key={behavior.id}>
                    <Cell minWidth="300px">
                      <Box display="flex" marginRight={space[2]}>
                        <Box minWidth="32px" color="black" paddingRight={space[2]} display="flex">
                          <BehaviorIcon name={behavior.id} size={25} />
                        </Box>

                        <StyledAnchor as="button" underline="hover" color="black" onClick={() => anchorButtonClickHandler(behavior.id, scrollRef)}>
                          <Box as="span" display="flex" alignItems="center" textAlign="left" flexWrap="wrap">
                            <InlineText>{behavior.description}</InlineText>
                          </Box>
                        </StyledAnchor>
                      </Box>
                    </Cell>

                    <Cell minWidth={trendColumnWidth}>
                      <WidePercentage
                        value={<BehaviorTrend trend={behavior.complianceTrend} color={colors.black} text={`${behavior.compliancePercentage}%`} />}
                        color={colors.blue6}
                        justifyContent="flex-start"
                      />
                    </Cell>

                    <Cell minWidth={trendColumnWidth}>
                      <WidePercentage
                        value={<BehaviorTrend trend={behavior.supportTrend} color={colors.black} text={`${behavior.supportPercentage}%`} />}
                        color={colors.yellow3}
                        justifyContent="flex-start"
                      />
                    </Cell>

                    <Cell minWidth="200px">
                      <Box display="flex" flexDirection="column">
                        <PercentageBarWithoutNumber percentage={behavior.compliancePercentage} color={colors.blue6} marginBottom={space[1]} />
                        <PercentageBarWithoutNumber percentage={behavior.supportPercentage} color={colors.yellow3} />
                      </Box>
                    </Cell>
                  </Row>
                  </>
                ))}
              </tbody>
            </StyledTable>
        </Box>
      ) : (
        <MobileTable
          tableData={behaviorsTableData}
          percentageData={percentageData}
          headerText={text.basisregels.header_basisregel}
          onClickConfig={{
            handler: anchorButtonClickHandler,
            scrollRef: scrollRef
          }}
          isBehaviourTable
        />
      )}

      <Box marginTop={space[2]} maxWidth="maxWidthText">
        <Text variant="label1" color="gray7">
          {annotation}
        </Text>
      </Box>
    </ChartTile>
  );
}

interface PercentageBarWithoutNumberProps {
  percentage: number;
  color: string;
  marginBottom?: string;
}

// TODO:AP - Can be deleted after desktop-table is implemented
function PercentageBarWithoutNumber({ percentage, color, marginBottom }: PercentageBarWithoutNumberProps) {
  return (
    <Box display="flex" alignItems="center" spacingHorizontal={2} marginBottom={marginBottom}>
      <Box color={color} flexGrow={1}>
        <PercentageBar percentage={percentage} height="8px" />
      </Box>
    </Box>
  );
}

function useBehaviorTableData(value: NlBehaviorValue) {
  const behaviorLookupKeys = useBehaviorLookupKeys();

  return useMemo(() => {
    return behaviorLookupKeys
      .map((x) => {
        const compliancePercentage = value[x.complianceKey];
        const complianceTrend = value[`${x.complianceKey}_trend` as const];

        const supportPercentage = value[x.supportKey];
        const supportTrend = value[`${x.supportKey}_trend` as const];

        if (isPresent(supportPercentage) && isDefined(supportTrend) && isPresent(compliancePercentage) && isDefined(complianceTrend)) {
          return {
            id: x.key,
            description: x.description,
            compliancePercentage,
            complianceTrend,
            supportPercentage,
            supportTrend,
          };
        }
      })
      .filter(isDefined)
      .sort((a, b) => (b.compliancePercentage ?? 0) - (a.compliancePercentage ?? 0));
  }, [value, behaviorLookupKeys]);
}

// TODO:AP - All of the styled components could be deleted after implementing desktop table - see shared-styled-components
const StyledTable = styled.table`
  border-collapse: collapse;
  width: 100%;
`;

type RowProps = DisplayProps;

const Row = styled.tr<RowProps>`
  flex-wrap: wrap;
  justify-content: space-between;
  ${compose(display)};
`;

type HeaderCellProps = WidthProps & DisplayProps;

const HeaderCell = styled.th<HeaderCellProps>`
  border-bottom: 1px solid ${colors.gray2};
  text-align: left;
  font-weight: ${fontWeights.bold};
  vertical-align: middle;
  padding-bottom: ${space[2]};
  ${compose(width)};
  ${compose(display)};
`;

type CellProps = MinWidthProps & BorderProps;

const Cell = styled.td<CellProps>`
  border-bottom: 1px solid ${colors.gray2};
  padding: ${space[3]} ${space[0]};
  vertical-align: middle;
  ${compose(minWidth)};
  ${compose(border)};
`;

const StyledAnchor = styled(Anchor)`
  &:hover {
    color: ${colors.blue8};
  }
`;
