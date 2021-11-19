import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';

export const SelectBoxRoot = styled(Box)({
  position: 'relative',
});

export const SelectBox = styled(Box)(
  css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: 'silver',
    borderStyle: 'solid',
    borderRadius: theme => theme.radii[1],
    height: '36px',
    borderWidth: 1,
    transition: '0.1s background-color',
    p: 2,
    '&[aria-expanded="true"]': {
      bg: 'white',
      color: 'body',
      boxShadow: 'tile',
      borderRadius: '5px 5px 0 0',
      borderBottomWidth: 0
    },
    '&:hover, &:focus': {
      bg: 'tileGray',
      borderColor: 'blue'
    },
    '&:hover': {
      color: 'blue',
    },
    '&:focus': {
      color: 'body'
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
    display: 'none',
    zIndex: 1,
    [`${SelectBox}[aria-expanded="true"] + &`]: {
      display: 'block',
      borderTopColor: 'silver',
      borderRadius: '0 0 5px 5px'
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
      fontWeight: '700'
    },
    '&:hover': {
      backgroundColor: 'tileGray',
      '&:before': {
        transform: 'scaleX(1)',
      }
    },
  })
);
