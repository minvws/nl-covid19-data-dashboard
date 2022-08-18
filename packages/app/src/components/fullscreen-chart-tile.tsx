import { Close, Expand } from '@corona-dashboard/icons';
import css from '@styled-system/css';
import { useEffect, useRef, useState } from 'react';
import { Tile } from '~/components/tile';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { usePrevious } from '~/utils/use-previous';
import { Spacer } from './base';
import { Box } from './base/box';
import { IconButton } from './icon-button';
import { Metadata, MetadataProps } from './metadata';
import { Modal } from './modal';

export function FullscreenChartTile({
  children,
  metadata,
  disabled,
}: {
  children: React.ReactNode;
  metadata?: MetadataProps;
  disabled?: boolean;
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const wasFullscreen = usePrevious(isFullscreen);
  const breakpoints = useBreakpoints();
  const { commonTexts } = useIntl();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (wasFullscreen && !isFullscreen) {
      buttonRef.current?.focus();
    }
  }, [wasFullscreen, isFullscreen]);

  const label = replaceVariablesInText(
    isFullscreen
      ? commonTexts.common.modal_close
      : commonTexts.common.modal_open,
    { subject: commonTexts.common.grafiek_singular }
  );

  const tile = (
    <Tile noBorder={isFullscreen} height="100%">
      <Box
        px={isFullscreen ? { _: 3, sm: 4 } : undefined}
        py={isFullscreen ? { _: 2, sm: 3 } : undefined}
        height="100%"
        display="flex"
        flexDirection="column"
      >
        {children}

        {metadata && (
          <>
            <Spacer m="auto" />
            <Metadata {...metadata} isTileFooter />
          </>
        )}

        {!disabled && breakpoints.md && (
          <div
            css={css({
              position: 'absolute',
              top: '1.85rem',
              right: isFullscreen ? '10px' : '-10px',
              color: 'silver',

              '&:focus': {
                outlineWidth: '1px',
                outlineStyle: 'dashed',
                outlineColor: 'blue',
              },

              '&:hover': { color: 'gray' },
            })}
          >
            <IconButton
              ref={isFullscreen ? undefined : buttonRef}
              title={label}
              onClick={() => setIsFullscreen((x) => !x)}
              size={16}
            >
              {isFullscreen ? <Close /> : <Expand />}
            </IconButton>
          </div>
        )}
      </Box>
    </Tile>
  );

  return (
    <>
      <div>{tile}</div>

      {!disabled && breakpoints.md && isFullscreen && (
        <Modal
          id="chart-tile-container"
          onClose={() => setIsFullscreen(false)}
          isFullheight
        >
          {tile}
        </Modal>
      )}
    </>
  );
}
