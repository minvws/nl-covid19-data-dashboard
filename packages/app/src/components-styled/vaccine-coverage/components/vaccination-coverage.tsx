import { InlineText } from '~/components-styled/typography';

export function VaccinationCoverage(props: { value: string }) {
  const { value } = props;
  return (
    <InlineText color="blue" fontSize={4} fontWeight="bold">
      {value}
    </InlineText>
  );
}
