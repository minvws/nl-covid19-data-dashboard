import React, { useState } from 'react';
import { colors } from '@corona-dashboard/common';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { Box } from '~/components/base';

interface LoaderProps {
  showLoader?: boolean;
}

const DURATION = .7;
const DELAYTIMING: Array<number> = [0, 0.3, 0.5, 0.2, 0.4];

export function Loader(props: LoaderProps) {
  const { showLoader = true } = props;
  const { siteText } = useIntl();

  const [inViewHeight, setinViewHeight] = useState('0');

  return (
    <LoaderOverlay
      ref={(el) => {
        if (!el) return;

        const windowHeight = window.innerHeight;
        const rect = el.getBoundingClientRect();
        const elTop = rect.top < 0 ? 0 : rect.top;

        const heightOfInView = windowHeight - elTop + 'px';

        setinViewHeight(heightOfInView);
      }}
    > { showLoader &&
      <LoaderFullSize inViewHeight={inViewHeight}>
        <Box
          spacing={3}
          m={3}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Box spacingHorizontal={1} display={'flex'} alignItems="end">
            {DELAYTIMING.map((delayTiming, i) => (
              <LoaderBar
                key={i}
                delay={`-${delayTiming}s`}
              />
            ))}
          </Box>
          <Text variant="loaderText" role="status" aria-live="polite">{siteText.common.loading_text}</Text>
        </Box>
      </LoaderFullSize> }
    </LoaderOverlay>
  );
}

const LoaderBar = styled.div<{ delay: string }>(({ delay }) =>
  css({
    height: '3rem',
    width: '0.75rem',
    bg: colors.data.scale.blue[0],
    transformOrigin: 'bottom center',
    animation: `bounce ${DURATION}s ease-in-out ${delay} infinite alternate`,
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

const LoaderFullSize  = styled.div<{ inViewHeight: string }>(({ inViewHeight }) =>
  css({
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: inViewHeight,
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
  },
));

const LoaderOverlay = styled.div(() =>
  css({
    position: 'absolute',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
    zIndex: 999,
    bg: 'white',
  },
));