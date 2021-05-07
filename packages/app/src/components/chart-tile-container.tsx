import CloseIcon from '~/assets/close-thin.svg';
import ExpandIcon from '~/assets/expand.svg';
import { Spacer } from './base';
import { Tile } from '~/components/tile';
import { Metadata, MetadataProps } from './metadata';
import { useState } from 'react';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { Modal } from './modal';
import css from '@styled-system/css';
import { IconButton } from './icon-button';

export function ChartTileContainer({
  children,
  metadata,
}: {
  children: React.ReactNode;
  metadata?: MetadataProps;
}) {
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const breakpoints = useBreakpoints();

  const tile = (
    <Tile height="100%">
      {children}

      {metadata && (
        <>
          <Spacer m="auto" />
          <Metadata {...metadata} isTileFooter />
        </>
      )}

      {breakpoints.md && (isButtonVisible || isFullscreen) && (
        <div
          css={css({
            position: 'absolute',
            top: '10px',
            right: '10px',
            color: 'silver',
            '&:hover': { color: 'gray' },
          })}
        >
          <IconButton onClick={() => setIsFullscreen((x) => !x)} size={36}>
            {isFullscreen ? <CloseIcon /> : <ExpandIcon />}
          </IconButton>
        </div>
      )}
    </Tile>
  );

  return (
    <>
      <div
        onPointerEnter={() => setIsButtonVisible(true)}
        onPointerLeave={() => setIsButtonVisible(false)}
      >
        {tile}
      </div>

      {breakpoints.md && isFullscreen && (
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
