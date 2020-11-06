import { Fragment } from 'react';

import { Box } from '~/components-styled/base';
import { Table, Cell, Row, TableBody } from '~/components-styled/layout/table';
import { Text } from '~/components-styled/typography';
import { RestrictionsTableData } from '~/utils/useRestrictionsTable';
import siteText from '~/locale/index';
import { useBreakpoints } from '~/utils/useBreakpoints';

export type RestrictionsTableProps = {
  data: RestrictionsTableData;
};

const categoryLabels = siteText.maatregelen.categories;

export function RestrictionsTable(props: RestrictionsTableProps) {
  const { data } = props;
  const breakpoints = useBreakpoints();

  if (breakpoints.lg) {
    return <DesktopRestrictionsTable data={data} />;
  }

  return <MobileRestrictionsTable data={data} />;
}

function MobileRestrictionsTable(props: RestrictionsTableProps) {
  const { data } = props;
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
                      {value.icon}
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

function DesktopRestrictionsTable(props: RestrictionsTableProps) {
  const { data } = props;
  return (
    <Table width="100%">
      <TableBody>
        {data.rows.map((row) => (
          <Row key={row.category}>
            <Cell
              borderTop={'1px solid black'}
              width="20em"
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
                    <RestrictionIcon iconName={value.icon} />
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

type RestrictionIconProps = {
  iconName?: string;
};

function RestrictionIcon(props: RestrictionIconProps) {
  const { iconName } = props;

  if (!iconName?.length) {
    return <Box width="24px" height="24px" mr={1} />;
  }

  return (
    <Box
      backgroundImage={`url(/images/restrictions/${iconName}.svg)`}
      backgroundSize={'24px 24px'}
      backgroundPosition={'0 0'}
      backgroundRepeat={'no-repeat'}
      width="24px"
      height="24px"
      mr={1}
    />
  );
}
