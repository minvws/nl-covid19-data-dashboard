import useFocusTrap from '@charlietango/use-focus-trap';
import css from '@styled-system/css';
import { ReactNode, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { space } from '~/style/theme';
import { useHotkey } from '~/utils/hotkey/use-hotkey';
import { useUniqueId } from '~/utils/use-unique-id';

interface ModalProps {
  children: ReactNode;
  id: string;
  onClose: () => void;
  isFullheight?: boolean;
}

export function Modal({ id, children, onClose, isFullheight }: ModalProps) {
  const clickRef = useRef<HTMLDivElement>(null);
  const focusId = useUniqueId();
  useHotkey('esc', onClose);
  const focusRef = useFocusTrap(true, {
    focusSelector: `#${focusId}`,
  });

  return (
    <ModalPortal id={id}>
      <DisablePageScroll />
      <StyledFullscreenModal ref={focusRef}>
        <div
          css={css({ padding: space[5], height: isFullheight ? '100%' : undefined })}
          onClick={(evt) => evt.target === clickRef.current && onClose()}
          ref={clickRef}
          id={focusId}
        >
          {children}
        </div>
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
    zIndex: 600,
    touchAction: 'initial',

    boxSizing: 'border-box',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'rgba(0, 0, 0, 0.6)',
    width: '100%',
    height: '100%',
    display: 'grid',
    alignItems: 'center',
    overflowY: 'auto',
  })
);
