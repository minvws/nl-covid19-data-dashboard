import css from '@styled-system/css';
import { InlineText, Text } from '~/components/typography';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { useState, useRef, useLayoutEffect } from 'react';
import { useUniqueId } from '~/utils/use-unique-id';
import { useHotkey } from '~/utils/hotkey/use-hotkey';
import { useViewport } from '~/utils/use-viewport';

const BUTTON_SIZE = 30;
const ARROW_SIZE = 20;
const TOOLTIP_BOUNDING_SMALL_SCREEN = 10;
const MAX_WIDTH = 250;

interface ToggletipProps {
  description: any;
}

export function Toggletip({ description }: ToggletipProps) {
  const [isActive, setIsActive] = useState(false);
  const resizeEvent = useViewport(250);
  const uniqueId = useUniqueId();
  const boundingBoxRef = useRef<HTMLDivElement>(null);

  const [isTooNarrow, setIsTooNarrow] = useState(false);
  const [transformX, setTransformX] = useState(0);

  // HIER MOET NOG MEE GEDAAN WORDEN MET DE FOCUS
  const onMouseOverHandler = () => setIsActive(true);
  const onMouseLeaveHandler = () => setIsActive(false);
  const onFocusHandler = () => setIsActive(true);
  const onBlurHandler = () => setIsActive(false);

  useLayoutEffect(() => {
    if (!boundingBoxRef.current) return;

    const bounding = boundingBoxRef.current.getBoundingClientRect();

    if (MAX_WIDTH < window.innerWidth) setIsTooNarrow(false);

    if (
      bounding.width > window.innerWidth &&
      bounding.right >
        (window.innerWidth || document.documentElement.clientWidth) &&
      bounding.x < 0
    ) {
      setIsTooNarrow(true);
      setTransformX(0);
    }

    if (bounding.x < 0 && !isTooNarrow) {
      setTransformX(Math.ceil(bounding.x * -1));
    }

    if (
      bounding.right >
        (window.innerWidth || document.documentElement.clientWidth) &&
      !isTooNarrow
    ) {
      setTransformX(
        (bounding.right + BUTTON_SIZE / 2 - window.innerWidth ||
          document.documentElement.clientWidth) * -1
      );
    }

    // if (!isTooNarrow) setTransformX(0);
  }, [resizeEvent, boundingBoxRef, isTooNarrow]);

  useHotkey('escape', () => {
    if (isActive) setIsActive(false);
  });

  return (
    <Box
      position="relative"
      display="inline-block"
      aria-expanded={isActive}
      aria-labelledby={uniqueId}
    >
      <Circle
        onMouseOver={onMouseOverHandler}
        onMouseLeave={onMouseLeaveHandler}
        onFocus={onFocusHandler}
        onBlur={onBlurHandler}
        isActive={isActive}
        type="button"
      >
        I
      </Circle>

      <Box
        position="absolute"
        top={0}
        transform={`translateX(${transformX}px)`}
      >
        <DescriptionCloud
          aria-hidden={!isActive}
          isActive={isActive}
          ref={boundingBoxRef}
          isTooNarrow={isTooNarrow}
        >
          <Text as="span" m={0} fontWeight="normal" id={uniqueId}>
            {description}
          </Text>
        </DescriptionCloud>
      </Box>
    </Box>
  );
}

const Circle = styled.button<{ isActive: boolean }>(({ isActive }) =>
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

    '&:before': {
      position: 'absolute',
      // width: 0,
      // height: 0,
      // borderLeft: '1rem solid transparent',
      // borderRight: '1rem solid transparent',

      // borderTop: '1rem solid #fff',
      left: `calc(50% - ${ARROW_SIZE / 2}px)`,
      top: -24,
      height: ARROW_SIZE,
      width: ARROW_SIZE,
      content: '""',
      backgroundColor: '#fff',
      transform: 'rotate(45deg)',
      zIndex: 0,
      boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.1)',
      opacity: isActive ? 1 : 1,
      // clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0% 100%)',
    },

    '&:focus': {
      outline: '2px dotted black',
    },

    // Fancy way of enabling the tooltip when
    // there is no interaction possible with Javascript
    // '&:hover, &:focus': {
    //   '.has-no-js &': {
    //     '+ div': {
    //       opacity: 1,
    //       pointerEvents: 'auto',
    //       backgroundColor: 'cyan',

    //       '&:before': {
    //         backgroundColor: 'cyan',
    //       },
    //     },
    //   },
    // },
  })
);

const DescriptionCloud = styled.div<{
  isActive: boolean;
  isTooNarrow: boolean;
}>(({ isActive, isTooNarrow }) =>
  css({
    top: 0,
    width: 'max-content',
    maxWidth: isTooNarrow ? '90vw' : MAX_WIDTH,
    display: 'flex',
    position: 'absolute',
    py: 12,
    px: 10,
    backgroundColor: 'white',
    boxShadow: 'tooltip',
    borderRadius: 1,
    transform: `translate(calc(-50% + ${
      BUTTON_SIZE / 2
    }px), calc(-100% - 10px))`,
    zIndex: 99,

    opacity: isActive ? 1 : 1,
    pointerEvents: 'none',
  })
);
