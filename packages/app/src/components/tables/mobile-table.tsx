import { AgeGroup } from '~/domain/vaccine/components/age-group';
import { BehaviorAnchor, Cell, HeaderCell, Row, Table } from './components/shared-styled-components';
import { BehaviorIcon } from '~/domain/behavior/components/behavior-icon';
import { BehaviorIdentifier } from '~/domain/behavior/logic/behavior-types';
import { BoldText } from '~/components/typography';
import { Box } from '~/components/base';
import { formatAgeGroupString } from '~/utils/format-age-group-string';
import { formatBirthyearRangeString } from '~/utils/format-birthyear-range-string';
import { NlBehaviorValue, VrBehaviorArchived_20221019Value } from '@corona-dashboard/common';
import { PercentageData, PercentageDataPoint } from './components/percentage-data';
import { SiteText } from '~/locale';
import { space } from '~/style/theme';
import { useIntl } from '~/intl';

type PercentageData = PercentageDataPoint[][];

type ScrollRef = { current: HTMLDivElement | null };

interface MobileTableProps {
  headerText: string;
  // tableData: NlBehaviorValue | VrBehaviorArchived_20221019Value;
  tableData: any[]; // TODO:AP - figure out how to properly type this.
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
              <HeaderCell width="100%">{headerText} - Mobile table</HeaderCell>
            </Row>
          </thead>

          <tbody>
            {tableData.map((item, tableDataIndex) => (
              <Row key={item.id} display="flex">
                <Cell minWidth="100%">
                  <Box display="flex" alignItems="center" marginBottom={space[2]}>
                    {isBehaviourTable && (
                      <>
                        <Box minWidth="32px" color="black" paddingRight={space[2]} display="flex">
                          <BehaviorIcon name={item.id} size={25} />
                        </Box>

                        <BehaviorAnchor as="button" underline="hover" color="black" onClick={onClickConfig ? () => onClickConfig.handler(item.id, onClickConfig.scrollRef) : undefined}>
                            <Box as="span" display="flex" alignItems="center" textAlign="left" flexWrap="wrap">
                              <BoldText>{item.description}</BoldText>
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
