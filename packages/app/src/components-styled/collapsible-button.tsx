import { useState, useRef, useEffect } from 'react';
import css from '@styled-system/css';
import styled from 'styled-components';

import useResizeObserver from 'use-resize-observer';
import { Box } from './base';

interface CollapsibleButtonProps {
  children: React.ReactNode;
  label: string;
}

export function CollapsibleButton({ label, children }: CollapsibleButtonProps) {
  const { ref, height: contentHeight } = useResizeObserver();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [initialWidth, setInitialWidth] = useState(0);

  useEffect(() => {
    if (buttonRef.current) {
      setInitialWidth(buttonRef.current.offsetWidth);
    }
  }, [buttonRef.current]);

  return (
    <Box css={css({ textAlign: 'center' })}>
      <Container
        maxWidth={initialWidth ? initialWidth : undefined}
        minWidth={expanded ? '100%' : 0}
      >
        <ExpandButton ref={buttonRef} onClick={() => setExpanded(!expanded)}>
          {label}
          <Chevron expanded={expanded} />
        </ExpandButton>

        <Content
          css={css({
            height: expanded ? contentHeight : 0,
            width: expanded ? '100%' : 0,
          })}
        >
          <div ref={ref}>{children}</div>
        </Content>
      </Container>
    </Box>
  );
}

const Container = styled(Box).attrs({ as: 'section' })(
  css({
    position: 'relative',
    display: 'inline-flex',
    flexDirection: 'column',
    padding: 0,
    margin: '0 auto',
    transitionProperty: 'min-width',
    transitionDuration: '0.5s',
    bg: 'tileGray',
  })
);

const Content = styled(Box)(
  css({
    position: 'relative',
    transitionProperty: 'height',
    transitionDuration: '0.5s',
    overflow: 'hidden',

    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bg: 'lightGray',
      height: '1px',
    },
  })
);

const ExpandButton = styled.button(
  css({
    position: 'relative',
    px: 4,
    py: 3,
    border: 'none',
    background: 'none',
    font: 'inherit',
    color: 'blue',
    cursor: 'pointer',
    fontWeight: 'bold',
    zIndex: 1,

    '&:focus': {
      outlineWidth: '1px',
      outlineStyle: 'dashed',
      outlineColor: 'blue',
    },
  })
);

const Chevron = styled.div<{
  expanded: boolean;
}>((x) =>
  css({
    ml: 2,
    backgroundImage: 'url("/images/chevron-down.svg")',
    backgroundSize: '0.9em 0.5em',
    backgroundPosition: '0 50%',
    backgroundRepeat: 'no-repeat',
    height: '0.5em',
    width: '1em',
    display: 'inline-block',
    transitionProperty: 'transform',
    transitionDuration: '0.5s',
    transform: x.expanded ? 'rotate(-180deg)' : '',
  })
);
