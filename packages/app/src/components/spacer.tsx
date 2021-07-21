import { Box } from '~/components/base';

type SpacerProps = {
  amount: number;
};

export function Spacer({ amount }: SpacerProps) {
  return <Box mb={amount} display="flex" />;
}
