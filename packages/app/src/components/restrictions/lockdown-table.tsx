import { Fragment } from 'react';
import { Box } from '~/components-styled/base';
import { Cell, Row, Table, TableBody } from '~/components-styled/table';
import { InlineText } from '~/components-styled/typography';
import { useEscalationColor } from '~/utils/use-escalation-color';
import { useBreakpoints } from '~/utils/useBreakpoints';
import { restrictionIcons } from './restriction-icons';
import { LockdownData } from '~/types/cms';
import { css } from '@styled-system/css';

export type LockdownTableProps = {
  data: LockdownData;
};

export function LockdownTable(props: LockdownTableProps) {
  const { data } = props;

  const breakpoints = useBreakpoints(true);

  const color = useEscalationColor(4);

  if (breakpoints.lg) {
    return <DesktopLockdownTable data={data} color={color} />;
  }

  return <MobileLockdownTable data={data} color={color} />;
}

type LockdownTableData = {
  data: LockdownData;
  color: string;
};

function MobileLockdownTable(props: LockdownTableData) {
  const { data, color } = props;
  return (
    <Table width="100%">
      <TableBody>
        {data.groups.map((group) => {
          return (
            <Fragment key={group._key}>
              <Row>
                <Cell
                  role="rowheader"
                  borderTop={'1px solid black'}
                  px={2}
                  py={3}
                  verticalAlign="center"
                  backgroundColor="#F9F9F9"
                >
                  <InlineText fontWeight="bold">{group.title}</InlineText>
                </Cell>
              </Row>
              <Row>
                <Cell pb={3} verticalAlign="top" pt={2}>
                  <Box display="flex" flexDirection="column">
                    {group.restrictions.map((restriction) => {
                      return (
                        <Box
                          key={restriction._key}
                          display="flex"
                          flexDirection="row"
                          alignItems="flex-start"
                          mb="1"
                        >
                          <Box
                            as="span"
                            flexShrink={0}
                            mr="2"
                            css={css({
                              svg: {
                                display: 'block',
                              },
                            })}
                          >
                            {restriction.icon ? (
                              getIcon(restrictionIcons[restriction.icon], color)
                            ) : (
                              <Box size={36} />
                            )}
                          </Box>
                          <Box mt="2">{restriction.text}</Box>
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
}

function DesktopLockdownTable(props: LockdownTableData) {
  const { data, color } = props;

  return (
    <Table width="100%">
      <TableBody>
        {data.groups.map((group) => {
          return (
            <Row key={group._key}>
              <Cell
                role="rowheader"
                borderTop={'1px solid black'}
                backgroundColor="#F9F9F9"
                width="12em"
                py={3}
                px={2}
                verticalAlign="top"
              >
                <InlineText fontWeight="bold">{group.title}</InlineText>
              </Cell>
              <Cell
                borderTop={'1px solid black'}
                pt={3}
                pb={3}
                pl={2}
                verticalAlign="top"
              >
                <Box display="flex" flexDirection="column">
                  {group.restrictions.map((restriction) => {
                    return (
                      <Box
                        key={restriction._key}
                        display="flex"
                        flexDirection="row"
                        alignItems="flex-start"
                        mb="1"
                      >
                        <Box
                          as="span"
                          flexShrink={0}
                          mr="2"
                          css={css({
                            svg: {
                              display: 'block',
                            },
                          })}
                        >
                          {restriction.icon ? (
                            getIcon(restrictionIcons[restriction.icon], color)
                          ) : (
                            <Box size={36} />
                          )}
                        </Box>
                        <Box as="span" ml={1} mt={2}>
                          {restriction.text}
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
}

function getIcon(IconComponent: any | undefined, color: string) {
  return <IconComponent color={color} />;
}
