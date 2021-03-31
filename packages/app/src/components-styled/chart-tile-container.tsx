import useFocusTrap from '@charlietango/use-focus-trap';
import ReactDOM from 'react-dom';
import { Spacer } from './base';
import { Tile } from '~/components-styled/tile';
import { Metadata, MetadataProps } from './metadata';
import { ReactNode, useEffect, useRef, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import css from '@styled-system/css';
import { useHotkey } from '~/utils/hotkey/use-hotkey';
import { useOnClickOutside } from '~/utils/use-on-click-outside';
import { useBreakpoints } from '~/utils/useBreakpoints';

export function ChartTileContainer({
  children,
  metadata,
}: {
  children: React.ReactNode;
  metadata?: MetadataProps;
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const breakpoints = useBreakpoints();

  const tile = (
    <Tile>
      {breakpoints.md && (
        <FullscreenButton onClick={() => setIsFullscreen((x) => !x)} />
      )}

      {children}

      {metadata && (
        <>
          <Spacer m="auto" />
          <Metadata {...metadata} isTileFooter />
        </>
      )}
    </Tile>
  );

  return (
    <>
      {tile}
      {isFullscreen && (
        <FullscreenModal
          id="chart-tile-container"
          onClose={() => setIsFullscreen(false)}
        >
          {tile}
        </FullscreenModal>
      )}
    </>
  );
}

function FullscreenButton({ onClick }: { onClick: () => void }) {
  return (
    <StyledFullscreenButton onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 22 22">
        <g fill="currentcolor">
          <path
            d="M28.36 19.595c0-.868-.665-1.57-1.491-1.57-.819.002-1.492.702-1.492 1.57v3.25l-6.02-6.02a1.487 1.487 0 00-2.106 0 1.492 1.492 0 000 2.109l5.989 5.987h-3.235c-.881.002-1.591.669-1.591 1.491 0 .824.71 1.49 1.591 1.49h6.761c.881 0 1.59-.665 1.593-1.49l-.009-.061c.003-.028.009-.058.009-.087v-6.668M9 16.824l-6.01 6.02v-3.25c0-.868-.672-1.568-1.493-1.57-.824 0-1.49.702-1.49 1.57l-.002 6.669c0 .029.008.059.001.087-.002.021-.006.038-.008.061.002.825.712 1.49 1.592 1.49h6.762c.879 0 1.59-.666 1.59-1.49 0-.822-.711-1.489-1.59-1.491H5.117l5.989-5.987c.58-.582.58-1.527 0-2.109a1.49 1.49 0 00-2.11 0M19.359 11.535l6.02-6.02v3.25c0 .865.673 1.565 1.492 1.568.826 0 1.491-.703 1.491-1.568V2.094c0-.029-.006-.059-.009-.085l.009-.062C28.359 1.121 27.65.456 26.77.456h-6.761c-.881 0-1.591.665-1.591 1.491 0 .821.71 1.49 1.591 1.492h3.235l-5.989 5.987a1.487 1.487 0 000 2.105 1.481 1.481 0 002.106 0M5.121 3.442h3.234c.879-.002 1.59-.671 1.59-1.492 0-.826-.711-1.491-1.59-1.491H1.594c-.88 0-1.59.665-1.592 1.491l.008.062c-.002.026-.001.055-.001.085l.002 6.672c0 .865.666 1.568 1.49 1.568.821-.003 1.493-.703 1.493-1.568v-3.25l6.01 6.02a1.49 1.49 0 002.11-2.105L5.125 3.446"
            transform="translate(2.73 2.728) scale(.58303)"
          ></path>
        </g>
      </svg>
    </StyledFullscreenButton>
  );
}

const StyledFullscreenButton = styled.div(
  css({
    p: 0,
    m: 0,
    bg: 'transparent',
    border: 'none',
    display: 'inline-block',
    position: 'absolute',
    top: '10px',
    right: '10px',
    cursor: 'pointer',
    color: 'silver',
    '&:hover': {
      color: 'grey',
    },
  })
);

function FullscreenModal({
  id,
  children,
  onClose,
}: {
  children: ReactNode;
  id: string;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useHotkey('esc', onClose);
  useOnClickOutside([ref], onClose);
  const focusRef = useFocusTrap();

  return (
    <Modal id={id}>
      <DisablePageScroll />
      <Backdrop onClick={onClose} />
      <StyledFullscreenModal ref={focusRef}>
        <div ref={ref}>{children}</div>
      </StyledFullscreenModal>
    </Modal>
  );
}

const DisablePageScroll = createGlobalStyle`
  body {
    height: 100vh;
    overflow-y: hidden;
  }
  html, body{
    touch-action: none;
  }
`;

const Backdrop = styled.div(
  css({
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: 'rgba(0, 0, 0, 0.2)',
    zIndex: 99999,
  })
);

const StyledFullscreenModal = styled.div(
  css({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 99999,
    overflow: 'scroll',
    px: '2vw',
    py: '2vh',
    touchAction: 'initial',
  })
);

function Modal({ id, children }: { id: string; children: ReactNode }) {
  const [container, setContainer] = useState<HTMLDivElement>();
  useEffect(() => {
    const modalContainer = getOrCreateModalRoot(id);
    document.body.appendChild(modalContainer);
    setContainer(modalContainer);
    return () => {
      document.body.removeChild(modalContainer);
    };
  }, [id]);

  return container ? ReactDOM.createPortal(children, container) : null;
}

function getOrCreateModalRoot(id: string) {
  let el: HTMLDivElement | null = document.querySelector(`#${id}`);

  if (!el) {
    el = document.createElement('div');
    el.setAttribute('id', id);
    document.body.appendChild(el);
  }

  return el;
}
