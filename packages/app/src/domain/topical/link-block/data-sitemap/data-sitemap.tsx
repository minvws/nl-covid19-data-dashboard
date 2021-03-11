import css from '@styled-system/css';
import { Heading } from '~/components-styled/typography';
import { Box } from '~/components-styled/base';
import siteText from '~/locale/index';
import { asResponsiveArray } from '~/style/utils';
import { LinkGroup } from './../link-group';
import { useDataSitemapLinks } from './use-data-sitemap-links';

export type DataSitemapProps = {
  base: 'landelijk' | 'veiligheidsregio' | 'gemeente';
  code?: string;
};

export function DataSitemap(props: DataSitemapProps) {
  const { base, code } = props;
  const linkGroups = useDataSitemapLinks(base, code);

  return (
    <Box>
      <Heading level={3} fontSize={3}>
        {siteText.nationaal_actueel.data_sitemap_titel}
      </Heading>

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
        {linkGroups.map((group) => (
          <LinkGroup
            key={group.header}
            header={group.header}
            links={group.links}
          />
        ))}
      </Box>
    </Box>
  );
}
