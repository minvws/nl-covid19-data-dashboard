import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { spacingStyle } from '~/style/functions/spacing';

type Variant = 'warning' | 'message';

interface MessageProps {
  children: ReactNode;
  variant: Variant;
  resetParentStyles?: boolean;
}

const theme: Record<Variant, { backgroundColor: string; borderColor: string }> =
  {
    warning: {
      backgroundColor: '#FFFADE',
      borderColor: '#FFE766',
    },
    message: {
      backgroundColor: 'lightGray',
      borderColor: '#555555',
    },
  };

export function Message({
  children,
  variant,
  resetParentStyles,
}: MessageProps) {
  return (
    <StyledMessage
      variant={variant}
      styledComponentId={StyledMessage.styledComponentId}
      resetParentStyles={resetParentStyles}
    >
      {children}
    </StyledMessage>
  );
}

const StyledMessage = styled.div<{
  variant: Variant;
  styledComponentId: string;
  resetParentStyles?: boolean;
}>((x) =>
  css({
    /**
     * We have to reset the parent styles when there are 2 blockquotes ("messages") added in markdown,
     * so we can use the styling from the second one.
     */
    position: 'relative',
    py: x.resetParentStyles ? 0 : 2,
    px: x.resetParentStyles ? 0 : 3,
    borderLeft: x.resetParentStyles ? 0 : '7px solid',
    backgroundColor: theme[x.variant].backgroundColor,
    borderLeftColor: theme[x.variant].borderColor,
    borderRadius: '5px',

    '& > *': {
      m: 0,
    },
    ...spacingStyle(2),

    [`.${x.styledComponentId}`]: {
      backgroundColor: theme[x.variant].backgroundColor,
      borderLeftColor: theme[x.variant].borderColor,
    },
  })
);
