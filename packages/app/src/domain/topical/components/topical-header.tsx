import { Box } from '~/components/base';
import { Heading } from '~/components/typography';
import { Markdown } from '~/components/markdown';

type TopicalDynamicDescription = {
  index: number;
  content: string;
};

interface TopicalHeaderProps {
  title: string;
  dynamicDescription: TopicalDynamicDescription[];
}

export function TopicalHeader({
  title,
  dynamicDescription,
}: TopicalHeaderProps) {
  return (
    <Box spacing={4}>
      <Heading level={1}>{title}</Heading>
      <Box spacing={3} fontSize={2}>
        {dynamicDescription.map((description) => (
          <Markdown key={description.index} content={description.content} />
        ))}
      </Box>
    </Box>
  );
}
