import { Box } from '~/components-styled/base';
import { DataSitemap } from './data-sitemap';
import { QuickLinks } from '~/components-styled/quick-links';

interface LinkBlockProps {
  header: string;
  links: QuickLink[];
}

interface QuickLink {
  href: string;
  text: string;
}

export function LinkBlock({ header, links }: LinkBlockProps) {
  return (
    <Box display="flex">
      <QuickLinks header={header} links={links} />
      <DataSitemap />
    </Box>
  );
}
