import { Box } from '~/components/base';
import styled from 'styled-components';
import { Heading } from '~/components/typography';
import { Markdown } from '~/components/markdown';
import { TopicalIcon } from '@corona-dashboard/common/src/types';
import DynamicIcon from '~/components/get-icon-by-name';
import theme from '~/style/theme';

interface TopicalHeaderProps {
  title: string;
  dynamicSubtitle: string;
  icon: TopicalIcon;
}

export const ThemeHeader = ({
  title,
  dynamicSubtitle,
  icon,
}: TopicalHeaderProps) => {
  return (
    <Box spacing={3}>
      <Box display="flex" justifyContent="start" alignItems="center">
        {icon && (
          <ThemeHeaderIcon>
            <DynamicIcon name={icon} />
          </ThemeHeaderIcon>
        )}
        <Heading level={2}>{title}</Heading>
      </Box>

      <Markdown content={dynamicSubtitle} />
    </Box>
  );
};

const ThemeHeaderIcon = styled.span`
  display: block;
  height: 25px;
  margin-right: 10px;
  width: 25px;

  @media ${theme.mediaQueries.sm} {
    height: 30px;
    margin-right: 15px;
    width: 30px;
  }
`;
