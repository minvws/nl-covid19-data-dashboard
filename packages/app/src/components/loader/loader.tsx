import React, { useState } from 'react';
import { colors } from '@corona-dashboard/common';
import { Box } from '~/components/base';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { VisuallyHidden } from '../visually-hidden';

interface WrapperProps {
  top: string;
  right: string;
  bottom: string;
  left: string;
}

interface ToTopOverlay {
  zIndex: number;
  bg: string;
}

interface InView {
  display: string;
  alignItems: string;
  justifyContent: string;
  height: string;
}

interface LoaderProps {
  showLoader?: boolean;
}
const duration = .7;

export function Loader(props: LoaderProps) {
  const { showLoader = true } = props;
  const { siteText } = useIntl();

  const delayTiming = [0, 0.3, 0.5, 0.2, 0.4];

  const loadingText = siteText.common.loading_text;

  const [inViewHeight, setinViewHeight] = useState('0');

  const wrapperProps: WrapperProps = {
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
  };

  const toTopOverlay: ToTopOverlay = {
    zIndex: 1,
    bg: colors.white,
  };

  const inView: InView = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: inViewHeight,
  };

  return (
    <Box
      {...wrapperProps}
      {...toTopOverlay}
      position="absolute"
      ref={(el) => {
        if (!el) return;

        const windowHeight = window.innerHeight;
        const rect = el.getBoundingClientRect();
        const elTop = rect.top < 0 ? 0 : rect.top;
        const elBottom =
          rect.bottom > windowHeight ? windowHeight : rect.bottom;

        const heightOfInView = elBottom - elTop + 'px';

        setinViewHeight(heightOfInView);
      }}
    > { showLoader &&
      <Box {...wrapperProps} {...inView} position="absolute">
        <Box
          spacing={3}
          m={3}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Box spacingHorizontal={1} display={'flex'} alignItems="end">
            {delayTiming.map((delayTiming, i) => (
              <LoaderBar
                key={i}
                delay={`-${delayTiming}s`}
              />
            ))}
          </Box>
          <VisuallyHidden>{loadingText}</VisuallyHidden>
          <Text variant="loaderText" >{loadingText}</Text>
        </Box>
      </Box> }
    </Box>
  );
}

const LoaderBar = styled.div<{ delay: string }>(({ delay }) =>
  css({
    height: '3rem',
    width: '0.75rem',
    bg: colors.data.scale.blue[0],
    transformOrigin: 'bottom center',
    animation: `bounce ${duration}s ease-in-out ${delay} infinite alternate`,
    ['@keyframes bounce']: {
      '0%': {
        transform: 'scaleY(1)',
      },
      '50%': {
        transform: 'scaleY(.3)',
      },
      '100%': {
        transform: 'scaleY(.7)',
      },
    },
  })
);
