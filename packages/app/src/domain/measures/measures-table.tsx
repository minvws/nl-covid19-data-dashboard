import { css } from '@styled-system/css';
import { Fragment } from 'react';
import { Box } from '~/components/base';
import { Cell, Row, Table, TableBody } from '~/components/table';
import { BoldText } from '~/components/typography';
import { space } from '~/style/theme';
import { Measures } from '~/types/cms';
import { useBreakpoints } from '~/utils/use-breakpoints';
import DynamicIcon from '~/components/get-icon-by-name';
import { IconName as MeasuresIcon } from '@corona-dashboard/icons/src/icon-name2filename';
import { getFilenameToIconName } from '~/utils';
import styled from 'styled-components';
import { colors } from '@corona-dashboard/common';
import { Dot } from '@corona-dashboard/icons';

interface MeasuresTableProps {
  data: Measures;
}

export function MeasuresTable(props: MeasuresTableProps) {
  const { data } = props;

  const breakpoints = useBreakpoints(true);

  if (breakpoints.lg) {
    return <DesktopMeasuresTable data={data} />;
  }

  return <MobileMeasuresTable data={data} />;
}

const MobileMeasuresTable = (props: MeasuresTableProps) => {
  const { data } = props;

  return (
    <Table width="100%">
      <TableBody>
        {data.measuresCollection.map((collection, index) => {
          return (
            <Fragment key={index}>
              <Row>
                <Cell role="rowheader" borderTop={'1px solid black'} paddingX={space[2]} paddingY={space[3]} verticalAlign="center" backgroundColor="gray1">
                  <BoldText>{collection.title}</BoldText>
                </Cell>
              </Row>
              <Row>
                <Cell paddingBottom={space[3]} verticalAlign="top" paddingTop={space[2]}>
                  <Box display="flex" flexDirection="column">
                    {collection.measuresItems.map((measuresItem, index) => {
                      return (
                        <Box key={index} display="flex" flexDirection="row" alignItems="flex-start" marginBottom={space[2]}>
                          <StyledIconWrapper>{measuresItem.icon ? <DynamicIcon name={getFilenameToIconName(measuresItem.icon) as MeasuresIcon} /> : <Dot />}</StyledIconWrapper>

                          <Box marginTop={space[2]}>{measuresItem.title}</Box>
                        </Box>
                      );
                    })}
                  </Box>
                </Cell>
              </Row>
            </Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
};

const DesktopMeasuresTable = (props: MeasuresTableProps) => {
  const { data } = props;

  return (
    <Table width="100%">
      <TableBody>
        {data.measuresCollection.map((collection, index) => {
          return (
            <Row
              key={index}
              css={css({
                '&:last-of-type': {
                  borderBottom: '1px solid black',
                },
              })}
            >
              <Cell role="rowheader" borderTop="1px solid black" backgroundColor="gray1" width="12em" paddingY={space[3]} paddingX={space[2]} verticalAlign="top">
                <BoldText>{collection.title}</BoldText>
              </Cell>
              <Cell borderTop="1px solid black" paddingY={space[3]} paddingLeft={space[2]} verticalAlign="top">
                <Box display="flex" flexDirection="column">
                  {collection.measuresItems.map((measuresItem, index) => {
                    return (
                      <Box key={index} display="flex" flexDirection="row" alignItems="flex-start" marginBottom={space[2]}>
                        <StyledIconWrapper>{measuresItem.icon ? <DynamicIcon name={getFilenameToIconName(measuresItem.icon) as MeasuresIcon} /> : <Dot />}</StyledIconWrapper>
                        <Box as="span" marginLeft={space[1]} marginTop={space[2]}>
                          {measuresItem.title}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Cell>
            </Row>
          );
        })}
      </TableBody>
    </Table>
  );
};

const StyledIconWrapper = styled.span`
  display: flex;
  flex-shrink: 0;
  margin-right: ${space[2]};
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  color: ${colors.blue8};
  svg {
    height: ${space[4]};
    width: ${space[4]};
  }
`;
