import { Box } from '~/components/base';
import { Heading } from '~/components/typography';
import { Markdown } from '~/components/markdown';

interface TopicalHeaderProps {
  title: string;
  description: string;
}

export const TopicalHeader = ({ title, description }: TopicalHeaderProps) => {
  return (
    <Box spacing={4}>
      <Heading level={1}>{title}</Heading>
      <Box spacing={3} fontSize={3}>
        <Markdown content={description} />
      </Box>
    </Box>
  );
};
