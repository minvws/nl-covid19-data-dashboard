import { Box } from '~/components/base';
import css from '@styled-system/css';
import styled from 'styled-components';
import { Heading } from '~/components/typography';
import { Markdown } from '~/components/markdown';
import { TopicalIcon } from '@corona-dashboard/common/src/types';
import DynamicIcon from '~/components/get-icon-by-name';

interface TopicalHeaderProps {
  title: string;
  dynamicSubtitle: string;
  icon: TopicalIcon;
}

export function ThemeHeader({
  title,
  dynamicSubtitle,
  icon,
}: TopicalHeaderProps) {
  return (
    <Box spacing={3}>
      <Box display="flex" justifyContent="start" alignItems="center">
        {icon !== null && (
          <ThemaIcon>
            <DynamicIcon name={icon} />
          </ThemaIcon>
        )}
        <Heading level={2}>{title}</Heading>
      </Box>
      <Markdown content={dynamicSubtitle} />
    </Box>
  );
}

const ThemaIcon = styled.span`
  display: block;
  width: 30px;
  height: 30px;
  margin-right: 10px;
`;
