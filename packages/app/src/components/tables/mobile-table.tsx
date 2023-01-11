import { AgeGroup } from '~/domain/vaccine/components/age-group';
import { Anchor, InlineText } from '~/components/typography';
import { BehaviorIcon } from '~/domain/behavior/components/behavior-icon';
import { BehaviorIdentifier } from '~/domain/behavior/logic/behavior-types';
import { border, BorderProps, compose, display, DisplayProps, minWidth, MinWidthProps, width, WidthProps } from 'styled-system';
import { Box } from '~/components/base';
import { colors, NlBehaviorValue, VrBehaviorArchived_20221019Value } from '@corona-dashboard/common';
import { fontWeights, space } from '~/style/theme';
import { formatAgeGroupString } from '~/utils/format-age-group-string';
import { formatBirthyearRangeString } from '~/utils/format-birthyear-range-string';
import { PercentageData, PercentageDataPoint } from './components/percentage-data';
import { SiteText } from '~/locale';
import { useIntl } from '~/intl';
import styled from 'styled-components';

type PercentageData = PercentageDataPoint[][];

type ScrollRef = { current: HTMLDivElement | null };

interface MobileTableProps {
  headerText: string;
  // tableData: NlBehaviorValue | VrBehaviorArchived_20221019Value;
  tableData: any[];
  percentageData: PercentageData;
  hasAgeGroups?: boolean;
  isBehaviourTable?: boolean;
  onClickConfig?: {
    handler: (id: BehaviorIdentifier, scrollRef: ScrollRef) => void,
    scrollRef: ScrollRef;
  };
}

export const MobileTable = ({ tableData, headerText, hasAgeGroups, isBehaviourTable, percentageData, onClickConfig }: MobileTableProps) => {
  const { commonTexts } = useIntl();

  return (
    <Box overflow="auto">
      <Table>
          <thead>
            <Row>
              <HeaderCell width={{_: '100%', md: 'auto', lg: '300px', xl: '400px'}}>
                {headerText}
              </HeaderCell>
            </Row>
          </thead>

          <tbody>
            {tableData.map((item, tableDataIndex) => (
              <Row key={item.id} display={{ _: 'flex', lg: 'none' }}>
                <Cell minWidth={{ _: '100%' }}>
                  <Box display="flex" margin={`0 ${space[2]} ${space[2]}`}>
                    {isBehaviourTable && (
                      <>
                        <Box minWidth="32px" color="black" paddingRight={space[2]} display="flex">
                          <BehaviorIcon name={item.id} size={25} />
                        </Box>

                        <BehaviorAnchor as="button" underline="hover" color="black" onClick={onClickConfig ? () => onClickConfig.handler(item.id, onClickConfig.scrollRef) : undefined}>
                          <Box as="span" display="flex" alignItems="center" textAlign="left" flexWrap="wrap">
                            <InlineText>{item.description}</InlineText>
                          </Box>
                        </BehaviorAnchor>
                      </>
                    )}

                    {hasAgeGroups && (
                      <AgeGroup
                        range={formatAgeGroupString(item.age_group_range, commonTexts.common.agegroup)}
                        ageGroupTotal={'age_group_total' in item ? item.age_group_total : undefined}
                        birthyear_range={formatBirthyearRangeString(item.birthyear_range, commonTexts.common.birthyears)}
                        text={commonTexts.common.agegroup.total_people}
                      />
                    )}
                  </Box>

                  <Box display="flex" flexDirection="column">
                    {percentageData.map((percentageDataPoints, percentageDataIndex) => (
                      percentageDataIndex === tableDataIndex && <PercentageData percentageDataPoints={percentageDataPoints} key={percentageDataIndex} />
                    ))}
                  </Box>
                </Cell>
              </Row>
            ))}
          </tbody>
        </Table>
    </Box>
  );
};

const Table = styled.table`
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
  font-weight: ${fontWeights.bold};
  padding-bottom: ${space[2]};
  text-align: left;
  vertical-align: middle;
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

const BehaviorAnchor = styled(Anchor)`
  &:hover {
    color: ${colors.blue8};
  }
`;
