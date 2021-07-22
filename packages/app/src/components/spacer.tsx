import { Box } from '~/components/base';

interface SpacerProps {
  amount: number;
}

export function Spacer({ amount }: SpacerProps) {
  return <Box mb={amount} display="flex" />;
}
