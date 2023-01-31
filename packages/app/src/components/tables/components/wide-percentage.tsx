import styled from 'styled-components';
import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
import { fontSizes, lineHeights, space } from '~/style/theme';

interface WidePercentageProps {
  value: string | React.ReactNode;
  color: string;
  justifyContent: string;
}

export const WidePercentage = ({ value, color, justifyContent }: WidePercentageProps) => {
  return (
    <StyledInlineText justifyContent={justifyContent}>
      <Box minWidth="10px" width="10px" height="10px" backgroundColor={color} borderRadius="50%" marginRight={space[2]} />
      <span>{value}</span>
    </StyledInlineText>
  );
};

interface StyledInlineTextProps {
  justifyContent: string;
}

const StyledInlineText = styled(InlineText)<StyledInlineTextProps>`
  align-items: center;
  display: flex;
  font-size: ${fontSizes[2]};
  justify-content: ${({ justifyContent }) => justifyContent};
  line-height: ${lineHeights[2]};
  padding-right: ${space[4]};
  text-align: left;
`;
