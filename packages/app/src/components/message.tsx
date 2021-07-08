import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { spacingStyle } from '~/style/functions/spacing';

type Variant = 'warning';

interface MessageProps {
  children: ReactNode;
  variant: Variant;
}

const theme: Record<Variant, { backgroundColor: string; borderColor: string }> =
  {
    warning: {
      backgroundColor: '#FFFADE',
      borderColor: '#FFE766',
    },
  };

export function Message({ children, variant }: MessageProps) {
  return <StyledMessage variant={variant}>{children}</StyledMessage>;
}

const StyledMessage = styled.div<{ variant: Variant }>((x) =>
  css({
    py: 2,
    px: 3,
    borderLeft: '7px solid',
    backgroundColor: theme[x.variant].backgroundColor,
    borderLeftColor: theme[x.variant].borderColor,

    '& > *': { m: 0 },
    ...spacingStyle(2),
  })
);
