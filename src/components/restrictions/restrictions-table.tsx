import { Fragment } from 'react';
import { Box } from '~/components-styled/base';
import { Cell, Row, Table, TableBody } from '~/components-styled/table';
import { InlineText } from '~/components-styled/typography';
import {
  RestrictionsTableData,
  RestrictionValue,
  useRestrictionsTable,
} from '~/components/restrictions/hooks/use-restrictions-table';
import siteText from '~/locale/index';
import { useEscalationColor } from '~/utils/use-escalation-color';
import { useBreakpoints } from '~/utils/useBreakpoints';
import { EscalationLevel } from './type';

export type RestrictionsTableProps = {
  data: RestrictionValue[];
  escalationLevel: EscalationLevel;
};

export type TableProps = {
  data: RestrictionsTableData;
  color: string;
};

const categoryLabels = siteText.maatregelen.categories;

export function RestrictionsTable(props: RestrictionsTableProps) {
  const { data, escalationLevel } = props;

  const restrictionsTable = useRestrictionsTable(data);

  const breakpoints = useBreakpoints(true);

  const color = useEscalationColor(escalationLevel);

  if (breakpoints.lg) {
    return <DesktopRestrictionsTable data={restrictionsTable} color={color} />;
  }

  return <MobileRestrictionsTable data={restrictionsTable} color={color} />;
}

function MobileRestrictionsTable(props: TableProps) {
  const { data, color } = props;
  return (
    <Table width="100%">
      <TableBody>
        {data.rows.map((row) => (
          <Fragment key={row.categoryColumn}>
            <Row>
              <Cell
                role="rowheader"
                borderTop={'1px solid black'}
                pt={3}
                px={2}
                pb={3}
                verticalAlign="center"
                backgroundColor="#F9F9F9"
              >
                <InlineText fontWeight="bold">
                  {categoryLabels[row.categoryColumn]}
                </InlineText>
              </Cell>
            </Row>
            <Row>
              <Cell pb={3} verticalAlign="top" pt={2}>
                <Box display="flex" flexDirection="column">
                  {row.restrictionsColumn.map((value) => (
                    <Box key={value.text} display="flex" flexDirection="row">
                      <Box as="span" flexShrink={0}>
                        {getIcon(value.Icon, color)}
                      </Box>
                      <Box pt="5px">{value.text}</Box>
                    </Box>
                  ))}
                </Box>
              </Cell>
            </Row>
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
}

function DesktopRestrictionsTable(props: TableProps) {
  const { data, color } = props;
  return (
    <Table width="100%">
      <TableBody>
        {data.rows.map((row) => (
          <Row key={row.categoryColumn}>
            <Cell
              role="rowheader"
              borderTop={'1px solid black'}
              backgroundColor="#F9F9F9"
              width="12em"
              py={3}
              px={2}
              verticalAlign="top"
            >
              <InlineText fontWeight="bold">
                {categoryLabels[row.categoryColumn]}
              </InlineText>
            </Cell>
            <Cell
              borderTop={'1px solid black'}
              pt={3}
              pb={3}
              pl={2}
              verticalAlign="top"
            >
              <Box display="flex" flexDirection="column">
                {row.restrictionsColumn.map((value) => (
                  <Box key={value.text} display="flex" flexDirection="row">
                    <Box as="span" flexShrink={0}>
                      {getIcon(value.Icon, color)}
                    </Box>
                    <Box as="span" ml={1} pt="5px">
                      {value.text}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );
}

function getIcon(IconComponent: any | undefined, color: string) {
  if (!IconComponent) {
    return <Box size={32} />;
  }

  return <IconComponent color={color} />;
}
