import css from '@styled-system/css';
import { motion } from 'framer-motion';
import { isBoolean } from 'lodash';
import {
  cloneElement,
  MouseEvent,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import styled from 'styled-components';
import ChevronIcon from '~/assets/chevron.svg';
import { Box, MotionBox } from '~/components/base';
import { IconButton } from '~/components/icon-button';
import { useUniqueId } from '~/utils/use-unique-id';

export function useCollapsible(
  options: { isOpen?: boolean; isOpenInitial?: boolean } = {
    isOpen: false,
    isOpenInitial: false,
  }
) {
  const id = useUniqueId();
  const [isOpen, setIsOpen] = useState(options.isOpen);

  useEffect(() => setIsOpen(options.isOpen), [options.isOpen]);

  const toggle = useCallback(
    (isOpen?: true | false | unknown) =>
      setIsOpen((x) => (isBoolean(isOpen) ? isOpen : !x)),
    []
  );

  const chevron = (
    <Box
      as="span"
      display="inline-block"
      transform="rotate(90deg)"
      css={css({ '.has-no-js &': { display: 'none' } })}
    >
      <MotionChevron animate={{ rotateY: isOpen ? 180 : 0 }} />
    </Box>
  );

  const defaultButton = (
    <IconButton title="toggle content" size={18}>
      {chevron}
    </IconButton>
  );

  const button = (x: ReactElement = defaultButton) =>
    cloneElement(x, {
      'aria-controls': id,
      'aria-expanded': isOpen ? ('true' as const) : ('false' as const),
      style: {
        ...x.props.style,
        userSelect: 'none',
      },
      onClick: (evt: MouseEvent) => {
        evt.stopPropagation();
        setIsOpen((x) => !x);

        if (x?.props?.onClick) {
          return x.props.onClick(evt);
        }
      },
    });

  const content = (children: ReactNode) => (
    <MotionBox
      id={id}
      aria-hidden={isOpen ? 'false' : 'true'}
      width="100%"
      overflow="hidden"
      animate={isOpen ? 'open' : 'rest'}
      initial={options.isOpenInitial ? 'open' : undefined}
      css={css({
        height: 0,
        opacity: 0,
        '.has-no-js &': {
          height: 'auto !important',
          maxHeight: 0,
          opacity: 0,
          animation: `show-menu 1s forwards`,
          animationDelay: '1s',
        },
        [`@keyframes show-menu`]: {
          from: {
            maxHeight: 0,
          },
          to: {
            opacity: 1,
            maxHeight: '99999px',
          },
        },
      })}
      variants={{
        rest: {
          opacity: 0,
          height: 0,
          transitionEnd: { display: 'none' },
        },
        open: {
          opacity: 1,
          height: 'auto',
          display: 'block',
        },
      }}
    >
      {children}
    </MotionBox>
  );

  return {
    button,
    content,
    chevron,
    toggle,
    isOpen,
  };
}

const MotionChevron = styled(motion(ChevronIcon))(
  css({
    backgroundSize: '1.4em 0.9em',
    backgroundPosition: '0 50%',
    backgroundRepeat: 'no-repeat',
    height: '0.9em',
    width: '1.5em',
    display: 'inline-block',
    color: 'blue',
  })
);
