import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { space } from '~/style/theme';

export const SelectBoxRoot = styled(Box)(
  css({
    position: 'relative',
  })
);

export const SelectBox = styled(Box)(
  css({
    cursor: 'default',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: 'gray3',
    borderStyle: 'solid',
    borderRadius: (theme) => theme.radii[1],
    minHeight: '36px',
    borderWidth: space[1],
    transition: '0.1s background-color',
    userSelect: 'none',
    paddingY: space[2],
    paddingX: space[3],
    '&[aria-expanded="true"]': {
      bg: 'white',
      color: 'black',
      borderRadius: '5px 5px 0 0',
      borderColor: 'blue8',
      '&:after': {
        content: 'attr(data-color)',
        position: 'absolute',
        left: '1px',
        right: '1px',
        bottom: '0',
        borderBottom: '1px solid',
        borderColor: 'gray3',
      },
    },
    '&:hover, &:focus': {
      bg: 'gray1',
    },
    '&:hover': {
      color: 'blue8',
      borderColor: 'blue8',
    },
    '&:focus': {
      bg: 'white',
      color: 'black',
    },
  })
);

export const ListBox = styled(Box)(
  css({
    bg: 'white',
    position: 'absolute',
    top: '100%',
    left: '0',
    width: '100%',
    overflowY: 'auto',
    maxHeight: '20rem',
    borderColor: 'blue8',
    borderStyle: 'solid',
    borderWidth: space[1],
    borderTopWidth: '0',
    display: 'none',
    zIndex: 10,
    [`${SelectBox}[aria-expanded="true"] + &`]: {
      display: 'block',
      borderRadius: '0 0 5px 5px',
      borderTopColor: 'gray3',
    },
  })
);

export const ListBoxOption = styled(Box)(
  css({
    cursor: 'default',
    paddingX: space[3],
    paddingY: space[2],
    position: 'relative',
    '&:before': {
      content: 'attr(data-text)',
      position: 'absolute',
      left: '0',
      top: '0',
      height: '100%',
      width: '5px',
      backgroundColor: 'blue8',
      transform: 'scaleX(0)',
      transformOrigin: 'left',
      transition: '0.2s transform',
    },
    '&[aria-selected="true"]': {
      color: 'blue8',
      fontWeight: 'bold',
      '&:before': {
        transform: 'scaleX(1)',
      },
    },
    '&:hover': {
      backgroundColor: 'blue8',
      color: 'white',
      fontWeight: 'normal',
    },
  })
);
