import { colors } from '@corona-dashboard/common';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@reach/disclosure';
import css from '@styled-system/css';
import { useMemo, useState } from 'react';
import styled from 'styled-components';
import chevronDownUrl from '~/assets/chevron-down.svg';
import { Box } from '~/components/base';
import { space } from '~/style/theme';
import { asResponsiveArray } from '~/style/utils';
import { useIsMounted } from '~/utils/use-is-mounted';
import { useResizeObserver } from '~/utils/use-resize-observer';
import { useSetLinkTabbability } from './logic';

interface CollapsibleButtonProps {
  children: React.ReactNode;
  label: string;
  icon?: React.ReactNode;
}

export const CollapsibleButton = ({ label, children, icon }: CollapsibleButtonProps) => {
  const [contentRef, contentSize] = useResizeObserver<HTMLDivElement>();
  const [buttonRef, buttonSize] = useResizeObserver<HTMLDivElement>();

  const [isOpen, setIsOpen] = useState(false);
  const { wrapperRef } = useSetLinkTabbability(isOpen);

  const isMounted = useIsMounted({ delayMs: 10 });
  /**
   * Calculate the clip path where the content needs to animate to,
   * this is aligned with the position of the button percentage wise based of the content wrapper
   */
  const clipPathCalculation = useMemo(() => {
    if (!buttonSize.height || !contentSize.height) {
      return '0 0, 100% 0, 100% 0, 0 0';
    }

    const height = (buttonSize.height / contentSize.height) * 100 * -1;

    return `
      0% ${height}%,
      100% ${height}%,
      100% 0%,
      0% 0%
  `;
  }, [buttonSize.height, contentSize.height]);

  /**
   * fallback to `undefined` to prevent an initial animation from `0` to
   * measured height
   */
  const height = (buttonSize.height ?? 0) + (isOpen ? contentSize.height ?? 0 : 0) || undefined;

  return (
    <Container
      style={{ height }}
      isOpen={isOpen}
      buttonWidth={buttonSize.width ?? 0}
      buttonHeight={buttonSize.height ?? 0}
      contentWidth={contentSize.width ?? 0}
      contentHeight={contentSize.height ?? 0}
      clipPathCalculation={clipPathCalculation ?? 0}
      isMounted={isMounted}
    >
      <Disclosure open={isOpen} onChange={() => setIsOpen(!isOpen)}>
        <ButtonContainer>
          <Box position="absolute" top="50%" left="0" height="1px" width="100%" transform="translate(0, -50%)" backgroundColor={colors.gray3} />
          <Box ref={buttonRef} backgroundColor={colors.white} zIndex={1}>
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
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginX: 'auto',
    zIndex: 0,
  })
);

const Container = styled(Box).attrs({ as: 'section' })<{
  isOpen: boolean;
  buttonWidth: number;
  contentWidth: number;
  contentHeight: number;
  buttonHeight: number;
  clipPathCalculation: string;
  isMounted: boolean;
}>((x) =>
  css({
    position: 'relative',
    padding: '0',
    transitionProperty: 'height',
    transitionDuration: '0.4s',
    willChange: 'height',

    // Button
    '[data-reach-disclosure-button]': {
      margin: '0',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
      width: x.isOpen ? '100%' : 'fit-content',
      border: 'none',
      paddingX: asResponsiveArray({ _: space[3], sm: space[4] }),
      paddingY: space[3],
      background: 'none',
      color: 'black',
      font: 'inherit',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'color 0.2s ease-out',

      /**
       * Since we copy the width of the button for animation purposes for the `before` element
       * sometimes it occurs that the width of the button has 1 or 2 decimals.
       * Javascript rounds the value when applied to the before element so it could show a double border sometimes
       * when applying this minimum width also to the button it uses the same rounding for both elements.
       */
      minWidth: x.isOpen ? undefined : x.buttonWidth,

      '&:hover': {
        color: 'blue8',

        svg: {
          fill: 'blue8',
        },
      },

      // Outside border
      '&:before': {
        display: 'block',
        transition: 'width 0.4s',
        position: 'absolute',
        top: '0',
        width: x.isOpen ? '100%' : x.buttonWidth,
        height: '100%',
        zIndex: -1,
        content: x.isMounted ? '""' : 'unset',
        pointerEvents: 'none',
        transform: 'translateZ(0)',

        '.has-no-js &': {
          content: 'unset',
        },
      },
    },

    '[data-reach-disclosure-button]:focus': {
      outlineWidth: '1px',
      outlineStyle: 'dashed',
      outlineColor: x.isOpen ? 'transparent' : 'blue8',
    },

    //panel
    '[data-reach-disclosure-panel]': {
      maxHeight: x.isMounted ? undefined : 0,
      position: 'relative',
      width: '100%',
      overflow: 'hidden',
      display: 'block',
      transition: 'clip-path 0.4s',
      pointerEvents: x.isOpen ? 'auto' : 'none',
      willChange: 'clip-path',
      clipPath: x.isOpen ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' : `polygon(${x.clipPathCalculation})`,

      '.has-no-js &': {
        maxHeight: 0,
        animation: `show-collapsible 1s forwards`,
        animationDelay: '1s',
        clipPath: 'none',
      },

      [`@keyframes show-collapsible`]: {
        from: {
          maxHeight: 0,
        },

        to: {
          maxHeight: '100%',
        },
      },
    },
  })
);

const IconContainer = styled.div(
  css({
    marginRight: space[2],
    display: 'flex',
    alignItems: 'center',

    svg: {
      transition: 'fill 0.2s ease-out',
      fill: 'black',
      width: asResponsiveArray({ _: '20px', md: undefined }),
    },
  })
);

const Chevron = styled.div<{
  open: boolean;
}>((x) =>
  css({
    marginLeft: space[2],
    backgroundImage: `url('${chevronDownUrl}')`,
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
