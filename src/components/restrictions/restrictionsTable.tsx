import { Box } from '~/components-styled/base';
import { Table, Cell, Row, TableBody } from '~/components-styled/layout/table';
import { Text } from '~/components-styled/typography';
import { RestrictionsTableData } from '~/utils/useRestrictionsTable';
import siteText from '~/locale/index';

export type RestrictionsTableProps = {
  data: RestrictionsTableData;
};

const text = siteText.restriction_categories;

export function RestrictionsTable(props: RestrictionsTableProps) {
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
                {text[row.category]}
              </Text>
            </Cell>
            <Cell
              borderTop={'1px solid black'}
              pt={3}
              pb={3}
              verticalAlign="top"
            >
              <Box display="flex" flexDirection="column">
                {row.restrictions.map((value) => (
                  <Box key={value.text} display="flex" flexDirection="row">
                    {value.Icon}
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
