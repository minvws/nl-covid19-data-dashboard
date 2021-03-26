import { Box } from '~/components-styled/base';
import { InlineText } from '~/components-styled/typography';

export function VaccinationCoverage(props: { value: string }) {
  const { value } = props;
  return (
    <Box display="flex" width="50%" justifyContent="flex-end">
      <InlineText color="blue" fontSize={{ _: 3, lg: 4 }} fontWeight="bold">
        {value}
      </InlineText>
    </Box>
  );
}
