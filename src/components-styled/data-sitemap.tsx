import css from '@styled-system/css';
import styled from 'styled-components';
import siteText from '~/locale/index';
import { Link } from '~/utils/link';
import { Box } from './base';
import { ContentHeader } from './content-header';
import { Tile } from './tile';
import { Text } from './typography';

export function DataSitemap() {
  return (
    <Tile>
      <ContentHeader title={siteText.nationaal_actueel.data_sitemap_titel} />
      <Box ml={5}>
        <Box>
          <Text>{siteText.nationaal_actueel.data_sitemap_toelichting}</Text>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Box>
              <Text fontWeight="bold">
                {siteText.nationaal_layout.headings.besmettingen}
              </Text>
              <DataSiteMapLink
                href="/landelijk/positief-geteste-mensen"
                text={siteText.positief_geteste_personen.titel_sidebar}
              />
              <DataSiteMapLink
                href="/landelijk/besmettelijke-mensen"
                text={siteText.besmettelijke_personen.titel_sidebar}
              />
              <DataSiteMapLink
                href="/landelijk/reproductiegetal"
                text={siteText.reproductiegetal.titel_sidebar}
              />
            </Box>
            <Box>
              <Text fontWeight="bold">
                {siteText.nationaal_layout.headings.ziekenhuizen}
              </Text>
              <DataSiteMapLink
                href="/landelijk/ziekenhuis-opnames"
                text={siteText.ziekenhuisopnames_per_dag.titel_sidebar}
              />
              <DataSiteMapLink
                href="/landelijk/intensive-care-opnames"
                text={siteText.ic_opnames_per_dag.titel_sidebar}
              />
            </Box>
            <Box>
              <Text fontWeight="bold">
                {siteText.nationaal_layout.headings.kwetsbare_groepen}
              </Text>
              <DataSiteMapLink
                href="/landelijk/verpleeghuiszorg"
                text={siteText.verpleeghuis_besmette_locaties.titel_sidebar}
              />
              <DataSiteMapLink
                href="/landelijk/gehandicaptenzorg"
                text={
                  siteText.gehandicaptenzorg_besmette_locaties.titel_sidebar
                }
              />
              <DataSiteMapLink
                href="/landelijk/thuiswonende-ouderen"
                text={siteText.thuiswonende_ouderen.titel_sidebar}
              />
            </Box>
            <Box>
              <Text fontWeight="bold">
                {siteText.nationaal_layout.headings.vroege_signalen}
              </Text>
              <DataSiteMapLink
                href="/landelijk/rioolwater"
                text={siteText.rioolwater_metingen.titel_sidebar}
              />
              <DataSiteMapLink
                href="/landelijk/verdenkingen-huisartsen"
                text={siteText.verdenkingen_huisartsen.titel_sidebar}
              />
            </Box>
            <Box>
              <Text fontWeight="bold">
                {siteText.nationaal_layout.headings.gedrag}
              </Text>
              <DataSiteMapLink
                href="/landelijk/rioolwater"
                text={siteText.nl_gedrag.sidebar.titel}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Tile>
  );
}

type DataSiteMapLinkProps = {
  href: string;
  text: string;
};

function DataSiteMapLink(props: DataSiteMapLinkProps) {
  const { href, text } = props;
  return (
    <Link href={href}>
      <StyledLink>
        <div>{text}</div>
      </StyledLink>
    </Link>
  );
}

const StyledLink = styled.a(
  css({
    fontWeight: 'bold',
    '&::after': {
      backgroundImage: `url('/images/chevron.svg')`,
      backgroundSize: '0.6em 1.2em',
      height: '1.2em',
      width: '0.6em',
      display: 'block',
      position: 'absolute',
      right: '1em',
      top: '1.35em',
    },
  })
);
