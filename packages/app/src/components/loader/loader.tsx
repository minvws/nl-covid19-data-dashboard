import React from 'react';
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

  return (
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
  );
}
