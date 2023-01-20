import { Box } from '~/components/base';
import { BoldText } from '~/components/typography';
import { BehaviorIcon } from '~/domain/behavior/components/behavior-icon';
import { AgeGroup } from '~/domain/vaccine/components/age-group';
import { useIntl } from '~/intl';
import { space } from '~/style/theme';
import { formatAgeGroupString } from '~/utils/format-age-group-string';
import { formatBirthyearRangeString } from '~/utils/format-birthyear-range-string';
import { PercentageData } from './components/mobile-percentage-data';
import { BehaviorAnchor, Cell, HeaderCell, Row, Table } from './components/shared-styled-components';
import { CommonTableProps } from './types';

interface NarrowTableProps extends CommonTableProps {
  headerText: string;
  tableData: any[]; // TODO:AP - figure out how to properly type this
}

// Component shown for tables on narrow screens.
export const NarrowTable = ({ tableData, headerText, hasAgeGroups, hasIcon, percentageData, onClickConfig }: NarrowTableProps) => {
  const { commonTexts } = useIntl();

  return (
    <Box overflow="auto">
      <Table>
        <thead>
          <Row>
            <HeaderCell width="100%">{headerText}</HeaderCell>
          </Row>
        </thead>

        <tbody>
          {tableData.map((item, tableDataIndex) => (
            <Row key={`narrow-${item.id}`} display="flex">
              <Cell minWidth="100%">
                <Box display="flex" alignItems="center" marginBottom={space[2]}>
                  {hasIcon && (
                    <>
                      <Box minWidth="32px" color="black" paddingRight={space[2]} display="flex">
                        <BehaviorIcon name={item.id} size={25} />
                      </Box>

                      <BehaviorAnchor
                        as="button"
                        underline="hover"
                        color="black"
                        onClick={onClickConfig ? () => onClickConfig.handler(item.id, onClickConfig.scrollRef) : undefined}
                      >
                        <Box as="span" display="flex" alignItems="center" textAlign="left" flexWrap="wrap">
                          <BoldText>{item.description}</BoldText>
                        </Box>
                      </BehaviorAnchor>
                    </>
                  )}

                  {hasAgeGroups && item?.ageGroupRange && item?.birthYearRange && (
                    <AgeGroup
                      range={formatAgeGroupString(item.ageGroupRange, commonTexts.common.agegroup)}
                      ageGroupTotal={item.ageGroupTotal ? item.ageGroupTotal : undefined}
                      birthyear_range={formatBirthyearRangeString(item.birthYearRange, commonTexts.common.birthyears)}
                      text={commonTexts.common.agegroup.total_people}
                    />
                  )}
                </Box>

                <Box display="flex" flexDirection="column">
                  {percentageData.map(
                    (percentageDataPoints, percentageDataIndex) =>
                      percentageDataIndex === tableDataIndex && <PercentageData percentageDataPoints={percentageDataPoints} key={`narrow-${item.id}-${percentageDataIndex}`} />
                  )}
                </Box>
              </Cell>
            </Row>
          ))}
        </tbody>
      </Table>
    </Box>
  );
};
