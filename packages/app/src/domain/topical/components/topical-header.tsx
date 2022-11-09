import { Box } from '~/components/base';
import { Heading } from '~/components/typography';
import { RichContent } from '~/components/cms/rich-content';
import { PortableTextEntry } from '@sanity/block-content-to-react';
import { fontSizes } from '~/style/theme';

interface TopicalHeaderProps {
  title: string;
  description: PortableTextEntry[];
}

export const TopicalHeader = ({ title, description }: TopicalHeaderProps) => {
  return (
    <Box spacing={4}>
      <Heading level={1}>{title}</Heading>
      <Box spacing={3} fontSize={fontSizes[3]}>
        <RichContent blocks={description} elementAlignment="start" />
      </Box>
    </Box>
  );
};
