import useFocusTrap from '@charlietango/use-focus-trap';
import css from '@styled-system/css';
import { ReactNode, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { useHotkey } from '~/utils/hotkey/use-hotkey';
import { useOnClickOutside } from '~/utils/use-on-click-outside';

export function Modal({
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
    <ModalPortal id={id}>
      <DisablePageScroll />
      <StyledFullscreenModal ref={focusRef}>
        <div ref={ref}>{children}</div>
      </StyledFullscreenModal>
    </ModalPortal>
  );
}

function ModalPortal({ id, children }: { id: string; children: ReactNode }) {
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

const DisablePageScroll = createGlobalStyle`
  body {
    height: 100vh;
    overflow-y: hidden;
  }
  html, body {
    touch-action: none;
  }
`;

const StyledFullscreenModal = styled.div(
  css({
    zIndex: 'modal',
    touchAction: 'initial',

    boxSizing: 'border-box',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'rgba(0, 0, 0, 0.2)',
    width: '100%',
    height: '100%',
    display: 'grid',
    alignItems: 'center',
    overflowY: 'auto',
    px: '2vw',
    py: '2vh',
  })
);
