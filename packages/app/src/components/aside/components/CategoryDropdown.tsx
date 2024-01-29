import css from '@styled-system/css';
import { Box } from '~/components/base';
import styled from 'styled-components';
import { colors } from '@corona-dashboard/common';
import { space } from '~/style/theme';

export const CategoryDropdownRoot = styled(Box)(
  css({
    position: 'relative',
  })
);

export const CategoryDropdown = styled(Box)(
  css({
    cursor: 'default',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '36px',
    paddingX: space[3],
    paddingY: space[2],
    borderColor: colors.gray3,
    borderStyle: 'solid',
    borderWidth: '1px',
    borderRadius: (theme) => theme.radii[1],
    userSelect: 'none',
    transition: '0.1s background-color',
    '&[aria-expanded="true"]': {
      bg: colors.white,
      color: colors.black,
      borderRadius: '5px 5px 0 0',
      borderColor: colors.blue8,
      borderBottomColor: colors.white,
      '&:hover, &:focus': {
        borderBottomColor: colors.white,
      },
    },
    '&:hover, &:focus': {
      bg: colors.gray1,
    },
    '&:hover': {
      color: colors.blue8,
      borderColor: colors.blue8,
    },
    '&:focus': {
      bg: colors.white,
      color: colors.black,
    },
  })
);

export const CategorySelectBox = styled(Box)(
  css({
    cursor: 'default',
    display: 'flex',
    alignItems: 'center',
  })
);

export const CategoryListBox = styled(Box)(
  css({
    bg: 'white',
    width: '100%',
    overflowY: 'clip',
    borderColor: colors.blue8,
    borderStyle: 'solid',
    borderWidth: '1px',
    borderTopWidth: 0,
    display: 'none',
    [`${CategoryDropdown}[aria-expanded="true"] + &`]: {
      display: 'block',
      borderRadius: '0 0 5px 5px',
    },
  })
);

export const CategoryListBoxOption = styled(Box)(
  css({
    cursor: 'default',
  })
);
