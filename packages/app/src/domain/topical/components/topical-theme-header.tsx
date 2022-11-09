import { Box } from '~/components/base';
import styled from 'styled-components';
import { Heading } from '~/components/typography';
import { RichContent } from '~/components/cms/rich-content';
import { TopicalIcon } from '@corona-dashboard/common/src/types';
import DynamicIcon from '~/components/get-icon-by-name';
import theme from '~/style/theme';
import { PortableTextEntry } from '@sanity/block-content-to-react';
import { Markdown } from '~/components';
import { fontSizes } from '~/style/theme';

interface TopicalThemeHeaderProps {
  title: string;
  subtitle?: PortableTextEntry[] | null;
  subtitleThermometer?: string | null;
  icon: TopicalIcon;
}

export const TopicalThemeHeader = ({ title, subtitle, subtitleThermometer, icon }: TopicalThemeHeaderProps) => {
  return (
    <Box spacing={3}>
      <Box display="flex" justifyContent="start" alignItems="center">
        {icon && (
          <TopicalThemeHeaderIcon>
            <DynamicIcon name={icon} aria-hidden="true" />
          </TopicalThemeHeaderIcon>
        )}
        <Heading level={2}>{title}</Heading>
      </Box>
      {subtitle && (
        <Box fontSize={fontSizes[3]}>
          <RichContent blocks={subtitle} />
        </Box>
      )}
      {subtitleThermometer && (
        <Box fontSize={3}>
          <Markdown content={subtitleThermometer} />
        </Box>
      )}
    </Box>
  );
};

const TopicalThemeHeaderIcon = styled.span`
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
