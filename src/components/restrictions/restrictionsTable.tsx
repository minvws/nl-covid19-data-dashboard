import { Fragment } from 'react';
import { Box } from '~/components-styled/base';
import { Cell, Row, Table, TableBody } from '~/components-styled/layout/table';
import { Text } from '~/components-styled/typography';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import siteText from '~/locale/index';
import { useBreakpoints } from '~/utils/useBreakpoints';
import { RestrictionsTableData } from '~/utils/useRestrictionsTable';
import { ChoroplethThresholds } from '../choropleth/shared';

export type RestrictionsTableProps = {
  data: RestrictionsTableData;
  escalationLevel: number;
};

export type TableProps = {
  data: RestrictionsTableData;
  color: string;
};

const categoryLabels = siteText.maatregelen.categories;

const escalationThresholds = (regionThresholds.escalation_levels as ChoroplethThresholds)
  .thresholds;

export function RestrictionsTable(props: RestrictionsTableProps) {
  const { data, escalationLevel } = props;
  const breakpoints = useBreakpoints();

  const color =
    escalationThresholds.find(
      (threshold) => threshold.threshold === escalationLevel
    )?.color ?? '#000';

  if (breakpoints.lg) {
    return <DesktopRestrictionsTable data={data} color={color} />;
  }

  return <MobileRestrictionsTable data={data} color={color} />;
}

function MobileRestrictionsTable(props: TableProps) {
  const { data, color } = props;
  return (
    <Table width="100%">
      <TableBody>
        {data.rows.map((row) => (
          <Fragment key={row.category}>
            <Row>
              <Cell
                borderTop={'1px solid black'}
                width="20em"
                pt={3}
                verticalAlign="top"
              >
                <Text as="span" fontWeight="bold">
                  {categoryLabels[row.category]}
                </Text>
              </Cell>
            </Row>
            <Row>
              <Cell pb={3} verticalAlign="top">
                <Box display="flex" flexDirection="column">
                  {row.restrictions.map((value) => (
                    <Box key={value.text} display="flex" flexDirection="row">
                      <Box as="span" flexShrink={0}>
                        {getIcon(value.Icon, color)}
                      </Box>
                      <Box as="span">{value.text}</Box>
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
          <Row key={row.category}>
            <Cell
              borderTop={'1px solid black'}
              width="250em"
              pt={3}
              pb={3}
              verticalAlign="top"
            >
              <Text as="span" fontWeight="bold">
                {categoryLabels[row.category]}
              </Text>
            </Cell>
            <Cell
              borderTop={'1px solid black'}
              pt={3}
              pb={3}
              pl={2}
              verticalAlign="top"
            >
              <Box display="flex" flexDirection="column">
                {row.restrictions.map((value) => (
                  <Box key={value.text} display="flex" flexDirection="row">
                    <Box as="span" flexShrink={0}>
                      {getIcon(value.Icon, color)}
                    </Box>
                    <Box as="span" ml={1}>
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
    return <Box width="32px" height="32px" />;
  }

  return <IconComponent fill={color} />;
}
