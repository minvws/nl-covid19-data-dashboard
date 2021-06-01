import css from '@styled-system/css';
import { Text } from '~/components/typography';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { useEffect, useState, useRef } from 'react';
import { useUniqueId } from '~/utils/use-unique-id';
import { useHotkey } from '~/utils/hotkey/use-hotkey';
import { useBoundingBox } from '~/utils/use-bounding-box';

const BUTTON_SIZE = 30;
const ARROW_SIZE = 20;

interface ToggletipProps {
  description: any;
}

export function Toggletip({ description }: ToggletipProps) {
  const uniqueId = useUniqueId();
  const [isActive, setIsActive] = useState(false);
  // const descriptionRef = useRef<HTMLElement>(null);
  const [boundingBox, boundingBoxRef] = useBoundingBox<HTMLDivElement>();

  // HIER MOET NOG MEE GEDAAN WORDEN MET DE FOCUS
  const expandHandler = () => setIsActive(!isActive);

  useEffect(() => {
    console.log(
      `${Math.random()}The button is with the ID: ${uniqueId} is ${isActive}`
    );
  }, [isActive]);

  useEffect(() => {
    console.log(boundingBox);
  }, [boundingBox]);

  useHotkey('escape', () => {
    if (isActive) setIsActive(false);
  });

  return (
    <Box
      position="relative"
      aria-expanded={isActive}
      aria-labelledby={uniqueId}
    >
      <Circle onMouseOver={expandHandler} onFocus={expandHandler} type="button">
        I
      </Circle>
      <Box
        position="unset"
        // left={`${boundingBox?.x < 0 ? boundingBox.x * -1 + 10 : 0}px`}
      >
        <DescriptionCloud
          aria-hidden={!isActive}
          isActive={isActive}
          ref={boundingBoxRef}
        >
          <Text m={0} id={uniqueId}>
            <span>{description}</span>
          </Text>
        </DescriptionCloud>
      </Box>
    </Box>
  );
}

const Circle = styled.button(
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

const DescriptionCloud = styled.div<{ isActive: boolean }>((x) =>
  css({
    top: 0,
    width: 'max-content',
    maxWidth: 240,
    display: 'flex',
    position: 'absolute',
    p: 2,
    backgroundColor: 'red',
    borderRadius: 1,
    transform: `translate(calc(-50% + ${
      BUTTON_SIZE / 2
    }px), calc(-100% - 10px))`,
    zIndex: 99,

    // opacity: 0,
    pointerEvents: 'none',

    // '&:before': {
    //   position: 'absolute',
    //   left: `calc(50% - ${ARROW_SIZE / 2}px)`,
    //   bottom: `-${ARROW_SIZE / 2}px`,
    //   height: ARROW_SIZE,
    //   width: ARROW_SIZE,
    //   content: '""',
    //   backgroundColor: 'red',
    //   transform: 'rotate(45deg)',
    // },
  })
);
