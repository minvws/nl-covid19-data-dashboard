import css from '@styled-system/css';
import { InlineText, Text } from '~/components/typography';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { useEffect, useState, useRef, useMemo } from 'react';
import { useUniqueId } from '~/utils/use-unique-id';
import { useHotkey } from '~/utils/hotkey/use-hotkey';
import { useBoundingBox } from '~/utils/use-bounding-box';
import { usePopper } from 'react-popper';

const BUTTON_SIZE = 30;
const ARROW_SIZE = 20;
const TOOLTIP_BOUNDING_SMALL_SCREEN = 10;

interface ToggletipProps {
  description: any;
}

export function Toggletip({ description }: ToggletipProps) {
  const [showPopper, setShowPopper] = useState(false);
  const buttonRef = useRef(null);
  const popperRef = useRef(null);

  // the ref for the arrow must be a callback ref
  const [arrowRef, setArrowRef] = useState(null);

  const { styles, attributes } = usePopper(
    buttonRef.current,
    popperRef.current,
    {
      modifiers: [
        {
          name: 'arrow',
          options: {
            element: arrowRef,
          },
        },
        {
          name: 'offset',
          options: {
            offset: [0, 10],
          },
        },
      ],
    }
  );

  const uniqueId = useUniqueId();
  const [isActive, setIsActive] = useState(false);
  const [isTooNarrow, setIsTooNarrow] = useState(false);
  // const descriptionRef = useRef<HTMLElement>(null);
  const [boundingBox, boundingBoxRef] = useBoundingBox<HTMLDivElement>();

  // HIER MOET NOG MEE GEDAAN WORDEN MET DE FOCUS
  const onMouseOverHandler = () => setIsActive(true);
  const onMouseLeaveHandler = () => setIsActive(false);
  const onFocusHandler = () => setIsActive(true);
  const onBlurHandler = () => setIsActive(false);

  // const transformBox = useMemo(() => {
  //   if (!boundingBox) return;

  //   if (boundingBox.width > window.innerWidth) {
  //     setIsTooNarrow(true);
  //     return `translateX(0px)`;
  //   }

  //   setIsTooNarrow(false);

  //   if (boundingBox.x < 0) {
  //     return `translateX(${Math.ceil(
  //       boundingBox.x * -1 + TOOLTIP_BOUNDING_SMALL_SCREEN
  //     )}px)`;
  //   }

  //   if (
  //     boundingBox.right + BUTTON_SIZE / 2 >
  //     (window.innerWidth || document.documentElement.clientWidth)
  //   ) {
  //     return `translateX(${
  //       (boundingBox.right + BUTTON_SIZE / 2 - window.innerWidth ||
  //         document.documentElement.clientWidth) *
  //         -1 -
  //       TOOLTIP_BOUNDING_SMALL_SCREEN
  //     }px)`;
  //   }

  //   return `translateX(0px)`;
  // }, [boundingBox]);

  // useHotkey('escape', () => {
  //   if (isActive) setIsActive(false);
  // });

  return (
    <Box
      position="relative"
      display="inline-block"
      aria-expanded={isActive}
      aria-labelledby={uniqueId}
    >
      <div ref={buttonRef}>
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
      </div>
      <div ref={setArrowRef} style={styles.arrow} id="arrow" />
      <div ref={popperRef} style={styles.popper} {...attributes.popper}>
        <Box position="absolute" top={0}>
          <DescriptionCloud
            aria-hidden={!isActive}
            isActive={isActive}
            ref={boundingBoxRef}
          >
            <Text as="span" m={0} fontWeight="normal" id={uniqueId}>
              {description}
            </Text>
          </DescriptionCloud>
        </Box>
      </div>
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
      left: `calc(50% - ${ARROW_SIZE / 2}px)`,
      top: `-25px`,
      height: ARROW_SIZE,
      width: ARROW_SIZE,
      content: '""',
      backgroundColor: 'red',
      transform: 'rotate(45deg)',
      opacity: isActive ? 1 : 1,
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
}>(({ isActive }) =>
  css({
    top: 0,
    width: 'max-content',
    maxWidth: 260,
    display: 'flex',
    position: 'absolute',
    p: 2,
    backgroundColor: 'red',
    borderRadius: 1,
    // transform: `translate(calc(-50% + ${
    //   BUTTON_SIZE / 2
    // }px), calc(-100% - 10px))`,
    zIndex: 99,

    opacity: isActive ? 1 : 1,
    pointerEvents: 'none',
  })
);
