import { Box } from '~/components-styled/base';
import { Table, Td, Tr } from '~/components-styled/layout/table';
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
    <Table>
      <tbody>
        {data.rows.map((row) => (
          <Tr key={row.category}>
            <Td>
              <Text fontWeight="bold">{text[row.category]}</Text>
            </Td>
            <Td>
              <Box display="flex" flexDirection="column">
                {row.restrictions.map((value) => (
                  <Box key={value.text} display="flex" flexDirection="row">
                    {value.Icon}
                    {value.text}
                  </Box>
                ))}
              </Box>
            </Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
}
