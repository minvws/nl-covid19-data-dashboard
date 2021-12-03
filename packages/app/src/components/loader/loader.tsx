import React, { useState } from 'react';
import { colors } from '@corona-dashboard/common';
import { Box, MotionBox } from '~/components/base';
import { Text } from '~/components/typography';

type MotionBoxProps = { 
  height: string,
  width: string,
  bg: string,
  transformOrigin: string,
  animate: object,
};

type TransitionProps = { 
  duration: number,
  repeat: number,
  ease: string,
};

type WrapperProps = {
  top: string,
  right: string,
  bottom: string,
  left: string,
}

type ToTopOverlay = {
  zIndex: number,
  bg: string,
}

type InView = {
  display: string,
  alignItems: string,
  justifyContent: string,
  height: string,
}

export function Loader() {
  const duration = 1.5;

  const attributes:MotionBoxProps = {
    height: '3rem',
    width: '0.75rem',
    bg: colors.data.scale.blue[0],
    transformOrigin: 'bottom center',
    animate: { scaleY: [1, .2, .7, .4, 1] },
  }

  const transitionProps:TransitionProps = {
    duration: duration,
    repeat: Infinity,
    ease: "easeInOut"
  }

  const loadingText = "Loading";

  const [inViewHeight, setinViewHeight] = useState('0');

  const wrapperProps:WrapperProps = {
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
  }

  const toTopOverlay:ToTopOverlay = {
    zIndex: 1,
    bg: colors.white,
  }

  const inView:InView = {
    display: 'flex',
    alignItems: "center",
    justifyContent: "center",
    height: inViewHeight,
  }

  return (
    <Box {...wrapperProps} {...toTopOverlay} position="absolute"
      ref={el => {
        if (!el) return;

        const windowHeight = window.innerHeight;
        const rect = el.getBoundingClientRect();
        const elTop = (rect.top < 0 ? 0 : rect.top);
        const elBottom = rect.bottom > windowHeight ? windowHeight : rect.bottom;

        const heightOfInView = elBottom - elTop + 'px';

        setinViewHeight(heightOfInView);
      }}
    >
      <Box {...wrapperProps} {...inView} position="absolute">
        <Box spacing={3} m={3} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <Box spacingHorizontal={1} display={'flex'} alignItems="end">
            <MotionBox {...attributes} transition={{...transitionProps}} />
            <MotionBox {...attributes} transition={{...transitionProps, delay: .3 }} />
            <MotionBox {...attributes} transition={{...transitionProps, delay: .5 }} />
            <MotionBox {...attributes} transition={{...transitionProps, delay: .2 }} />
            <MotionBox {...attributes} transition={{...transitionProps, delay: .4 }} />
          </Box>
          <Text aria-label={loadingText} lineHeight="1.0">{loadingText}</Text>
        </Box>
      </Box>
    </Box>
  );
}
