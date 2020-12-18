import { Link } from '~/utils/link';
import { Box } from './base';
import { Text } from './typography';

interface QuickLinksProps {
  links: QuickLink[];
}

interface QuickLink {
  href: string;
  text: string;
}

export function QuickLinks({ links }: QuickLinksProps) {
  return (
    <>
      <Text as="h2">Bekijk alle cijfers van het dashboard</Text>
      <Box as="ol">
        {links.map((link, index) => (
          <Box as="li" key={`${link.text}-${index}`}>
            <Link href={link.href}>
              <Text as="a" href={link.href}>
                {link.text}
              </Text>
            </Link>
          </Box>
        ))}
      </Box>
    </>
  );
}
