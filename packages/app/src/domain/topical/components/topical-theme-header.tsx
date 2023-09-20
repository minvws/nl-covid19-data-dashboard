import { IconName as TopicalIcon } from '@corona-dashboard/icons/src/icon-name2filename';
import styled from 'styled-components';
import { Box } from '~/components/base';
import DynamicIcon from '~/components/get-icon-by-name';
import { Heading } from '~/components/typography';
import theme from '~/style/theme';

interface TopicalThemeHeaderProps {
  title: string;
  icon: TopicalIcon;
}

export const TopicalThemeHeader = ({ title, icon }: TopicalThemeHeaderProps) => {
  return (
    <Box display="flex" alignItems="center">
      <StyledTopicalThemeHeaderIcon>
        <DynamicIcon name={icon} aria-hidden="true" />
      </StyledTopicalThemeHeaderIcon>

      <Heading level={2}>{title}</Heading>
    </Box>
  );
};

const StyledTopicalThemeHeaderIcon = styled.span`
  display: block;
  height: 25px;
  margin-right: 10px;
  min-width: 25px;

  @media ${theme.mediaQueries.sm} {
    height: 30px;
    margin-right: 15px;
    width: 30px;
  }
`;
