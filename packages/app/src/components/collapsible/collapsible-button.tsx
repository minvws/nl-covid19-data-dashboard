import { useEffect, useState, useRef } from 'react';
import css from '@styled-system/css';
import styled from 'styled-components';
import { asResponsiveArray } from '~/style/utils';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@reach/disclosure';
import useResizeObserver from 'use-resize-observer';
import { Box } from '~/components/base';
import { useSetLinkTabbability } from './use-set-link-tabbability';
interface CollapsibleButtonProps {
  children: React.ReactNode;
  label: string;
  icon?: React.ReactNode;
}

export const CollapsibleButton = ({
  label,
  children,
  icon,
}: CollapsibleButtonProps) => {
  const { ref: contentRef, height: contentHeight = 0 } = useResizeObserver();
  const { ref: buttonRef, height: buttonHeight = 0 } = useResizeObserver();
  const {
    ref: buttonContainerRef,
    width: buttonWidth = 0,
  } = useResizeObserver();

  const [isOpen, setIsOpen] = useState(false);
  const { wrapperRef } = useSetLinkTabbability(isOpen);

  /**
   * falback to `undefined` to prevent an initial animation from `0` to
   * measured height
   */
  const height = buttonHeight + (isOpen ? contentHeight : 0) || undefined;

  return (
    <Container
      style={{ maxHeight: height }}
      isOpen={isOpen}
      buttonWidth={buttonWidth}
    >
      <Disclosure open={isOpen} onChange={() => setIsOpen(!isOpen)}>
        <ButtonContainer ref={buttonRef}>
          <div ref={buttonContainerRef} css={css({ display: 'flex' })}>
            <DisclosureButton>
              {icon && <IconContainer>{icon}</IconContainer>}
              {label}
              <Chevron open={isOpen} />
            </DisclosureButton>
          </div>
        </ButtonContainer>

        <DisclosurePanel>
          <div ref={contentRef}>
            <div ref={wrapperRef}>{children}</div>
          </div>
        </DisclosurePanel>
      </Disclosure>
    </Container>
  );
};

const ButtonContainer = styled.div(
  css({
    display: 'flex',
    justifyContent: 'center',
    mx: 'auto',
  })
);

const Container = styled(Box).attrs({ as: 'section' })<{
  isOpen: boolean;
  buttonWidth: number;
}>((x) =>
  css({
    position: 'relative',
    padding: 0,

    //button
    '[data-reach-disclosure-button]': {
      display: 'flex',
      justifyContent: 'center',
      width: x.isOpen ? '100%' : 'fit-content',
      px: asResponsiveArray({ _: 1, sm: 3 }),
      py: 3,
      background: 'none',
      font: 'inherit',
      color: 'black',
      cursor: 'pointer',
      zIndex: 1,
      alignItems: 'center',
      transition: 'color 0.2s ease-out, border-color 0.2s ease-out',
      border: '1px solid',
      borderColor: x.isOpen ? 'rgba(0, 0, 0, 0)' : 'lightGray',
      fontWeight: 'bold',
      borderRadius: 1,

      '&:hover': {
        color: 'blue',
        borderColor: x.isOpen ? 'rgba(0, 0, 0, 0)' : 'data.primary',

        svg: {
          fill: 'blue',
        },
      },

      '&:before': {
        transition: 'transform 0.3s ease-in, border-color 0.5s, width 0.5s',
        position: 'absolute',
        top: 0,
        width: x.isOpen ? '100%' : x.buttonWidth,
        height: '100%',
        border: '1px solid',
        borderColor: x.isOpen ? 'lightGray' : 'rgba(0, 0, 0, 0)',
        content: '""',
      },
    },

    '[data-reach-disclosure-button]:focus': {
      outlineWidth: '1px',
      outlineStyle: 'dashed',
      outlineColor: x.isOpen ? 'rgba(0, 0, 0, 0)' : 'blue',
    },

    '[data-reach-disclosure-button][data-state="open"]:after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      bg: 'lightGray',
      height: '1px',
    },

    //panel
    '[data-reach-disclosure-panel]': {
      position: 'relative',
      transition: 'max-height 0.5s, border-color 1.5s',
      // transitionProperty: 'max-height, opacity',
      // transitionDuration: '0.5s',
      width: '100%',
      overflow: 'hidden',
      opacity: 0,
      display: 'block',

      '&:before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: x.isOpen ? '5%' : '0%',
        width: x.isOpen ? '90%' : '0%',
        height: '1px',
        backgroundColor: 'lightGray',
        transition: 'transform 0.5s',
        transform: x.isOpen ? 'scaleX(1)' : 'scale(0)',
      },

      '> div': {
        transition: 'opacity 0.6s',
        transitionDelay: '0.4s',
        // opacity: x.isOpen ? 1 : 0,
      },
    },

    '[data-reach-disclosure-panel][data-state="open"]': {
      opacity: 1,
    },

    '[data-reach-disclosure-panel][data-state="collapsed"]': {
      maxHeight: 0,
      opacity: 0,
    },
  })
);

const IconContainer = styled.div(
  css({
    mr: 2,

    svg: {
      transition: 'fill 0.2s ease-out',
      fill: 'black',
    },
  })
);

const Chevron = styled.div<{
  open: boolean;
}>((x) =>
  css({
    ml: 2,
    backgroundImage: 'url("/images/chevron-down.svg")',
    backgroundSize: '0.9em 0.5em',
    backgroundPosition: '0 50%',
    backgroundRepeat: 'no-repeat',
    height: '0.5em',
    width: '1em',
    display: 'inline-block',
    transitionProperty: 'transform',
    transitionDuration: '0.5s',
    transform: x.open ? 'rotate(-180deg)' : '',
  })
);
