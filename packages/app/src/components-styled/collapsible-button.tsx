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
  const { ref: containerRef, width: containerWidth } = useResizeObserver();
  const { ref: contentRef, height: contentHeight } = useResizeObserver();
  const {
    ref: buttonRef,
    width: buttonWidth,
    height: buttonHeight,
  } = useResizeObserver();
  // const buttonRef = useRef<HTMLButtonElement>(null);
  const [expanded, setExpanded] = useState(false);
  // const [initialWidth, setInitialWidth] = useState(0);

  // useEffect(() => {
  //   if (buttonRef.current) {
  //     setInitialWidth(buttonRef.current.offsetWidth);
  //   }
  // }, [buttonRef.current]);

  const expandedHeight =
    buttonHeight && contentHeight ? buttonHeight + contentHeight : 0;
  return (
    <Box
      ref={containerRef}
      css={css({
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      })}
    >
      <Container
        // maxWidth={buttonWidth ? buttonWidth : undefined}
        minHeight={expanded ? expandedHeight : 0}
        width="100%"
        // minWidth={expanded ? '100%' : 0}
      >
        <ExpandButton ref={buttonRef} onClick={() => setExpanded(!expanded)}>
          {label}
          <Chevron expanded={expanded} />
        </ExpandButton>
        <Content
          css={css({
            // position: 'absolute',
            top: buttonHeight,
            // bottom: 0,
            // zIndex: 1,
            // right: '0%',
            // width: containerWidth,
          })}
        >
          <div ref={contentRef}>{children}</div>
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
    transitionProperty: 'min-width, min-height',
    transitionDuration: '0.5s',
    bg: 'tileGray',
    // overflow: 'hidden',
  })
);

const Content = styled(Box)(
  css({
    position: 'absolute',
    transitionProperty: 'height',
    transitionDuration: '0.5s',
    // overflow: 'hidden',

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
    boxSizing: 'border-box',

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
