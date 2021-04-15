import { Fragment } from 'react';
import { Box } from '~/components/base';
import { Cell, Row, Table, TableBody } from '~/components/table';
import { InlineText } from '~/components/typography';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { restrictionIcons } from './restriction-icons';
import { LockdownData } from '~/types/cms';
import { css } from '@styled-system/css';

export type LockdownTableProps = {
  data: LockdownData;
};

export function LockdownTable(props: LockdownTableProps) {
  const { data } = props;

  const breakpoints = useBreakpoints(true);

  //@TODO This should come from data or the CMS.
  const escalationLevel = 4;

  if (breakpoints.lg) {
    return (
      <DesktopLockdownTable data={data} escalationLevel={escalationLevel} />
    );
  }

  return <MobileLockdownTable data={data} escalationLevel={escalationLevel} />;
}

/**
 *
 * This function returns a css filter to change an image from black to the desired escalation level color
 * We can't use fill or currentColor because we're loading the SVG's as images to save on bundle size
 * The colors are pre-calculated though this URL: https://codepen.io/sosuke/pen/Pjoqqp
 */
function getEscalationFilter(escalationLevel: 1 | 2 | 3 | 4) {
  switch (escalationLevel) {
    // #F291BC
    case 1:
      return 'invert(64%) sepia(40%) saturate(490%) hue-rotate(286deg) brightness(99%) contrast(91%)';
    // #D95790
    case 2:
      return 'invert(52%) sepia(21%) saturate(3993%) hue-rotate(302deg) brightness(91%) contrast(86%)';
    // #A11050
    case 3:
      return 'invert(15%) sepia(48%) saturate(4967%) hue-rotate(317deg) brightness(92%) contrast(101%)';
    // #68032F
    case 4:
      return 'invert(9%) sepia(48%) saturate(6614%) hue-rotate(322deg) brightness(85%) contrast(103%)';
    default:
      return undefined;
  }
}

type LockdownTableData = {
  data: LockdownData;
  escalationLevel: 1 | 2 | 3 | 4;
};

function MobileLockdownTable(props: LockdownTableData) {
  const { data, escalationLevel } = props;
  const filter = getEscalationFilter(escalationLevel);

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
                              <img
                                src={`/icons/restrictions/${
                                  restrictionIcons[restriction.icon]
                                }`}
                                width="36"
                                height="36"
                                alt=""
                                css={css({ filter })}
                              />
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
  const { data, escalationLevel } = props;

  const filter = getEscalationFilter(escalationLevel);

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
                          {restriction.icon &&
                          restrictionIcons[restriction.icon] ? (
                            <img
                              src={`/icons/restrictions/${
                                restrictionIcons[restriction.icon]
                              }`}
                              width="36"
                              height="36"
                              alt=""
                              css={css({
                                filter: filter,
                              })}
                            />
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
