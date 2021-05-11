import { useState } from 'react';
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
    <Container style={{ height }} isOpen={isOpen} buttonWidth={buttonWidth}>
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
    transitionProperty: 'height',
    transitionDuration: '0.5s',

    //button
    '[data-reach-disclosure-button]': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
      width: x.isOpen ? '100%' : 'fit-content',
      border: '1px solid',
      borderRadius: 1,
      borderColor: x.isOpen ? 'rgba(0, 0, 0, 0)' : 'lightGray',
      px: asResponsiveArray({ _: 1, sm: 3 }),
      py: 3,
      background: 'none',
      color: 'black',
      font: 'inherit',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'color 0.2s ease-out, border-color 0.2s ease-out',

      '&:hover': {
        color: 'blue',
        borderColor: x.isOpen ? 'rgba(0, 0, 0, 0)' : 'data.primary',

        svg: {
          fill: 'blue',
        },
      },

      '&:before': {
        transition: 'transform 0.3s ease-in, width 0.5s',
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

    //panel
    '[data-reach-disclosure-panel]': {
      position: 'relative',
      width: '100%',
      overflow: 'hidden',
      display: 'block',
      transition: 'opacity 1.0s',
      opacity: x.isOpen ? 1 : 0,

      '&:before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: x.isOpen ? '5%' : '0%',
        width: x.isOpen ? '90%' : '0%',
        height: '1px',
        backgroundColor: 'lightGray',
        transform: x.isOpen ? 'scaleX(1)' : 'scale(0)',
        transition: 'transform 0.5s',
      },
    },

    '[data-reach-disclosure-panel][data-state="collapsed"]': {
      height: 0,
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
