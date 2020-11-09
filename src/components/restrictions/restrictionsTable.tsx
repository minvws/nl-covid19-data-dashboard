import { Fragment } from 'react';
import { isDefined } from 'ts-is-present';
import * as RestrictionIcons from '~/assets/restrictions';
import { Box } from '~/components-styled/base';
import { Cell, Row, Table, TableBody } from '~/components-styled/layout/table';
import { Text } from '~/components-styled/typography';
import { regionThresholds } from '~/components/choropleth/regionThresholds';
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
                      {getIcon(value.icon, color)}
                      {value.text}
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
                    {getIcon(value.icon, color)}
                    {value.text}
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

function getIcon(iconName: string | undefined, color: string) {
  if (!isDefined(iconName)) {
    return <Box as="span" width="24px" height="24px" />;
  }

  const Icon = (RestrictionIcons as any)[`${iconName}Icon`];
  return <Icon fill={color} />;
}
