import { useMemo, useState } from 'react';
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
  const {
    ref: contentRef,
    height: contentHeight = 0,
    width: contentWidth = 0,
  } = useResizeObserver();

  const {
    ref: buttonRef,
    width: buttonWidth = 0,
    height: buttonHeight = 0,
  } = useResizeObserver();

  const [isOpen, setIsOpen] = useState(false);
  const { wrapperRef } = useSetLinkTabbability(isOpen);

  /**
   * Calculate the clip path where the content needs to animate to,
   * this is alligned with the position of the button percentage wise based of the content wrapper
   */
  const clipPathCalculation = useMemo(() => {
    if (!buttonWidth || !contentWidth || !buttonHeight || !contentHeight)
      return '0 0, 100% 0, 100% 0, 0 0';

    const width = ((buttonWidth / contentWidth) * 100 - 100) / 2;
    const height = (buttonHeight / contentHeight) * 100 * -1;

    return `
      ${width * -1}% ${height}%,
      ${width - 100 * -1}% ${height}%,
      ${width - 100 * -1}% 0%,
      ${width * -1}% 0%
  `;
  }, [buttonWidth, contentWidth, buttonHeight, contentHeight]);

  /**
   * falback to `undefined` to prevent an initial animation from `0` to
   * measured height
   */
  const height = buttonHeight + (isOpen ? contentHeight : 0) || undefined;

  return (
    <Container
      style={{ height }}
      isOpen={isOpen}
      contentWidth={contentWidth}
      contentHeight={contentHeight}
      buttonHeight={buttonHeight}
      buttonWidth={buttonWidth}
      clipPathCalculation={clipPathCalculation}
    >
      <Disclosure open={isOpen} onChange={() => setIsOpen(!isOpen)}>
        <ButtonContainer>
          <Box ref={buttonRef} display="flex">
            <DisclosureButton>
              {icon && <IconContainer>{icon}</IconContainer>}
              {label}
              <Chevron open={isOpen} />
            </DisclosureButton>
          </Box>
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
  contentWidth: number;
  contentHeight: number;
  buttonHeight: number;
  clipPathCalculation: string;
}>((x) =>
  css({
    position: 'relative',
    padding: 0,
    transitionProperty: 'height',
    transitionDuration: '0.4s',
    willChange: 'height',

    // Button
    '[data-reach-disclosure-button]': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
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
      transition: 'color 0.2s ease-out',

      '&:hover': {
        color: 'blue',

        svg: {
          fill: 'blue',
        },

        '&:before': {
          borderColor: x.isOpen ? 'lightGray' : 'data.primary',
        },
      },

      // Outside border
      '&:before': {
        transition: 'width 0.4s',
        position: 'absolute',
        top: 0,
        width: x.isOpen ? '100%' : x.buttonWidth,
        height: '100%',
        border: '1px solid',
        borderRadius: 1,
        borderColor: 'lightGray',
        zIndex: -1,
        content: '""',
        pointerEvents: 'none',
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
      transition: 'clip-path 0.4s',
      willChange: 'clip-path',
      clipPath: x.isOpen
        ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
        : `polygon(${x.clipPathCalculation})`,

      '&:before': {
        content: '""',
        position: 'absolute',
        top: 0,
        width: x.isOpen ? '100%' : '0%',
        height: '1px',
        backgroundColor: 'lightGray',
        transform: x.isOpen ? 'scaleX(1)' : 'scale(0)',
        transition: 'transform 0.4s',
      },
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
