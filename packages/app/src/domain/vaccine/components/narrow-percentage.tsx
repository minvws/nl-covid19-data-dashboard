import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
import { space } from '~/style/theme';


interface NarrowPercentageProps {
  value: number | React.ReactNode;
  color: string;
  textLabel: string;
}

export function NarrowPercentage({ value, color, textLabel }: NarrowPercentageProps) {
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" paddingRight={{ _: space[3], xl: space[4]}}>
      <Box paddingRight={space[3]} minWidth="8.5rem" textAlign="left">
        <InlineText>{`${textLabel}:`}</InlineText>
      </Box>

      <Box display="flex" alignItems="center">
        <Box
          width="10px"
          height="10px"
          backgroundColor={color}
          borderRadius="50%"
          marginRight={space[2]}
        />
        {value}
      </Box>
    </Box>
  );
}
