import css from '@styled-system/css';
import { asResponsiveArray } from '~/style/utils';
import { Heading } from '~/components/typography';
import { Box } from '~/components/base';
import { LinkGroup, LinkItemProps, LinkGroupProps } from './link-group';

type SitemapProps = {
  quickLinksHeader: string;
  quickLinks: LinkItemProps[];
  dataSitemapHeader: string;
  dataSitemap: LinkGroupProps[];
};

export function Sitemap({
  quickLinksHeader,
  quickLinks,
  dataSitemapHeader,
  dataSitemap,
}: SitemapProps) {
  return (
    <Box display="flex" p={4} flexDirection={{ _: 'column', md: 'row' }}>
      <Box
        position="relative"
        flexBasis={{ _: '33%', lg: '25%' }}
        pb={{ _: 4, md: 0 }}
        pr={{ _: 0, md: 3 }}
        css={css({
          '&::after': {
            content: '""',
            position: 'absolute',
            bg: 'lightGray',
            bottom: 0,
            right: 0,
            height: asResponsiveArray({ _: '1px', md: '100%' }),
            width: asResponsiveArray({ _: '100%', md: '1px' }),
          },
        })}
      >
        <Heading level={3}>{quickLinksHeader}</Heading>
        <LinkGroup links={quickLinks} />
      </Box>

      <Box
        flexBasis={{ _: '66%', lg: '75%' }}
        pt={{ _: 4, md: 0 }}
        pl={{ _: 0, md: 4 }}
      >
        <Heading level={3}>{dataSitemapHeader}</Heading>
        <Box
          display="flex"
          flexWrap="wrap"
          css={css({
            '> div': {
              flexGrow: 0,
              flexBasis: asResponsiveArray({ _: '100%', sm: '50%', lg: '33%' }),
              mb: 3,
            },
          })}
        >
          {dataSitemap.map((group: LinkGroupProps) => (
            <LinkGroup
              key={group.header}
              header={group.header}
              links={group.links}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
