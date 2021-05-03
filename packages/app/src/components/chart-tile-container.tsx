import { Spacer } from './base';
import { Tile } from '~/components/tile';
import { Metadata, MetadataProps } from './metadata';
import { useState } from 'react';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { FullscreenButton, Modal } from './modal';

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

      {breakpoints.md && (isFullscreen || isButtonVisible) && (
        <FullscreenButton onClick={() => setIsFullscreen((x) => !x)} />
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
