import React, { useState } from 'react';
import { colors } from '@corona-dashboard/common';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { VisuallyHidden } from '../visually-hidden';
import { asResponsiveArray } from '~/style/utils';

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

  return (
    <LoaderOverlay
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
      <LoaderFullSize inViewHeight={inViewHeight}>
        <LoaderWrapper>
          <BarWrapper>
            {delayTiming.map((delayTiming, i) => (
              <LoaderBar
                key={i}
                delay={`-${delayTiming}s`}
              />
            ))}
          </BarWrapper>
          <VisuallyHidden>{loadingText}</VisuallyHidden>
          <Text variant="loaderText" >{loadingText}</Text>
        </LoaderWrapper>
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

const BarWrapper = styled.div(() =>
  css({
    display: 'flex',
    alignItems: 'start',
    '& > *:not(:last-child)': {
      marginRight: asResponsiveArray(1),
    }
    
  },
));

const LoaderWrapper = styled.div(() =>
  css({
    margin: asResponsiveArray(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    '& > *:not(:last-child)': {
      marginBottom: asResponsiveArray(3),
    },
  },
));

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
    bg: colors.white,
  },
));