import { Box } from '~/components/base';
import { colors } from '@corona-dashboard/common';
import { mediaQueries, radii, space } from '~/style/theme';
import styled from 'styled-components';

export const CategoryDropdownRoot = styled(Box)`
  @media ${mediaQueries.xl} {
    margin: 0;
  }
  position: relative;
  box-shadow: ${space[1]} 0 0 ${space[4]} ${colors.white};
  margin: 0 ${space[2]};
`;

export const CategoryDropdown = styled(Box)`
  @media ${mediaQueries.xl} {  
    padding: ${space[2]} ${space[3]} ${space[2]} ${space[2]};
    margin: 0;
  }
  &:hover {
    cursor: pointer;
    border-color: ${colors.blue8};
    color: ${colors.blue8};
  },
  &:focus {
    background: ${colors.white};
    color: ${colors.black};
  }
  &:hover, &:focus {
      background: ${colors.gray1};
  },
  cursor: default;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: ${space[2]};
  padding: ${space[2]} ${space[1]} ${space[2]} ${space[1]};
  border-color: ${colors.gray3};
  border-style: solid;
  border-width: 1px;
  border-radius: ${radii[1]}px;
  user-select: none;
  transition: 0.1s background-color;
  &[aria-expanded=true] {
    background: ${colors.white};
    color: ${colors.black};
    border-radius: ${radii[1]}px ${radii[1]}px 0 0;
    border-color: ${colors.blue8};
    border-bottom-color: ${colors.white};
    &:hover, &:focus {
      border-bottom-color: ${colors.white};
    },
  }
`;

export const CategorySelectBox = styled(Box)`
  cursor: pointer;
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
    border-radius: 0 0 ${radii[1]}px ${radii[1]}px;
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
