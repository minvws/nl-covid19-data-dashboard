import { useState } from 'react';
import { Tile } from '~/components-styled/tile';
import { useBreakpoints } from '~/utils/useBreakpoints';
import { Spacer } from '~/components-styled/base';
import { FullscreenButton } from '~/components-styled/fullscreen-button';
import { Metadata, MetadataProps } from '~/components-styled/metadata';
import { Modal } from '~/components-styled/modal';

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
    <Tile>
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
        <Modal id="chart-tile-container" onClose={() => setIsFullscreen(false)}>
          {tile}
        </Modal>
      )}
    </>
  );
}
