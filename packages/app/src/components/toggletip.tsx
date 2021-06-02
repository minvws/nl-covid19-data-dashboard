import css from '@styled-system/css';
import { Text } from '~/components/typography';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { useUniqueId } from '~/utils/use-unique-id';
import { useHotkey } from '~/utils/hotkey/use-hotkey';
import { useViewport } from '~/utils/use-viewport';
import Informatie from '~/assets/informatie.svg';

const BUTTON_SIZE = 30;
const ARROW_SIZE = 20;
const BOUNDING = 20;
const MAX_WIDTH = 350;

interface ToggletipProps {
  description: any;
}

export function Toggletip({ description }: ToggletipProps) {
  const [isActive, setIsActive] = useState(false);
  // const resizeEvent = useViewport({ delayMs: 250 });
  const uniqueId = useUniqueId();
  const boundingBoxRef = useRef<HTMLDivElement>(null);

  const [transformX, setTransformX] = useState(0);

  // useEffect(() => {
  //   if (!boundingBoxRef.current) return;

  //   const bounding = boundingBoxRef.current.getBoundingClientRect();

  //   if (bounding.x < 0) {
  //     console.log('Left');
  //     setTransformX(Math.ceil(bounding.x * -1) + BOUNDING);
  //     return;
  //   }

  //   if (
  //     bounding.right >
  //     (window.innerWidth || document.documentElement.clientWidth)
  //   ) {
  //     console.log('Right');

  //     setTransformX((bounding.right - window.innerWidth) * -1 - BOUNDING);
  //     return;
  //   }
  // }, [resizeEvent, boundingBoxRef]);

  useHotkey('escape', () => {
    if (isActive) setIsActive(false);
  });

  const onMouseOverHandler = () => setIsActive(true);
  const onMouseLeaveHandler = () => setIsActive(false);
  const onFocusHandler = () => setIsActive(true);
  const onBlurHandler = () => setIsActive(false);

  return (
    <Box
      position="relative"
      display="inline-block"
      aria-expanded={isActive}
      aria-labelledby={uniqueId}
    >
      <Button
        onMouseOver={onMouseOverHandler}
        onMouseLeave={onMouseLeaveHandler}
        onFocus={onFocusHandler}
        onBlur={onBlurHandler}
        isActive={isActive}
        type="button"
      >
        <Informatie />
      </Button>
      <Box
        position="absolute"
        zIndex={9}
        top={0}
        transform={`translateX(${transformX}px)`}
      >
        <Content
          aria-hidden={!isActive}
          isActive={isActive}
          ref={boundingBoxRef}
        >
          <Text as="span" m={0} fontWeight="normal" id={uniqueId}>
            {description}
          </Text>
        </Content>
      </Box>
    </Box>
  );
}

const Button = styled.button<{ isActive: boolean }>(({ isActive }) =>
  css({
    all: 'unset',
    position: 'relative',
    height: BUTTON_SIZE,
    width: BUTTON_SIZE,
    backgroundColor: 'blue',
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'help',

    svg: {
      color: 'white',
      width: 7,
      height: 15,
      pr: '1px',
      pb: '1px',
    },

    '&:before': {
      position: 'absolute',
      left: `calc(50% - ${ARROW_SIZE / 2}px)`,
      top: -25,
      height: ARROW_SIZE,
      width: ARROW_SIZE,
      content: '""',
      backgroundColor: '#fff',
      transform: 'rotate(45deg)',
      zIndex: 99,
      boxShadow: '10px 10px 8px 3px rgba(0, 0, 0, 0.1)',
      opacity: isActive ? 1 : 0,
    },

    '&:focus': {
      outline: '2px dotted black',
    },

    // Some selectors to enable the interaction when there is no Javascript
    '&:hover, &:focus-visible': {
      '&:before': {
        '.has-no-js &': {
          opacity: 1,
        },
      },

      '+ div > div': {
        '.has-no-js &': {
          opacity: 1,
        },
      },
    },
  })
);

const Content = styled.div<{
  isActive: boolean;
}>(({ isActive }) =>
  css({
    top: 0,
    width: 'max-content',
    maxWidth: MAX_WIDTH,
    display: 'flex',
    position: 'absolute',
    py: 12,
    px: 10,
    backgroundColor: 'white',
    boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: 1,
    transform: `translate(calc(-50% + ${
      BUTTON_SIZE / 2
    }px), calc(-100% - 10px))`,
    zIndex: 20,
    opacity: isActive ? 1 : 0,
    pointerEvents: 'none',
  })
);
