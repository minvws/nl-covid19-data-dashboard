import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';

export const SelectBoxRoot = styled(Box)({
  position: 'relative',
});

export const SelectBox = styled(Box)(
  css({
    cursor: 'default',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: 'silver',
    borderStyle: 'solid',
    borderRadius: theme => theme.radii[1],
    height: '36px',
    borderWidth: 1,
    transition: '0.1s background-color',
    userSelect: 'none',
    py: 2,
    px: 3,
    '&[aria-expanded="true"]': {
      bg: 'white',
      color: 'body',
      borderRadius: '5px 5px 0 0',
      borderColor: 'blue',
      '&:after': {
        content: 'attr(data-color)',
        position: 'absolute',
        left: '1px',
        right: '1px',
        bottom: 0,
        borderBottom: '1px solid',
        borderColor: 'silver'
      }
    },
    '&:hover, &:focus': {
      bg: 'tileGray',
    },
    '&:hover': {
      color: 'blue',
      borderColor: 'blue'
    },
    '&:focus': {
      bg: 'white',
      color: 'body',
    }
  })
);

export const ListBox = styled(Box)(
  css({
    bg: 'white',
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    overflowY: 'auto',
    maxHeight: '20rem',
    borderColor: 'blue',
    borderStyle: 'solid',
    borderWidth: 1,
    borderTopWidth: 0,
    display: 'none',
    zIndex: 1,
    [`${SelectBox}[aria-expanded="true"] + &`]: {
      display: 'block',
      borderRadius: '0 0 5px 5px',
      borderTopColor: 'silver'
    },
  })
);

export const ListBoxOption = styled(Box)(
  css({
    cursor: 'default',
    px: 3,
    py: 2,
    position: 'relative',
    '&:before': {
      content: 'attr(data-text)',
      position: 'absolute',
      left: 0,
      top: 0,
      height: '100%',
      width: '5px',
      backgroundColor: 'blue',
      transform: 'scaleX(0)',
      transformOrigin: 'left',
      transition: '0.2s transform'
    },
    '&[aria-selected="true"]': {
      color: 'blue',
      fontWeight: 'bold',
      '&:before': {
        transform: 'scaleX(1)',
      }
    },
    '&:hover': {
      backgroundColor: 'tileGray',
    },
  })
);
