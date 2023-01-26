import { Box } from '~/components/base';
import { Heading } from '~/components/typography';
import { RichContent } from '~/components/cms/rich-content';
import { PortableTextEntry } from '@sanity/block-content-to-react';
import { fontSizes } from '~/style/theme';

interface TopicalHeaderProps {
  title?: string;
  description?: PortableTextEntry[];
}

export const TopicalHeader = ({ title, description }: TopicalHeaderProps) => {
  if (!title && !description) {
    return null;
  }
  return (
    <Box spacing={4}>
      {title && <Heading level={1}>{title}</Heading>}
      {description && (
        <Box spacing={3} fontSize={fontSizes[2]}>
          <RichContent blocks={description} elementAlignment="start" />
        </Box>
      )}
    </Box>
  );
};
