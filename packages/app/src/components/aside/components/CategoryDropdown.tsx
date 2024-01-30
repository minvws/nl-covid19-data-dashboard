import { Box } from '~/components/base';
import styled from 'styled-components';
import { colors } from '@corona-dashboard/common';
import { mediaQueries, space } from '~/style/theme';

export const CategoryDropdownRoot = styled(Box)`
  @media ${mediaQueries.xl} {
    margin: 0;
  }
  position: relative;
  box-shadow: ${space[1]} 0 0 ${space[4]} ${colors.white};
  margin: 0 8px;
`;

export const CategoryDropdown = styled(Box)`
  @media ${mediaQueries.xl} {  
    padding: ${space[2]} ${space[3]} ${space[2]} ${space[2]};
    margin: 0;
  }
  cursor: default;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 36px;
  padding: ${space[2]} ${space[1]} ${space[2]} ${space[1]};
  border-color: ${colors.gray3};
  border-style: solid;
  border-width: 1px;
  border-radius: 5px;
  user-select: none;
  transition: 0.1s background-color;
  &[aria-expanded=true] {
    background: ${colors.white};
    color: ${colors.black};
    border-radius: 5px 5px 0 0;
    border-color: ${colors.blue8};
    border-bottom-color: ${colors.white};
    &:hover, &:focus {
      border-bottom-color: ${colors.white};
    },
  },
  &:hover, &:focus {
    background: ${colors.gray1};
  },
  &:hover {
    color: ${colors.blue8};
    border-color: ${colors.blue8};
  },
  &:focus {
    background: ${colors.white};
    color: ${colors.black};
  }
`;

export const CategorySelectBox = styled(Box)`
  cursor: default;
  display: flex;
  align-items: center;
`;

export const CategoryListBox = styled(Box)`
  background: white;
  width: 100%;
  overflow-y: clip;
  border-color: ${colors.blue8};
  border-style: solid;
  border-width: 1px;
  border-top-width: 0;
  display: none;
  ${CategoryDropdown}[aria-expanded=true] + & {
    display: block;
    border-radius: 0 0 5px 5px;
  }
`;

export const CategoryListBoxOption = styled(Box)`
  cursor: default;
  a {
    @media ${mediaQueries.xl} {
      padding: ${space[2]} ${space[2]} ${space[2]} 3rem;
    }
    padding: ${space[2]} 0 ${space[2]} ${space[4]};
  }
`;
