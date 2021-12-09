import { colors } from '@corona-dashboard/common';
import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { asResponsiveArray } from '~/style/utils';
interface LoaderProps {
  showLoader: boolean;
}

const DURATION = 0.7;
const DELAY_TIMING = [0, 0.3, 0.5, 0.2, 0.4];

export function Loader({ showLoader }: LoaderProps) {
  const { siteText } = useIntl();

  if (!showLoader) return null;

  return (
    <LoaderOverlay>
      <LoaderWrapper>
        {DELAY_TIMING.map((timing, i) => (
          <LoaderBar key={i} delay={`-${timing}s`} />
        ))}
      </LoaderWrapper>
      <Text variant="loaderText" role="status" aria-live="polite">
        {siteText.common.loading_text}
      </Text>
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

const LoaderOverlay = styled(Box).attrs({ spacing: 2 })(
  css({
    position: 'absolute',
    top: '0',
    left: '0',
    zIndex: 999,
    bg: 'white',
    // This is the full height of the menu bar, so we don't need to calculate stuff
    height: asResponsiveArray({
      _: 'calc(100vh - 200px)',
      sm: 'calc(100vh - 257px)',
      md: 'calc(100vh - 220px)',
    }),
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  })
);

const LoaderWrapper = styled(Box).attrs({ spacingHorizontal: 1 })(
  css({
    display: 'flex',
    alignItems: 'end',
  })
);
