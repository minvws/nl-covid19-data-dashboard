import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';

export const SelectBoxRoot = styled(Box)({
  maxWidth: '20rem',
  position: 'relative',
});

export const SelectBox = styled(Box)(
  css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: 'border',
    borderStyle: 'solid',
    borderWidth: 1,
    p: 3,
    '&[aria-expanded="true"]': {
      boxShadow: 'tile',
    },
  })
);

export const ListBox = styled(Box)(
  css({
    backgroundColor: 'white',
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    overflowY: 'auto',
    maxHeight: '20rem',
    borderColor: 'border',
    borderStyle: 'solid',
    borderWidth: 1,
    display: 'none',
    zIndex: 1,
    [`${SelectBox}[aria-expanded="true"] + &`]: {
      display: 'block',
    },
  })
);

export const ListBoxOption = styled(Box)(
  css({
    cursor: 'default',
    px: 3,
    py: 2,
    '&[aria-selected="true"]': {
      backgroundColor: 'lightBlue',
    },
    '&:hover': {
      backgroundColor: 'lightGray',
    },
  })
);
